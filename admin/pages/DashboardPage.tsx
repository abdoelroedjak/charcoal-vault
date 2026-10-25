import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, AuditLog } from '../api/client';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    products: 0,
    activePricing: 0,
    faqs: 0,
    media: 0,
  });
  const [recentLogs, setRecentLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [prodRes, pricingRes, faqRes, mediaRes, auditRes] = await Promise.all([
          api.products.list().catch(() => ({ products: [] })),
          api.pricing.list().catch(() => ({ pricing: [] })),
          api.faqs.list().catch(() => ({ faqs: [] })),
          api.media.list().catch(() => ({ media: [] })),
          api.audit.list({ limit: 10 }).catch(() => ({ audit_logs: [] })),
        ]);

        const activePrices = (pricingRes.pricing || []).filter((p) => p.is_active);

        setStats({
          products: (prodRes.products || []).length,
          activePricing: activePrices.length,
          faqs: (faqRes.faqs || []).length,
          media: (mediaRes.media || []).length,
        });

        setRecentLogs(auditRes.audit_logs || []);
      } catch (err) {
        console.error('Error loading dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ color: 'var(--cv-gold)', fontSize: '15px', letterSpacing: '0.05em' }}>
          Loading Charcoal Vault Operations...
        </div>
      </div>
    );
  }

  const statCards = [
    { title: 'TOTAL PRODUCTS', value: stats.products, note: 'Catalog briquette SKUs', link: '/admin/products', icon: '📦' },
    { title: 'ACTIVE PRICING TIERS', value: stats.activePricing, note: 'EXW & FOB live rates', link: '/admin/pricing', icon: '💰' },
    { title: 'KNOWLEDGE BASE FAQS', value: stats.faqs, note: 'Buyer FAQ questions', link: '/admin/content', icon: '❓' },
    { title: 'MEDIA ASSETS', value: stats.media, note: 'Stored in Supabase bucket', link: '/admin/media', icon: '🖼️' },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1
          className="font-serif"
          style={{ fontSize: '26px', fontWeight: 700, color: 'var(--cv-gold)', letterSpacing: '0.08em', marginBottom: '8px' }}
        >
          COMMERCIAL CONTROL CENTER
        </h1>
        <p style={{ color: 'var(--cv-text-secondary)', fontSize: '13px' }}>
          Manage real-time export pricing, shisha charcoal catalog, customer inquiries, and website copy.
        </p>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '36px',
        }}
      >
        {statCards.map((card, i) => (
          <Link
            key={i}
            to={card.link}
            style={{
              textDecoration: 'none',
              backgroundColor: 'var(--cv-charcoal)',
              border: '1px solid var(--cv-border)',
              borderRadius: '8px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.2s ease, border-color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--cv-gold-dim)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--cv-border)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--cv-text-muted)', letterSpacing: '0.05em' }}>
                {card.title}
              </span>
              <span style={{ fontSize: '20px' }}>{card.icon}</span>
            </div>
            <div
              className="font-serif"
              style={{ fontSize: '32px', fontWeight: 700, color: 'var(--cv-ivory)', marginBottom: '8px' }}
            >
              {card.value}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--cv-gold)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>{card.note}</span>
              <span>→</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Launch & Action Strip */}
      <div
        style={{
          backgroundColor: 'var(--cv-surface-card)',
          border: '1px solid var(--cv-border-subtle)',
          borderRadius: '8px',
          padding: '20px 24px',
          marginBottom: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--cv-ivory)', marginBottom: '4px' }}>
            Quick Actions
          </div>
          <div style={{ fontSize: '12px', color: 'var(--cv-text-secondary)' }}>
            Jump directly into commonly accessed operational workflows.
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link to="/admin/pricing" className="btn btn-primary btn-sm">
            + Adjust Rates
          </Link>
          <Link to="/admin/products" className="btn btn-secondary btn-sm">
            + Add Product
          </Link>
          <Link to="/admin/media" className="btn btn-secondary btn-sm">
            Upload Image
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
            style={{ color: 'var(--cv-gold)' }}
          >
            Visit Public Site ↗
          </a>
        </div>
      </div>

      {/* Recent Audit Trail Preview */}
      <div
        style={{
          backgroundColor: 'var(--cv-charcoal)',
          border: '1px solid var(--cv-border)',
          borderRadius: '8px',
          padding: '24px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 className="font-serif" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--cv-gold)' }}>
              RECENT AUDIT EVENTS
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--cv-text-muted)' }}>
              Latest 10 security and data mutation logs recorded in immutable ledger.
            </p>
          </div>
          <Link to="/admin/audit" className="btn btn-secondary btn-sm">
            View All Audit Logs →
          </Link>
        </div>

        {recentLogs.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--cv-text-muted)', fontSize: '13px' }}>
            No recent audit logs available.
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Admin</th>
                  <th>Action</th>
                  <th>Resource</th>
                  <th>Resource ID</th>
                </tr>
              </thead>
              <tbody>
                {recentLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="font-mono" style={{ fontSize: '12px', color: 'var(--cv-text-secondary)' }}>
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td>{log.admin_email || 'System'}</td>
                    <td>
                      <span className="badge badge-gold">{log.action}</span>
                    </td>
                    <td style={{ textTransform: 'capitalize' }}>{log.resource_type}</td>
                    <td className="font-mono" style={{ fontSize: '12px', color: 'var(--cv-text-muted)' }}>
                      {log.resource_id ? `${log.resource_id.slice(0, 8)}...` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
