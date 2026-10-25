import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage: React.FC = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // If already logged in, redirect to dashboard
  React.useEffect(() => {
    if (user) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin/dashboard', { replace: true });
    } catch (err: any) {
      if (err.status === 429) {
        setErrorMsg('Too many attempts. Please wait 10 minutes.');
      } else {
        setErrorMsg(err.message || 'Invalid email or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--cv-black)',
        backgroundImage: 'radial-gradient(ellipse at 50% 30%, rgba(184, 149, 106, 0.08) 0%, rgba(10, 10, 10, 1) 70%)',
        padding: '24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: 'var(--cv-charcoal)',
          border: '1px solid var(--cv-border)',
          borderRadius: '8px',
          padding: '40px 32px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img
            src="/img/logo-mark.png"
            alt="Charcoal Vault"
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '6px',
              border: '1px solid var(--cv-gold-dim)',
              marginBottom: '16px',
            }}
          />
          <h1
            className="font-serif"
            style={{
              fontSize: '22px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: 'var(--cv-gold)',
              marginBottom: '6px',
            }}
          >
            CHARCOAL VAULT
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--cv-text-secondary)', letterSpacing: '0.04em' }}>
            ENTERPRISE ADMIN CMS & COMMERCE GATEWAY
          </p>
        </div>

        {errorMsg && (
          <div
            style={{
              backgroundColor: 'var(--cv-red-dim)',
              border: '1px solid var(--cv-red)',
              borderRadius: '6px',
              padding: '12px 16px',
              color: '#ff7675',
              fontSize: '13px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label htmlFor="email">ADMINISTRATOR EMAIL</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@charcoalvault.com"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password">SECURE PASSWORD</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '12px', marginTop: '10px' }}
          >
            {loading ? 'AUTHENTICATING...' : 'SIGN IN TO VAULT'}
          </button>
        </form>

        <div
          style={{
            marginTop: '32px',
            paddingTop: '20px',
            borderTop: '1px solid var(--cv-border-subtle)',
            textAlign: 'center',
            fontSize: '11px',
            color: 'var(--cv-text-muted)',
            lineHeight: 1.6,
          }}
        >
          Protected by Argon2/Bcrypt Hash Verification & Brute-Force Rate Limiting. All sign-in attempts are permanently logged.
        </div>
      </div>
    </div>
  );
};
