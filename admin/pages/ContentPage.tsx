import React, { useEffect, useState } from 'react';
import { api, Section, FAQ } from '../api/client';
import { useToast } from '../components/Toast';

type TabKey = 'hero' | 'about' | 'process' | 'faqs' | 'cta' | 'footer';

export const ContentPage: React.FC = () => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<TabKey>('hero');
  const [sections, setSections] = useState<Record<string, Section>>({});
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // FAQ Modal state
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [faqForm, setFaqForm] = useState<{ question: string; answer: string; order_index: number; is_active: boolean }>({
    question: '',
    answer: '',
    order_index: 0,
    is_active: true,
  });

  const loadAllContent = async () => {
    try {
      setLoading(true);
      const [secRes, faqRes] = await Promise.all([
        api.sections.list().catch(() => ({ sections: [] })),
        api.faqs.list().catch(() => ({ faqs: [] })),
      ]);

      const secMap: Record<string, Section> = {};
      (secRes.sections || []).forEach((s) => {
        secMap[s.section_key] = s;
      });
      setSections(secMap);
      setFaqs(faqRes.faqs || []);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllContent();
  }, []);

  const handleSectionFieldChange = (key: string, field: keyof Section, value: any) => {
    setSections((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] || { id: '', section_key: key, is_enabled: true, order_index: 0 }),
        [field]: value,
      },
    }));
  };

  const saveSection = async (key: string) => {
    const sec = sections[key];
    if (!sec) return;

    setSaving(true);
    try {
      await api.sections.update(key, {
        section_key: key,
        title: sec.title,
        subtitle: sec.subtitle,
        body_text: sec.body_text,
        cta_text: sec.cta_text,
        cta_url: sec.cta_url,
        image_url: sec.image_url,
        extra_data: sec.extra_data || {},
        is_enabled: sec.is_enabled ?? true,
      });
      toast.success(`Section [${key.toUpperCase()}] saved successfully.`);
    } catch (err: any) {
      toast.error(err.message || `Failed to save ${key} section`);
    } finally {
      setSaving(false);
    }
  };

  // FAQ Handlers
  const openCreateFaq = () => {
    setEditingFaq(null);
    setFaqForm({
      question: '',
      answer: '',
      order_index: faqs.length,
      is_active: true,
    });
    setFaqModalOpen(true);
  };

  const openEditFaq = (faq: FAQ) => {
    setEditingFaq(faq);
    setFaqForm({
      question: faq.question,
      answer: faq.answer,
      order_index: faq.order_index,
      is_active: faq.is_active,
    });
    setFaqModalOpen(true);
  };

  const saveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqForm.question.trim() || !faqForm.answer.trim()) {
      toast.error('Question and Answer are required.');
      return;
    }

    try {
      if (editingFaq) {
        await api.faqs.update(editingFaq.id, faqForm);
        toast.success('FAQ updated successfully.');
      } else {
        await api.faqs.create(faqForm);
        toast.success('FAQ created successfully.');
      }
      setFaqModalOpen(false);
      const res = await api.faqs.list();
      setFaqs(res.faqs || []);
    } catch (err: any) {
      toast.error(err.message || 'Failed to save FAQ');
    }
  };

  const deleteFaq = async (faq: FAQ) => {
    if (!window.confirm(`Delete question: "${faq.question}"?`)) return;
    try {
      await api.faqs.delete(faq.id);
      toast.success('FAQ deleted.');
      setFaqs(faqs.filter((f) => f.id !== faq.id));
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete FAQ');
    }
  };

  const moveFaq = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= faqs.length) return;

    const newFaqs = [...faqs];
    const temp = newFaqs[index];
    newFaqs[index] = newFaqs[targetIndex];
    newFaqs[targetIndex] = temp;

    // Update order_index
    newFaqs.forEach((f, idx) => {
      f.order_index = idx;
    });
    setFaqs(newFaqs);

    try {
      await Promise.all([
        api.faqs.update(newFaqs[index].id, { order_index: index }),
        api.faqs.update(newFaqs[targetIndex].id, { order_index: targetIndex }),
      ]);
      toast.success('FAQ order updated.');
    } catch {
      toast.error('Failed to persist FAQ reordering.');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--cv-gold)' }}>
        Loading site sections & copy...
      </div>
    );
  }

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'hero', label: 'Hero Section' },
    { key: 'about', label: 'About & Quality' },
    { key: 'process', label: 'Supply Process' },
    { key: 'faqs', label: 'Frequently Asked Questions' },
    { key: 'cta', label: 'Call To Action' },
    { key: 'footer', label: 'Footer & Disclaimer' },
  ];

  const currentSec = sections[activeTab] || {
    id: '',
    section_key: activeTab,
    title: '',
    subtitle: '',
    body_text: '',
    cta_text: '',
    cta_url: '',
    image_url: '',
    is_enabled: true,
    order_index: 0,
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
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
            WEBSITE CONTENT & MARKETING COPY
          </h1>
          <p style={{ color: 'var(--cv-text-secondary)', fontSize: '13px' }}>
            Customize editorial headings, call-to-actions, brand statements, and buyer FAQs.
          </p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary btn-sm"
          style={{ color: 'var(--cv-gold)' }}
        >
          Preview Live Website ↗
        </a>
      </div>

      {/* Tabs Bar */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          borderBottom: '1px solid var(--cv-border)',
          marginBottom: '28px',
          paddingBottom: '2px',
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '10px 18px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600,
              color: activeTab === tab.key ? 'var(--cv-gold)' : 'var(--cv-text-secondary)',
              borderBottom: activeTab === tab.key ? '2px solid var(--cv-gold)' : '2px solid transparent',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* FAQs Tab View */}
      {activeTab === 'faqs' ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 className="font-serif" style={{ fontSize: '18px', color: 'var(--cv-gold)' }}>
                FREQUENTLY ASKED QUESTIONS ({faqs.length})
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--cv-text-secondary)' }}>
                Questions displayed on the public FAQ accordion section.
              </p>
            </div>
            <button onClick={openCreateFaq} className="btn btn-primary btn-sm">
              + Add FAQ Question
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, index) => (
              <div
                key={faq.id}
                style={{
                  backgroundColor: 'var(--cv-charcoal)',
                  border: '1px solid var(--cv-border)',
                  borderRadius: '6px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span className="badge badge-gold font-mono">Q{index + 1}</span>
                    <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--cv-ivory)' }}>
                      {faq.question}
                    </h3>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--cv-text-secondary)', lineHeight: 1.5 }}>
                    {faq.answer}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    onClick={() => moveFaq(index, 'up')}
                    disabled={index === 0}
                    className="btn btn-secondary btn-sm"
                    title="Move Up"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => moveFaq(index, 'down')}
                    disabled={index === faqs.length - 1}
                    className="btn btn-secondary btn-sm"
                    title="Move Down"
                  >
                    ▼
                  </button>
                  <button onClick={() => openEditFaq(faq)} className="btn btn-secondary btn-sm">
                    Edit
                  </button>
                  <button onClick={() => deleteFaq(faq)} className="btn btn-danger btn-sm">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Section Form */
        <div
          style={{
            backgroundColor: 'var(--cv-charcoal)',
            border: '1px solid var(--cv-border)',
            borderRadius: '8px',
            padding: '28px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2 className="font-serif" style={{ fontSize: '18px', color: 'var(--cv-gold)' }}>
                EDITING: {activeTab.toUpperCase()}
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--cv-text-muted)' }}>
                Section Key: <code className="font-mono">{activeTab}</code>
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                id={`enable_${activeTab}`}
                style={{ width: 'auto' }}
                checked={currentSec.is_enabled ?? true}
                onChange={(e) => handleSectionFieldChange(activeTab, 'is_enabled', e.target.checked)}
              />
              <label htmlFor={`enable_${activeTab}`} style={{ margin: 0, cursor: 'pointer' }}>
                Section Enabled on Public Site
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label>PRIMARY TITLE / HEADLINE</label>
              <input
                value={currentSec.title || ''}
                onChange={(e) => handleSectionFieldChange(activeTab, 'title', e.target.value)}
                placeholder="Section Headline"
              />
            </div>

            <div>
              <label>SUBTITLE / STRAPLINE</label>
              <input
                value={currentSec.subtitle || ''}
                onChange={(e) => handleSectionFieldChange(activeTab, 'subtitle', e.target.value)}
                placeholder="Supporting descriptor"
              />
            </div>

            <div>
              <label>BODY TEXT / NARRATIVE</label>
              <textarea
                rows={4}
                value={currentSec.body_text || ''}
                onChange={(e) => handleSectionFieldChange(activeTab, 'body_text', e.target.value)}
                placeholder="Full section descriptive copy..."
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label>CTA BUTTON LABEL</label>
                <input
                  value={currentSec.cta_text || ''}
                  onChange={(e) => handleSectionFieldChange(activeTab, 'cta_text', e.target.value)}
                  placeholder="e.g. REQUEST CONTAINER QUOTE"
                />
              </div>
              <div>
                <label>CTA TARGET URL / ANCHOR</label>
                <input
                  value={currentSec.cta_url || ''}
                  onChange={(e) => handleSectionFieldChange(activeTab, 'cta_url', e.target.value)}
                  placeholder="e.g. #contact"
                />
              </div>
            </div>

            <div>
              <label>BACKGROUND OR FEATURED IMAGE URL</label>
              <input
                value={currentSec.image_url || ''}
                onChange={(e) => handleSectionFieldChange(activeTab, 'image_url', e.target.value)}
                placeholder="/img/charcoal-vault-gold.jpg"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button
                onClick={() => saveSection(activeTab)}
                disabled={saving}
                className="btn btn-primary"
                style={{ minWidth: '160px' }}
              >
                {saving ? 'Saving...' : `Save ${activeTab.toUpperCase()}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Modal */}
      {faqModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="font-serif" style={{ fontSize: '18px', color: 'var(--cv-gold)' }}>
                {editingFaq ? 'EDIT FAQ ITEM' : 'ADD NEW FAQ ITEM'}
              </h2>
              <button
                onClick={() => setFaqModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--cv-ivory)', fontSize: '20px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={saveFaq}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label>QUESTION *</label>
                  <input
                    required
                    value={faqForm.question}
                    onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                    placeholder="e.g. What is the minimum order quantity?"
                  />
                </div>

                <div>
                  <label>ANSWER *</label>
                  <textarea
                    rows={4}
                    required
                    value={faqForm.answer}
                    onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                    placeholder="Provide thorough commercial or logistical explanation..."
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    id="faq_is_active"
                    style={{ width: 'auto' }}
                    checked={faqForm.is_active}
                    onChange={(e) => setFaqForm({ ...faqForm, is_active: e.target.checked })}
                  />
                  <label htmlFor="faq_is_active" style={{ margin: 0, cursor: 'pointer' }}>
                    Publish question on public FAQ
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setFaqModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
