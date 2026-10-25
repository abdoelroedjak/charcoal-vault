import React, { useEffect, useState } from 'react';
import { api, AuditLog } from '../api/client';
import { useToast } from '../components/Toast';

export const AuditPage: React.FC = () => {
  const toast = useToast();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [resourceFilter, setResourceFilter] = useState('');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const loadAuditLogs = async () => {
    try {
      setLoading(true);
      const res = await api.audit.list({
        page,
        limit: 25,
        resource_type: resourceFilter || undefined,
      });
      setLogs(res.audit_logs || []);
      setTotalPages(res.pagination?.totalPages || 1);
      setTotalCount(res.pagination?.total || 0);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load audit trail');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuditLogs();
  }, [page, resourceFilter]);

  const toggleRow = (id: string) => {
    setExpandedRow((prev) => (prev === id ? null : id));
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
          marginBottom: '24px',
        }}
      >
        <div>
          <h1 className="font-serif" style={{ fontSize: '24px', fontWeight: 700, color: 'var(--cv-gold)' }}>
            IMMUTABLE AUDIT TRAIL
          </h1>
          <p style={{ color: 'var(--cv-text-secondary)', fontSize: '13px' }}>
            Permanent chronological log of all administrative modifications, pricing changes, and security events.
          </p>
        </div>

        {/* Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ margin: 0, fontSize: '12px' }}>FILTER BY RESOURCE:</label>
          <select
            value={resourceFilter}
            onChange={(e) => {
              setResourceFilter(e.target.value);
              setPage(1);
            }}
            style={{ width: 'auto', minWidth: '160px' }}
          >
            <option value="">All Resources ({totalCount})</option>
            <option value="pricing">Pricing Matrix</option>
            <option value="products">Products</option>
            <option value="sections">Site Sections</option>
            <option value="faqs">FAQs</option>
            <option value="media">Media Library</option>
            <option value="contact_settings">Contact Settings</option>
            <option value="seo_settings">SEO Settings</option>
            <option value="auth">Auth & Sign-in</option>
          </select>
        </div>
      </div>

      {/* Audit Logs Table */}
      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--cv-gold)' }}>
          Retrieving verified audit records...
        </div>
      ) : logs.length === 0 ? (
        <div
          style={{
            backgroundColor: 'var(--cv-charcoal)',
            border: '1px solid var(--cv-border)',
            borderRadius: '8px',
            padding: '40px',
            textAlign: 'center',
            color: 'var(--cv-text-muted)',
          }}
        >
          No audit records found matching criteria.
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Administrator</th>
                <th>Action</th>
                <th>Resource Type</th>
                <th>Resource ID</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => {
                const isExpanded = expandedRow === log.id;
                return (
                  <React.Fragment key={log.id}>
                    <tr
                      onClick={() => toggleRow(log.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td className="font-mono" style={{ fontSize: '12px', color: 'var(--cv-text-secondary)' }}>
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td style={{ fontWeight: 500 }}>{log.admin_email || 'System'}</td>
                      <td>
                        <span
                          className={`badge ${
                            log.action.includes('CREATE')
                              ? 'badge-green'
                              : log.action.includes('DELETE')
                              ? 'badge-red'
                              : 'badge-gold'
                          }`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td style={{ textTransform: 'capitalize' }}>{log.resource_type}</td>
                      <td className="font-mono" style={{ fontSize: '12px', color: 'var(--cv-text-muted)' }}>
                        {log.resource_id ? `${log.resource_id.slice(0, 8)}...` : '—'}
                      </td>
                      <td>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRow(log.id);
                          }}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '11px', padding: '4px 8px' }}
                        >
                          {isExpanded ? 'Hide Diff ▲' : 'View Diff ▼'}
                        </button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr>
                        <td
                          colSpan={6}
                          style={{
                            backgroundColor: 'var(--cv-surface-card)',
                            padding: '16px 20px',
                            borderBottom: '1px solid var(--cv-border)',
                          }}
                        >
                          <div style={{ marginBottom: '6px', fontSize: '11px', color: 'var(--cv-gold)', fontWeight: 600 }}>
                            EVENT PAYLOAD & DIFF:
                          </div>
                          <pre
                            className="font-mono"
                            style={{
                              backgroundColor: 'var(--cv-black)',
                              padding: '12px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              color: 'var(--cv-ivory-dim)',
                              overflowX: 'auto',
                              maxHeight: '260px',
                            }}
                          >
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '20px',
          color: 'var(--cv-text-muted)',
          fontSize: '13px',
        }}
      >
        <div>
          Showing Page {page} of {totalPages} ({totalCount} total events recorded)
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="btn btn-secondary btn-sm"
          >
            ← Previous
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="btn btn-secondary btn-sm"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};
