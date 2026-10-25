import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/admin/products', label: 'Products', icon: '📦' },
    { to: '/admin/pricing', label: 'Pricing Matrix', icon: '💰' },
    { to: '/admin/content', label: 'Site Content', icon: '📑' },
    { to: '/admin/media', label: 'Media Library', icon: '🖼️' },
    { to: '/admin/settings', label: 'Settings & SEO', icon: '⚙️' },
    { to: '/admin/audit', label: 'Audit Trail', icon: '📜' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--cv-black)' }}>
      {/* Mobile Header Bar */}
      <div
        style={{
          display: 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '60px',
          backgroundColor: 'var(--cv-charcoal)',
          borderBottom: '1px solid var(--cv-border)',
          zIndex: 900,
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
        }}
        className="mobile-header"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/img/logo-mark.png" alt="CV" style={{ width: '28px', height: '28px', borderRadius: '4px' }} />
          <span className="font-serif" style={{ fontWeight: 700, letterSpacing: '0.1em', fontSize: '15px' }}>
            CHARCOAL VAULT
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--cv-ivory)',
            fontSize: '22px',
            cursor: 'pointer',
          }}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 950,
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: '260px',
          backgroundColor: 'var(--cv-charcoal)',
          borderRight: '1px solid var(--cv-border)',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 999,
          transition: 'transform 0.3s ease',
        }}
        className={mobileMenuOpen ? 'sidebar-open' : 'sidebar-desktop'}
      >
        {/* Brand Header */}
        <div
          style={{
            padding: '24px 20px',
            borderBottom: '1px solid var(--cv-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <img
            src="/img/logo-mark.png"
            alt="Charcoal Vault Logo"
            style={{ width: '36px', height: '36px', borderRadius: '4px', border: '1px solid var(--cv-gold-dim)' }}
          />
          <div>
            <div
              className="font-serif"
              style={{
                fontSize: '15px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: 'var(--cv-gold)',
                lineHeight: 1.2,
              }}
            >
              CHARCOAL VAULT
            </div>
            <div style={{ fontSize: '11px', color: 'var(--cv-text-muted)', letterSpacing: '0.05em' }}>
              ADMIN CMS & EXPORT
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileMenuOpen(false)}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 500,
                textDecoration: 'none',
                color: isActive ? 'var(--cv-gold)' : 'var(--cv-ivory-dim)',
                backgroundColor: isActive ? 'var(--cv-surface-card)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--cv-gold)' : '3px solid transparent',
                transition: 'all 0.15s ease',
              })}
            >
              <span style={{ fontSize: '16px' }}>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Footer & Logout */}
        <div
          style={{
            padding: '16px 20px',
            borderTop: '1px solid var(--cv-border-subtle)',
            backgroundColor: 'var(--cv-surface)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--cv-graphite)',
                border: '1px solid var(--cv-gold-dim)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--cv-gold)',
              }}
            >
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--cv-ivory)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user?.email}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--cv-text-muted)', textTransform: 'capitalize' }}>
                Role: {user?.role || 'Admin'}
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main
        style={{
          flex: 1,
          padding: '32px 40px',
          overflowY: 'auto',
          minHeight: '100vh',
          backgroundColor: 'var(--cv-black)',
        }}
        className="main-content"
      >
        <Outlet />
      </main>

      <style>{`
        @media (max-width: 860px) {
          .mobile-header { display: flex !important; }
          .main-content { padding: 80px 16px 40px 16px !important; }
          aside.sidebar-desktop {
            position: fixed !important;
            transform: translateX(-100%);
          }
          aside.sidebar-open {
            position: fixed !important;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};
