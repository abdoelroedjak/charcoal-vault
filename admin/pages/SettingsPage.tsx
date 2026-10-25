import React, { useEffect, useState } from 'react';
import { api, ContactSettings, SEOSettings } from '../api/client';
import { useToast } from '../components/Toast';

export const SettingsPage: React.FC = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [savingContact, setSavingContact] = useState(false);
  const [savingSeo, setSavingSeo] = useState(false);

  const [contactData, setContactData] = useState<ContactSettings>({
    email: '',
    whatsapp: '',
    whatsapp_display: '',
    phone: '',
    instagram: '',
    linkedin: '',
    default_wa_text: '',
    cta_url: '#contact',
  });

  const [seoData, setSeoData] = useState<SEOSettings>({
    meta_title: '',
    meta_description: '',
    og_title: '',
    og_description: '',
    og_image_url: '',
    canonical_url: '',
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const [contactRes, seoRes] = await Promise.all([
          api.contact.get().catch(() => ({ contact: {} })),
          api.seo.get().catch(() => ({ seo: {} })),
        ]);

        if (contactRes.contact) {
          setContactData((prev) => ({ ...prev, ...contactRes.contact }));
        }
        if (seoRes.seo) {
          setSeoData((prev) => ({ ...prev, ...seoRes.seo }));
        }
      } catch (err: any) {
        toast.error(err.message || 'Failed to load configuration');
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingContact(true);
    try {
      await api.contact.update(contactData);
      toast.success('Commercial contact settings saved successfully.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update contact settings');
    } finally {
      setSavingContact(false);
    }
  };

  const handleSaveSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seoData.meta_title || !seoData.meta_description) {
      toast.error('Meta title and meta description are required.');
      return;
    }

    setSavingSeo(true);
    try {
      await api.seo.update(seoData);
      toast.success('SEO & OpenGraph metadata saved successfully.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update SEO settings');
    } finally {
      setSavingSeo(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--cv-gold)' }}>
        Loading enterprise configuration...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '36px' }}>
      {/* Page Title */}
      <div>
        <h1 className="font-serif" style={{ fontSize: '24px', fontWeight: 700, color: 'var(--cv-gold)' }}>
          COMMERCIAL GATEWAY & SEO CONFIGURATION
        </h1>
        <p style={{ color: 'var(--cv-text-secondary)', fontSize: '13px' }}>
          Manage global B2B routing channels, WhatsApp hotline integration, and search engine metadata.
        </p>
      </div>

      {/* Sub-section 1: Contact Channels */}
      <div
        style={{
          backgroundColor: 'var(--cv-charcoal)',
          border: '1px solid var(--cv-border)',
          borderRadius: '8px',
          padding: '28px',
        }}
      >
        <div style={{ borderBottom: '1px solid var(--cv-border-subtle)', paddingBottom: '16px', marginBottom: '24px' }}>
          <h2 className="font-serif" style={{ fontSize: '18px', color: 'var(--cv-gold)' }}>
            1. B2B COMMUNICATION & WHATSAPP CHANNELS
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--cv-text-muted)' }}>
            All contact forms and quick-inquiry buttons dynamically link to these credentials.
          </p>
        </div>

        <form onSubmit={handleSaveContact} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label>CENTRAL INQUIRY EMAIL *</label>
              <input
                type="email"
                required
                value={contactData.email || ''}
                onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                placeholder="charcoalvault@gmail.com"
              />
            </div>
            <div>
              <label>OFFICE / FACTORY PHONE</label>
              <input
                value={contactData.phone || ''}
                onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                placeholder="+62 812-9477-9925"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label>WHATSAPP NUMBER (INTERNATIONAL DIGITS ONLY) *</label>
              <input
                required
                value={contactData.whatsapp || ''}
                onChange={(e) => setContactData({ ...contactData, whatsapp: e.target.value.replace(/[^0-9]/g, '') })}
                placeholder="6281294779925"
              />
            </div>
            <div>
              <label>WHATSAPP DISPLAY TEXT</label>
              <input
                value={contactData.whatsapp_display || ''}
                onChange={(e) => setContactData({ ...contactData, whatsapp_display: e.target.value })}
                placeholder="+62 812-9477-9925"
              />
            </div>
          </div>

          <div>
            <label>DEFAULT WHATSAPP PRE-FILLED MESSAGE</label>
            <input
              value={contactData.default_wa_text || ''}
              onChange={(e) => setContactData({ ...contactData, default_wa_text: e.target.value })}
              placeholder="Hello Charcoal Vault, I would like to inquire about shisha charcoal supply."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label>INSTAGRAM PROFILE URL</label>
              <input
                value={contactData.instagram || ''}
                onChange={(e) => setContactData({ ...contactData, instagram: e.target.value })}
                placeholder="https://instagram.com/charcoalvault"
              />
            </div>
            <div>
              <label>LINKEDIN COMPANY URL</label>
              <input
                value={contactData.linkedin || ''}
                onChange={(e) => setContactData({ ...contactData, linkedin: e.target.value })}
                placeholder="https://linkedin.com/company/charcoalvault"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
            <button type="submit" disabled={savingContact} className="btn btn-primary">
              {savingContact ? 'Saving...' : 'Save Contact Channels'}
            </button>
          </div>
        </form>
      </div>

      {/* Sub-section 2: SEO & Meta Settings */}
      <div
        style={{
          backgroundColor: 'var(--cv-charcoal)',
          border: '1px solid var(--cv-border)',
          borderRadius: '8px',
          padding: '28px',
        }}
      >
        <div style={{ borderBottom: '1px solid var(--cv-border-subtle)', paddingBottom: '16px', marginBottom: '24px' }}>
          <h2 className="font-serif" style={{ fontSize: '18px', color: 'var(--cv-gold)' }}>
            2. SEARCH ENGINE OPTIMIZATION (SEO) & OPENGRAPH
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--cv-text-muted)' }}>
            Meta tags for Google indexing, WhatsApp/LinkedIn share cards, and canonical resolution.
          </p>
        </div>

        <form onSubmit={handleSaveSeo} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label>META TITLE TAG (MAX 120 CHARACTERS) *</label>
            <input
              required
              maxLength={120}
              value={seoData.meta_title || ''}
              onChange={(e) => setSeoData({ ...seoData, meta_title: e.target.value })}
              placeholder="CHARCOAL VAULT | Premium Coconut Shell Shisha Charcoal Wholesale & Export"
            />
            <div style={{ fontSize: '11px', color: 'var(--cv-text-muted)', textAlign: 'right', marginTop: '4px' }}>
              {(seoData.meta_title || '').length} / 120 chars
            </div>
          </div>

          <div>
            <label>META DESCRIPTION (MAX 320 CHARACTERS) *</label>
            <textarea
              rows={3}
              required
              maxLength={320}
              value={seoData.meta_description || ''}
              onChange={(e) => setSeoData({ ...seoData, meta_description: e.target.value })}
              placeholder="Direct Indonesian manufacturer and exporter of 100% natural coconut shell charcoal briquettes for shisha and hookah lounges worldwide."
            />
            <div style={{ fontSize: '11px', color: 'var(--cv-text-muted)', textAlign: 'right', marginTop: '4px' }}>
              {(seoData.meta_description || '').length} / 320 chars
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label>OPENGRAPH SOCIAL TITLE</label>
              <input
                value={seoData.og_title || ''}
                onChange={(e) => setSeoData({ ...seoData, og_title: e.target.value })}
                placeholder="CHARCOAL VAULT | Indonesian Coconut Charcoal"
              />
            </div>
            <div>
              <label>CANONICAL URL</label>
              <input
                value={seoData.canonical_url || ''}
                onChange={(e) => setSeoData({ ...seoData, canonical_url: e.target.value })}
                placeholder="https://charcoal-vault.vercel.app"
              />
            </div>
          </div>

          <div>
            <label>OPENGRAPH SHARE IMAGE URL</label>
            <input
              value={seoData.og_image_url || ''}
              onChange={(e) => setSeoData({ ...seoData, og_image_url: e.target.value })}
              placeholder="/img/logo.jpg"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
            <button type="submit" disabled={savingSeo} className="btn btn-primary">
              {savingSeo ? 'Saving...' : 'Save SEO Metadata'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
