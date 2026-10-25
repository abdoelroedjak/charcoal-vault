import crypto from 'crypto';
import { handleCors } from '../../cors.js';
import { requireAuth } from '../../auth.js';
import { getSupabase } from '../../supabase.js';
import { log as auditLog } from '../../audit.js';

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const MIME_MAP = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

function validateMagicBytes(buffer) {
  if (!buffer || buffer.length < 12) return null;

  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'image/jpeg';
  }

  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return 'image/png';
  }

  if (
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38
  ) {
    return 'image/gif';
  }

  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return 'image/webp';
  }

  return null;
}

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  let authUser;
  try {
    authUser = await requireAuth(req);
  } catch (err) {
    return res.status(err.status || 401).json({ error: err.message });
  }

  const supabase = getSupabase();
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.status(200).json({ media: data || [] });
    } catch (err) {
      console.error('Error fetching media:', err);
      return res.status(500).json({ error: err.message || 'Failed to fetch media' });
    }
  }

  if (req.method === 'POST') {
    try {
      let fileBuffer = null;
      let originalName = 'upload.jpg';
      let altText = '';
      let title = '';

      const contentType = req.headers['content-type'] || '';

      if (contentType.includes('application/json')) {
        const { data, filename, alt, title: itemTitle } = req.body || {};
        if (!data) {
          return res.status(400).json({ error: 'Missing base64 data in payload' });
        }
        originalName = filename || 'upload.jpg';
        altText = alt || '';
        title = itemTitle || originalName;

        const base64Data = data.includes(';base64,') ? data.split(';base64,')[1] : data;
        fileBuffer = Buffer.from(base64Data, 'base64');
      } else {
        fileBuffer = await new Promise((resolve, reject) => {
          const chunks = [];
          req.on('data', (chunk) => chunks.push(chunk));
          req.on('end', () => resolve(Buffer.concat(chunks)));
          req.on('error', reject);
        });
      }

      if (!fileBuffer || fileBuffer.length === 0) {
        return res.status(400).json({ error: 'Empty file buffer received' });
      }

      if (fileBuffer.length > MAX_SIZE_BYTES) {
        return res.status(400).json({
          error: `File size exceeds the 5MB limit. Received ${(fileBuffer.length / (1024 * 1024)).toFixed(2)}MB.`,
        });
      }

      const detectedMime = validateMagicBytes(fileBuffer);
      if (!detectedMime || !MIME_MAP[detectedMime]) {
        return res.status(400).json({
          error: 'Invalid file format. Only JPEG, PNG, WEBP, and GIF images are allowed.',
        });
      }

      const ext = MIME_MAP[detectedMime];
      const randomHex = crypto.randomBytes(8).toString('hex');
      const safeFilename = `${Date.now()}-${randomHex}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(safeFilename, fileBuffer, {
          contentType: detectedMime,
          upsert: false,
        });

      if (uploadError) {
        console.error('Supabase storage upload error:', uploadError);
        throw new Error(uploadError.message || 'Failed to upload file to storage');
      }

      const { data: publicUrlData } = supabase.storage
        .from('media')
        .getPublicUrl(safeFilename);

      const publicUrl = publicUrlData?.publicUrl || '';

      const { data: mediaRow, error: dbError } = await supabase
        .from('media')
        .insert({
          filename: safeFilename,
          original_name: originalName,
          url: publicUrl,
          mime_type: detectedMime,
          size_bytes: fileBuffer.length,
          alt_text: altText,
          title: title || originalName,
          uploaded_by: authUser.userId,
        })
        .select('*')
        .single();

      if (dbError) throw dbError;

      await auditLog(supabase, authUser.userId, 'UPLOAD_MEDIA', 'media', mediaRow.id, {
        filename: safeFilename,
        size_bytes: fileBuffer.length,
        mime_type: detectedMime,
      });

      return res.status(201).json({
        message: 'File uploaded successfully',
        media: mediaRow,
      });
    } catch (err) {
      console.error('Error uploading media:', err);
      return res.status(500).json({ error: err.message || 'File upload failed' });
    }
  }

  if (req.method === 'DELETE') {
    const targetId = id || req.body?.id;
    if (!targetId) {
      return res.status(400).json({ error: 'Media ID is required for deletion.' });
    }

    try {
      const { data: mediaRow, error: fetchError } = await supabase
        .from('media')
        .select('*')
        .eq('id', targetId)
        .maybeSingle();

      if (fetchError || !mediaRow) {
        return res.status(404).json({ error: 'Media not found.' });
      }

      await supabase.storage.from('media').remove([mediaRow.filename]);

      const { error: deleteError } = await supabase
        .from('media')
        .delete()
        .eq('id', targetId);

      if (deleteError) throw deleteError;

      await auditLog(supabase, authUser.userId, 'DELETE_MEDIA', 'media', targetId, {
        filename: mediaRow.filename,
      });

      return res.status(200).json({ message: 'Media removed successfully', success: true });
    } catch (err) {
      console.error('Error deleting media:', err);
      return res.status(500).json({ error: err.message || 'Failed to delete media' });
    }
  }

  res.setHeader('Allow', 'GET, POST, DELETE');
  return res.status(405).json({ error: 'Method Not Allowed' });
}
