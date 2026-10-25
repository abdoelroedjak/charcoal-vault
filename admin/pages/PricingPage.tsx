import React, { useEffect, useState } from 'react';
import { api, PricingRow } from '../api/client';
import { useToast } from '../components/Toast';

export const PricingPage: React.FC = () => {
  const toast = useToast();
  const [pricingList, setPricingList] = useState<PricingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPricing, setEditingPricing] = useState<PricingRow | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<PricingRow>>({
    shipping_term: 'EXW',
    packaging: '',
    price_per_mt: 1550,
    currency: 'USD',
    moq_tons: 18,
    is_active: true,
    effective_date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const loadPricing = async () => {
    try {
      setLoading(true);
      const res = await api.pricing.list();
      setPricingList(res.pricing || []);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load pricing table');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPricing();
  }, []);

  const openCreateModal = () => {
    setEditingPricing(null);
    setFormData({
      shipping_term: 'EXW',
      packaging: '',
      price_per_mt: 1550,
      currency: 'USD',
      moq_tons: 18,
      is_active: true,
      effective_date: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (row: PricingRow) => {
    setEditingPricing(row);
    setFormData({
      ...row,
      effective_date: row.effective_date || new Date().toISOString().split('T')[0],
    });
    setModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.packaging?.trim()) {
      toast.error('Packaging description is required.');
      return;
    }
    if (!formData.price_per_mt || formData.price_per_mt <= 0) {
      toast.error('Price per MT must be a valid positive number.');
      return;
    }

    setSubmitting(true);
    try {
      if (editingPricing) {
        await api.pricing.update(editingPricing.id, formData);
        toast.success(`Pricing for ${formData.shipping_term} - ${formData.packaging} updated.`);
      } else {
        await api.pricing.create(formData);
        toast.success(`New pricing option created.`);
      }
      setModalOpen(false);
      loadPricing();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save pricing option.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleArchive = async (row: PricingRow) => {
    const confirmed = window.confirm(
      `Deactivate pricing for ${row.shipping_term} (${row.packaging})? This will immediately remove it from the public calculator.`
    );
    if (!confirmed) return;

    try {
      await api.pricing.delete(row.id);
      toast.success('Pricing tier deactivated.');
      loadPricing();
    } catch (err: any) {
      toast.error(err.message || 'Failed to deactivate pricing.');
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
          marginBottom: '20px',
        }}
      >
        <div>
          <h1 className="font-serif" style={{ fontSize: '24px', fontWeight: 700, color: 'var(--cv-gold)' }}>
            PRICING MATRIX & SHIPPING TERMS
          </h1>
          <p style={{ color: 'var(--cv-text-secondary)', fontSize: '13px' }}>
            Maintain supplier-based benchmark quotations for EXW (Ex Works) and FOB (Free on Board) container dispatches.
          </p>
        </div>
        <button onClick={openCreateModal} className="btn btn-primary">
          + Add Pricing Option
        </button>
      </div>

      {/* Warning Banner */}
      <div
        style={{
          backgroundColor: 'rgba(184, 149, 106, 0.12)',
          border: '1px solid var(--cv-gold-dim)',
          borderRadius: '6px',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '28px',
          color: 'var(--cv-ivory)',
          fontSize: '13px',
        }}
      >
        <span style={{ fontSize: '18px' }}>⚠️</span>
        <div>
          <strong style={{ color: 'var(--cv-gold)' }}>Audit Notice:</strong> Pricing changes are logged in the immutable
          audit trail with before/after diffs and reflected on the public website immediately without caching delays.
        </div>
      </div>

      {/* Pricing Table */}
      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--cv-gold)' }}>Loading pricing...</div>
      ) : pricingList.length === 0 ? (
        <div
          style={{
            backgroundColor: 'var(--cv-charcoal)',
            border: '1px solid var(--cv-border)',
            borderRadius: '8px',
            padding: '40px',
            textAlign: 'center',
          }}
        >
          <p style={{ color: 'var(--cv-text-muted)', marginBottom: '16px' }}>No pricing tiers configured.</p>
          <button onClick={openCreateModal} className="btn btn-primary btn-sm">
            Create First Rate
          </button>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Shipping Term</th>
                <th>Packaging Specification</th>
                <th>Rate / Metric Ton</th>
                <th>Currency</th>
                <th>MOQ (Tons)</th>
                <th>Effective Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pricingList.map((row) => (
                <tr key={row.id}>
                  <td>
                    <span
                      className={`badge ${
                        row.shipping_term === 'FOB' ? 'badge-gold' : 'badge-muted'
                      }`}
                      style={{ fontWeight: 700 }}
                    >
                      {row.shipping_term}
                    </span>
                  </td>
                  <td style={{ fontWeight: 500 }}>
                    <div>{row.packaging}</div>
                    {row.notes && (
                      <div style={{ fontSize: '11px', color: 'var(--cv-text-muted)', marginTop: '2px' }}>
                        {row.notes}
                      </div>
                    )}
                  </td>
                  <td className="font-serif" style={{ fontSize: '15px', fontWeight: 700, color: 'var(--cv-gold)' }}>
                    ${Number(row.price_per_mt).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="font-mono">{row.currency || 'USD'}</td>
                  <td>{row.moq_tons || 18} MT</td>
                  <td className="font-mono" style={{ fontSize: '12px', color: 'var(--cv-text-secondary)' }}>
                    {row.effective_date || 'Current'}
                  </td>
                  <td>
                    <span className={`badge ${row.is_active ? 'badge-green' : 'badge-red'}`}>
                      {row.is_active ? 'Live' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => openEditModal(row)} className="btn btn-secondary btn-sm">
                        Edit
                      </button>
                      {row.is_active && (
                        <button onClick={() => handleArchive(row)} className="btn btn-danger btn-sm">
                          Deactivate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pricing Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="font-serif" style={{ fontSize: '18px', color: 'var(--cv-gold)' }}>
                {editingPricing ? `MODIFY RATE: ${editingPricing.shipping_term} — ${editingPricing.packaging}` : 'NEW SHIPPING RATE TIER'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--cv-ivory)', fontSize: '20px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
                  <div>
                    <label>SHIPPING TERM (INCOTERMS) *</label>
                    <select
                      value={formData.shipping_term || 'EXW'}
                      onChange={(e) => setFormData({ ...formData, shipping_term: e.target.value as any })}
                    >
                      <option value="EXW">EXW — Ex Works</option>
                      <option value="FOB">FOB — Free on Board</option>
                    </select>
                  </div>
                  <div>
                    <label>PACKAGING SPECIFICATION *</label>
                    <input
                      required
                      value={formData.packaging || ''}
                      onChange={(e) => setFormData({ ...formData, packaging: e.target.value })}
                      placeholder="e.g. Masterbox Doublewall 10kg"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <div>
                    <label>PRICE PER METRIC TON (USD) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.price_per_mt || ''}
                      onChange={(e) => setFormData({ ...formData, price_per_mt: parseFloat(e.target.value) || 0 })}
                      placeholder="1605.00"
                    />
                  </div>
                  <div>
                    <label>CURRENCY</label>
                    <input
                      value={formData.currency || 'USD'}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value.toUpperCase() })}
                      placeholder="USD"
                    />
                  </div>
                  <div>
                    <label>MINIMUM ORDER (MOQ TONS)</label>
                    <input
                      type="number"
                      value={formData.moq_tons || 18}
                      onChange={(e) => setFormData({ ...formData, moq_tons: parseInt(e.target.value, 10) || 18 })}
                      placeholder="18"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label>EFFECTIVE DATE</label>
                    <input
                      type="date"
                      value={formData.effective_date || ''}
                      onChange={(e) => setFormData({ ...formData, effective_date: e.target.value })}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '28px' }}>
                    <input
                      type="checkbox"
                      id="pricing_is_active"
                      style={{ width: 'auto' }}
                      checked={!!formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    />
                    <label htmlFor="pricing_is_active" style={{ margin: 0, cursor: 'pointer' }}>
                      Publish Immediately as Live Rate
                    </label>
                  </div>
                </div>

                <div>
                  <label>COMMERCIAL NOTES / QUALIFIERS</label>
                  <textarea
                    rows={2}
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="e.g. Rate includes port delivery and vessel loading at Tanjung Priok / Surabaya."
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? 'Updating...' : editingPricing ? 'Confirm Rate Update' : 'Publish Rate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
