/**
 * Audit Logging Helper
 * Records administrative actions to the immutable audit_logs table.
 */

async function log(supabase, userId, action, resourceType, resourceId = null, details = {}) {
  try {
    if (!supabase) return;
    
    await supabase.from('audit_logs').insert({
      admin_user_id: userId || null,
      action: String(action),
      resource_type: String(resourceType),
      resource_id: resourceId ? String(resourceId) : null,
      details: typeof details === 'object' && details !== null ? details : { raw: details },
    });
  } catch (err) {
    // Audit logging should never bring down a transaction, but should always be reported
    console.error('⚠️ Failed to record audit log:', err.message || err);
  }
}

module.exports = {
  log,
};
