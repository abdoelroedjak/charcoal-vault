import React, { useEffect, useState, useRef } from 'react';
import { api, MediaItem } from '../api/client';
import { useToast } from '../components/Toast';

export const MediaPage: React.FC = () => {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const loadMedia = async () => {
    try {
      setLoading(true);
      const res = await api.media.list();
      setMediaList(res.media || []);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load media assets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds the 5MB maximum limit.');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid format. Only JPEG, PNG, WEBP, and GIF are permitted.');
      return;
    }

    setUploading(true);
    try {
      // Read file as base64
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = reader.result as string;
          await api.media.upload({
            data: base64,
            filename: file.name,
            alt: file.name.replace(/\.[^/.]+$/, ''),
            title: file.name,
          });
          toast.success(`Image "${file.name}" uploaded successfully.`);
          loadMedia();
        } catch (uploadErr: any) {
          toast.error(uploadErr.message || 'Upload failed');
        } finally {
          setUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      };
      reader.onerror = () => {
        toast.error('Failed to read file from disk');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      toast.error(err.message || 'Upload error');
      setUploading(false);
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('Asset URL copied to clipboard.');
  };

  const handleDelete = async (item: MediaItem) => {
    if (!window.confirm(`Delete image "${item.original_name || item.filename}" permanently from storage?`)) return;

    try {
      await api.media.delete(item.id);
      toast.success('Media asset removed.');
      setMediaList(mediaList.filter((m) => m.id !== item.id));
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete asset');
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <div>
          <h1 className="font-serif" style={{ fontSize: '24px', fontWeight: 700, color: 'var(--cv-gold)' }}>
            MEDIA ASSET REPOSITORY
          </h1>
          <p style={{ color: 'var(--cv-text-secondary)', fontSize: '13px' }}>
            Upload high-resolution packaging photography, laboratory certificates, and container dispatch media.
          </p>
        </div>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="btn btn-primary"
          >
            {uploading ? 'Uploading Asset...' : '+ Upload Image Asset'}
          </button>
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--cv-gold)' }}>Loading media library...</div>
      ) : mediaList.length === 0 ? (
        <div
          style={{
            backgroundColor: 'var(--cv-charcoal)',
            border: '1px solid var(--cv-border)',
            borderRadius: '8px',
            padding: '60px 20px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>🖼️</div>
          <h3 className="font-serif" style={{ fontSize: '18px', color: 'var(--cv-ivory)', marginBottom: '8px' }}>
            No Media Assets Uploaded Yet
          </h3>
          <p style={{ color: 'var(--cv-text-muted)', fontSize: '13px', marginBottom: '20px' }}>
            Upload high-resolution JPG, PNG, or WEBP imagery up to 5MB.
          </p>
          <button onClick={() => fileInputRef.current?.click()} className="btn btn-primary btn-sm">
            Select Image to Upload
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '24px',
          }}
        >
          {mediaList.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: 'var(--cv-charcoal)',
                border: '1px solid var(--cv-border)',
                borderRadius: '8px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'border-color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--cv-gold-dim)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--cv-border)')}
            >
              {/* Thumbnail Container */}
              <div
                style={{
                  height: '180px',
                  backgroundColor: 'var(--cv-surface-card)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <img
                  src={item.url}
                  alt={item.alt_text || item.original_name || 'Charcoal Vault Media'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    // Fallback visual if preview fails
                    (e.currentTarget as HTMLImageElement).src = '/img/logo-mark.png';
                  }}
                />
                <span
                  className="badge badge-gold font-mono"
                  style={{ position: 'absolute', top: '8px', right: '8px', fontSize: '10px' }}
                >
                  {item.mime_type.split('/')[1]?.toUpperCase()}
                </span>
              </div>

              {/* Item Info */}
              <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ marginBottom: '12px' }}>
                  <div
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--cv-ivory)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      marginBottom: '4px',
                    }}
                    title={item.original_name || item.filename}
                  >
                    {item.original_name || item.filename}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--cv-text-muted)' }}>
                    {item.size_bytes ? `${(item.size_bytes / 1024).toFixed(1)} KB` : 'Unknown size'} •{' '}
                    {new Date(item.created_at || '').toLocaleDateString()}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => copyUrl(item.url)}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1 }}
                  >
                    Copy URL
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
