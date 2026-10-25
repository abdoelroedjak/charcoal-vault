import React, { useEffect, useState } from 'react';
import { api, Product, ProductSpec } from '../api/client';
import { useToast } from '../components/Toast';

export const ProductsPage: React.FC = () => {
  const toast = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    slug: '',
    code: '',
    tagline: '',
    description: '',
    badge: '',
    size_badge: '',
    image_url: '',
    color_theme: 'gold',
    weight: '1 Kilogram',
    contains: '',
    size: '',
    grade: 'Premium Export',
    shape: 'Cube',
    ash_content: '2% – 2.5%',
    moisture: '5% – 7%',
    fixed_carbon: '77% – 83%',
    volatile_matter: '15% – 16%',
    caloric_value: '7,000 – 7,500 Kcal/kg',
    burn_time: '90 – 120 Minutes',
    light_time: '10 Minutes',
    packaging: '10kg Masterbox Doublewall',
    moq: '18 Metric Tons (18 MT)',
    status: 'active',
    order_index: 0,
    is_featured: false,
    specs: [],
  });

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await api.products.list();
      setProducts(res.products || []);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      slug: '',
      code: '',
      tagline: '',
      description: '',
      badge: '',
      size_badge: '',
      image_url: '',
      color_theme: 'gold',
      weight: '1 Kilogram',
      contains: '',
      size: '',
      grade: 'Premium Export',
      shape: 'Cube',
      ash_content: '2% – 2.5%',
      moisture: '5% – 7%',
      fixed_carbon: '77% – 83%',
      volatile_matter: '15% – 16%',
      caloric_value: '7,000 – 7,500 Kcal/kg',
      burn_time: '90 – 120 Minutes',
      light_time: '10 Minutes',
      packaging: '10kg Masterbox Doublewall',
      moq: '18 Metric Tons (18 MT)',
      status: 'active',
      order_index: products.length + 1,
      is_featured: false,
      specs: [
        { label: 'Weight', value: '1 Kilogram' },
        { label: 'Shape', value: 'Cube' },
        { label: 'Material', value: '100% Coconut Shell' },
      ],
    });
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      ...product,
      specs: Array.isArray(product.specs) ? [...product.specs] : [],
    });
    setModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    const updates: Partial<Product> = { name: val };
    // Auto-generate slug when creating new product
    if (!editingProduct) {
      updates.slug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const addSpecRow = () => {
    setFormData((prev) => ({
      ...prev,
      specs: [...(prev.specs || []), { label: '', value: '' }],
    }));
  };

  const updateSpecRow = (index: number, field: 'label' | 'value', value: string) => {
    setFormData((prev) => {
      const nextSpecs = [...(prev.specs || [])];
      nextSpecs[index] = { ...nextSpecs[index], [field]: value };
      return { ...prev, specs: nextSpecs };
    });
  };

  const removeSpecRow = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specs: (prev.specs || []).filter((_, i) => i !== index),
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.slug?.trim()) {
      toast.error('Product Name and Slug are required.');
      return;
    }

    setSubmitting(true);
    try {
      if (editingProduct) {
        await api.products.update(editingProduct.id, formData);
        toast.success(`Product "${formData.name}" updated successfully.`);
      } else {
        await api.products.create(formData);
        toast.success(`Product "${formData.name}" created successfully.`);
      }
      setModalOpen(false);
      loadProducts();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save product.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleArchive = async (product: Product) => {
    const confirmed = window.confirm(
      `Are you sure you want to archive "${product.name}"? It will be soft-deleted and removed from the public website.`
    );
    if (!confirmed) return;

    try {
      await api.products.delete(product.id);
      toast.success(`Product "${product.name}" archived.`);
      loadProducts();
    } catch (err: any) {
      toast.error(err.message || 'Failed to archive product.');
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
            PRODUCT CATALOG
          </h1>
          <p style={{ color: 'var(--cv-text-secondary)', fontSize: '13px' }}>
            Configure shisha charcoal SKUs, laboratory combustion profiles, and dimension specifications.
          </p>
        </div>
        <button onClick={openCreateModal} className="btn btn-primary">
          + Add New Product
        </button>
      </div>

      {/* Product Table */}
      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--cv-gold)' }}>Loading products...</div>
      ) : products.length === 0 ? (
        <div
          style={{
            backgroundColor: 'var(--cv-charcoal)',
            border: '1px solid var(--cv-border)',
            borderRadius: '8px',
            padding: '40px',
            textAlign: 'center',
          }}
        >
          <p style={{ color: 'var(--cv-text-muted)', marginBottom: '16px' }}>No products found in the catalog.</p>
          <button onClick={openCreateModal} className="btn btn-primary btn-sm">
            Create First Product
          </button>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Product Name</th>
                <th>Format & Size</th>
                <th>Theme</th>
                <th>Featured</th>
                <th>Status</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="font-mono" style={{ color: 'var(--cv-gold)' }}>
                    {p.code || '—'}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{p.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--cv-text-muted)' }}>/{p.slug}</div>
                  </td>
                  <td>
                    <div>{p.size || p.size_badge || 'Standard Cube'}</div>
                    <div style={{ fontSize: '11px', color: 'var(--cv-text-secondary)' }}>{p.badge || '—'}</div>
                  </td>
                  <td>
                    <span className={`badge badge-${p.color_theme || 'gold'}`}>{p.color_theme || 'gold'}</span>
                  </td>
                  <td>{p.is_featured ? <span style={{ color: 'var(--cv-gold)' }}>★ Yes</span> : 'No'}</td>
                  <td>
                    <span
                      className={`badge ${
                        p.status === 'active'
                          ? 'badge-green'
                          : p.status === 'inactive'
                          ? 'badge-muted'
                          : 'badge-red'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td>{p.order_index}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => openEditModal(p)} className="btn btn-secondary btn-sm">
                        Edit
                      </button>
                      {p.status !== 'archived' && (
                        <button onClick={() => handleArchive(p)} className="btn btn-danger btn-sm">
                          Archive
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

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '800px' }}>
            <div className="modal-header">
              <h2 className="font-serif" style={{ fontSize: '18px', color: 'var(--cv-gold)' }}>
                {editingProduct ? `EDIT PRODUCT: ${editingProduct.name}` : 'CREATE NEW PRODUCT SKU'}
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label>PRODUCT NAME *</label>
                    <input
                      required
                      value={formData.name || ''}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="e.g. CHARCOAL VAULT PLATINUM"
                    />
                  </div>
                  <div>
                    <label>URL SLUG *</label>
                    <input
                      required
                      value={formData.slug || ''}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="charcoal-vault-platinum"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
                  <div>
                    <label>CODE / NUMBER</label>
                    <input
                      value={formData.code || ''}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      placeholder="04"
                    />
                  </div>
                  <div>
                    <label>TAGLINE</label>
                    <input
                      value={formData.tagline || ''}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      placeholder="Jumbo 31mm High-Density Briquettes"
                    />
                  </div>
                </div>

                <div>
                  <label>DESCRIPTION</label>
                  <textarea
                    rows={3}
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Provide full commercial product details and target hookah application..."
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <div>
                    <label>PIECE BADGE</label>
                    <input
                      value={formData.badge || ''}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      placeholder="72 CUBES"
                    />
                  </div>
                  <div>
                    <label>SIZE BADGE</label>
                    <input
                      value={formData.size_badge || ''}
                      onChange={(e) => setFormData({ ...formData, size_badge: e.target.value })}
                      placeholder="25 x 25 x 25 mm"
                    />
                  </div>
                  <div>
                    <label>COLOR THEME</label>
                    <select
                      value={formData.color_theme || 'gold'}
                      onChange={(e) => setFormData({ ...formData, color_theme: e.target.value })}
                    >
                      <option value="gold">Gold</option>
                      <option value="blue">Blue</option>
                      <option value="purple">Purple</option>
                      <option value="green">Green</option>
                      <option value="charcoal">Charcoal</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <div>
                    <label>WEIGHT</label>
                    <input
                      value={formData.weight || ''}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      placeholder="1 Kilogram"
                    />
                  </div>
                  <div>
                    <label>CONTAINS</label>
                    <input
                      value={formData.contains || ''}
                      onChange={(e) => setFormData({ ...formData, contains: e.target.value })}
                      placeholder="72 cubes"
                    />
                  </div>
                  <div>
                    <label>DIMENSIONS (SIZE)</label>
                    <input
                      value={formData.size || ''}
                      onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                      placeholder="25 x 25 x 25 mm"
                    />
                  </div>
                </div>

                {/* Laboratory Specs Strip */}
                <div style={{ borderTop: '1px solid var(--cv-border-subtle)', paddingTop: '16px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--cv-gold)', marginBottom: '10px' }}>
                    LABORATORY COMBUSTION PROFILE
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                    <div>
                      <label>ASH CONTENT</label>
                      <input
                        value={formData.ash_content || ''}
                        onChange={(e) => setFormData({ ...formData, ash_content: e.target.value })}
                        placeholder="2% – 2.5%"
                      />
                    </div>
                    <div>
                      <label>MOISTURE</label>
                      <input
                        value={formData.moisture || ''}
                        onChange={(e) => setFormData({ ...formData, moisture: e.target.value })}
                        placeholder="5% – 7%"
                      />
                    </div>
                    <div>
                      <label>FIXED CARBON</label>
                      <input
                        value={formData.fixed_carbon || ''}
                        onChange={(e) => setFormData({ ...formData, fixed_carbon: e.target.value })}
                        placeholder="77% – 83%"
                      />
                    </div>
                    <div>
                      <label>CALORIC VALUE</label>
                      <input
                        value={formData.caloric_value || ''}
                        onChange={(e) => setFormData({ ...formData, caloric_value: e.target.value })}
                        placeholder="7,200 Kcal/kg"
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <div>
                    <label>BURNING TIME</label>
                    <input
                      value={formData.burn_time || ''}
                      onChange={(e) => setFormData({ ...formData, burn_time: e.target.value })}
                      placeholder="90 – 120 Minutes"
                    />
                  </div>
                  <div>
                    <label>LIGHTING TIME</label>
                    <input
                      value={formData.light_time || ''}
                      onChange={(e) => setFormData({ ...formData, light_time: e.target.value })}
                      placeholder="10 Minutes"
                    />
                  </div>
                  <div>
                    <label>IMAGE URL</label>
                    <input
                      value={formData.image_url || ''}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="/img/charcoal-vault-gold.jpg"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <div>
                    <label>STATUS</label>
                    <select
                      value={formData.status || 'active'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    >
                      <option value="active">Active (Visible)</option>
                      <option value="inactive">Inactive</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  <div>
                    <label>DISPLAY ORDER</label>
                    <input
                      type="number"
                      value={formData.order_index || 0}
                      onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value, 10) || 0 })}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '28px' }}>
                    <input
                      type="checkbox"
                      id="is_featured"
                      style={{ width: 'auto' }}
                      checked={!!formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    />
                    <label htmlFor="is_featured" style={{ margin: 0, cursor: 'pointer' }}>
                      Mark as Featured
                    </label>
                  </div>
                </div>

                {/* Dynamic Specs List */}
                <div style={{ borderTop: '1px solid var(--cv-border-subtle)', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--cv-gold)' }}>
                      CUSTOM SPECIFICATION PAIRS
                    </span>
                    <button type="button" onClick={addSpecRow} className="btn btn-secondary btn-sm">
                      + Add Spec
                    </button>
                  </div>
                  {(formData.specs || []).map((spec, i) => (
                    <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                      <input
                        placeholder="Label (e.g. Shape)"
                        value={spec.label}
                        onChange={(e) => updateSpecRow(i, 'label', e.target.value)}
                        style={{ flex: 1 }}
                      />
                      <input
                        placeholder="Value (e.g. Cube 25mm)"
                        value={spec.value}
                        onChange={(e) => updateSpecRow(i, 'value', e.target.value)}
                        style={{ flex: 2 }}
                      />
                      <button
                        type="button"
                        onClick={() => removeSpecRow(i)}
                        className="btn btn-danger btn-sm"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create SKU'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
