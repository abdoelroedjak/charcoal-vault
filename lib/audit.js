export async function log(supabase, adminUserId, action, resourceType, resourceId, details = {}) {
  try {
    if (!supabase) return;
    await supabase.from('audit_logs').insert({
      admin_user_id: adminUserId,
      action: action,
      resource_type: resourceType,
      resource_id: resourceId ? String(resourceId) : null,
      details: details,
    });
  } catch (err) {
    console.error('Audit logging failed (non-blocking):', err);
  }
}
