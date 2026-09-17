import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import type { Work } from '../types';

interface WorksProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const Works: React.FC<WorksProps> = ({ showToast }) => {
  const { works, categories, addWork, updateWork, deleteWork } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Work | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [client, setClient] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'active' | 'draft' | 'inactive'>('active');

  // Featured Work & Normal Description states
  const [isFeatured, setIsFeatured] = useState(false);
  const [featuredDescription, setFeaturedDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [featuredMetric1, setFeaturedMetric1] = useState('');
  const [featuredMetric2, setFeaturedMetric2] = useState('');
  const [featuredMetric3, setFeaturedMetric3] = useState('');
  const [featuredCtaText, setFeaturedCtaText] = useState('');
  const [featuredThemeColor, setFeaturedThemeColor] = useState('');
  const [featuredPriority, setFeaturedPriority] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showToast('Image size should be less than 10MB', 'error');
        return;
      }
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  // Delete states
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const filteredItems = works.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAddModal = () => {
    setEditingItem(null);
    setTitle('');
    setCategory(categories[0]?.name || '');
    setClient('');
    setImageUrl('');
    setImageFile(null);
    setStatus('active');

    // Reset featured and custom fields
    setIsFeatured(false);
    setFeaturedDescription('');
    setShortDescription('');
    setFeaturedMetric1('');
    setFeaturedMetric2('');
    setFeaturedMetric3('');
    setFeaturedCtaText('');
    setFeaturedThemeColor('');
    setFeaturedPriority(0);

    setIsModalOpen(true);
  };

  const openEditModal = (item: Work) => {
    setEditingItem(item);
    setTitle(item.title);
    setCategory(item.category);
    setClient(item.client);
    setImageUrl(item.imageUrl || '');
    setImageFile(null);
    setStatus(item.status);

    // Set editing fields
    setIsFeatured(!!item.is_featured);
    setFeaturedDescription(item.featured_description || '');
    setShortDescription(item.short_description || '');
    setFeaturedMetric1(item.featured_metric_1 || '');
    setFeaturedMetric2(item.featured_metric_2 || '');
    setFeaturedMetric3(item.featured_metric_3 || '');
    setFeaturedCtaText(item.featured_cta_text || '');
    setFeaturedThemeColor(item.featured_theme_color || '');
    setFeaturedPriority(item.featured_priority || 0);

    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Work title is required', 'error');
      return;
    }

    const data = {
      title,
      category: category || categories[0]?.name || 'UI/UX Designing',
      client,
      status,
      imageFile,
      removeImage: editingItem ? !imageUrl : false,
      is_featured: isFeatured,
      featured_description: featuredDescription,
      short_description: shortDescription,
      featured_metric_1: featuredMetric1,
      featured_metric_2: featuredMetric2,
      featured_metric_3: featuredMetric3,
      featured_cta_text: featuredCtaText,
      featured_theme_color: featuredThemeColor,
      featured_priority: featuredPriority
    };

    try {
      if (editingItem) {
        await updateWork(editingItem.id, data);
        showToast('Work updated successfully!');
      } else {
        await addWork(data);
        showToast('Work added successfully!');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Failed to save work', 'error');
    }
  };

  const promptDelete = (id: number) => {
    setDeletingId(id);
    setIsDeleteOpen(true);
  };

  const handleDelete = () => {
    if (deletingId !== null) {
      deleteWork(deletingId);
      showToast('Work deleted successfully!');
    }
    setIsDeleteOpen(false);
    setDeletingId(null);
  };

  const getMockup = (item: Work) => {
    if (item.imageUrl) return item.imageUrl;
    const mockups: Record<string, string> = {
      'Web Design': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
      'Mobile Apps': 'https://images.unsplash.com/photo-1510519138101-570d1dca3d66?w=600&auto=format&fit=crop&q=80',
      'Branding': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
      'UI/UX Designing': 'https://images.unsplash.com/photo-1541462608143-67571c6738dd?w=600&auto=format&fit=crop&q=80',
      'Illustration': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      'Motion Graphics': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80'
    };

    if (item.title.toLowerCase().includes('agency')) {
      return 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=80';
    }
    if (item.title.toLowerCase().includes('dmc')) {
      return 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80';
    }

    return mockups[item.category] || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80';
  };

  return (
    <div>
      <div className="section-header">
        <div className="section-header-left">
          <h3>All Works</h3>
          <p>Manage your portfolio works efficiently</p>
        </div>
        <button className="add-btn" onClick={openAddModal}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '16px', height: '16px', strokeWidth: '2.5px', fill: 'none' }}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          <span>Add Work</span>
        </button>
      </div>

      <div className="table-container" style={{ background: 'none', border: 'none', boxShadow: 'none', padding: 0 }}>
        <div className="table-toolbar" style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', marginBottom: '24px', padding: '16px 24px' }}>
          <div className="table-search">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search works by title or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <span className="table-count">{filteredItems.length} works</span>
        </div>

        {filteredItems.length === 0 ? (
          <div className="empty-state" style={{ background: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
            <div className="empty-icon">🎨</div>
            <p>No works found. Add your first work!</p>
          </div>
        ) : (
          <div className="works-grid">
            {filteredItems.map(item => (
              <div className="work-card" key={item.id}>
                <div className="work-card-image">
                  <img src={getMockup(item)} alt={item.title} />
                  <span className="work-card-badge">{item.status}</span>
                  {item.is_featured && (
                    <span className="work-card-badge" style={{ left: '16px', right: 'auto', backgroundColor: '#8b5cf6', color: '#ffffff', fontWeight: 'bold' }}>Featured</span>
                  )}
                </div>
                <div className="work-card-body">
                  <h4 className="work-card-title">{item.title}</h4>
                  <div className="work-card-tag">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2H2v10l9.29 9.29c.39.39 1.02.39 1.41 0l7.59-7.59c.39-.39.39-1.02 0-1.41L12 2z"></path><path d="M7 7h.01"></path></svg>
                    <span>{item.category}</span>
                  </div>
                  <div className="work-card-client">Client: {item.client || 'N/A'}</div>
                </div>
                <div className="work-card-footer">
                  <button className="work-card-btn edit" onClick={() => openEditModal(item)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    <span>Edit</span>
                  </button>
                  <button className="work-card-btn delete" onClick={() => promptDelete(item.id)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay active" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingItem ? 'Edit Work' : 'Add Work'}</h3>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Work title"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    {categories.length === 0 ? (
                      <option value="UI/UX Designing">UI/UX Designing</option>
                    ) : (
                      categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)
                    )}
                  </select>
                </div>
                <div className="form-group">
                  <label>Client</label>
                  <input
                    type="text"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    placeholder="Client name"
                  />
                </div>
                <div className="form-group">
                  <label>Image (Optional)</label>
                  {imageUrl ? (
                    <div className="image-preview-container">
                      <img src={imageUrl} alt="Preview" className="image-preview-img" />
                      <button
                        type="button"
                        className="image-preview-remove"
                        onClick={() => setImageUrl('')}
                        title="Remove Image"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '14px', height: '14px', strokeWidth: '2.5px', fill: 'none' }}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </button>
                    </div>
                  ) : (
                    <div className="image-upload-zone">
                      <div className="image-upload-icon">📁</div>
                      <div className="image-upload-text">Drag & drop your file here, or browse</div>
                      <div className="image-upload-hint">Supports PNG, JPG, GIF (Max 10MB)</div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </div>
                  )}
                </div>
                {/* Featured Work Toggle */}
                <div className="form-group" style={{ marginTop: '16px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(139, 92, 246, 0.04)', border: '1px solid rgba(139, 92, 246, 0.15)', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Mark as Featured Work</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Turn this project into a cinematic featured takeover</span>
                    </div>
                    <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={isFeatured} 
                        onChange={(e) => setIsFeatured(e.target.checked)} 
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span className="slider round" style={{ 
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                        backgroundColor: isFeatured ? '#8b5cf6' : '#cccccc', 
                        transition: '0.3s', borderRadius: '24px' 
                      }}>
                        <span style={{
                          position: 'absolute', content: '""', height: '18px', width: '18px', left: isFeatured ? '22px' : '3px', bottom: '3px',
                          backgroundColor: 'white', transition: '0.3s', borderRadius: '50%'
                        }} />
                      </span>
                    </label>
                  </div>
                </div>

                {/* Normal Work Field: Short Description */}
                {!isFeatured && (
                  <div className="form-group" style={{ transition: 'all 0.3s ease' }}>
                    <label>Short Description</label>
                    <input
                      type="text"
                      value={shortDescription}
                      onChange={(e) => setShortDescription(e.target.value)}
                      placeholder="Single or two-line clean description (Max 150 chars)"
                    />
                  </div>
                )}

                {/* Featured Work Fields (Expand Dynamically) */}
                {isFeatured && (
                  <div style={{
                    display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px', 
                    background: 'rgba(139, 92, 246, 0.02)', border: '1px solid rgba(139, 92, 246, 0.08)', 
                    borderRadius: '12px', marginTop: '8px', marginBottom: '16px'
                  }}>
                    <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#8b5cf6', margin: 0, fontWeight: 700 }}>
                      Cinematic Featured Settings
                    </h4>
                    
                    <div className="form-group">
                      <label>Featured Description (Large Detailed Editorial Text)</label>
                      <textarea
                        value={featuredDescription}
                        onChange={(e) => setFeaturedDescription(e.target.value)}
                        placeholder="We engineered a custom high-fidelity digital system for... (supports multiline storytelling)"
                        rows={4}
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-light)', borderRadius: '6px', fontSize: '0.9rem', outline: 'none' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                      <div className="form-group">
                        <label>Metric 1</label>
                        <input
                          type="text"
                          value={featuredMetric1}
                          onChange={(e) => setFeaturedMetric1(e.target.value)}
                          placeholder="e.g. +180% Engagement"
                        />
                      </div>
                      <div className="form-group">
                        <label>Metric 2</label>
                        <input
                          type="text"
                          value={featuredMetric2}
                          onChange={(e) => setFeaturedMetric2(e.target.value)}
                          placeholder="e.g. 3.5x Bookings"
                        />
                      </div>
                      <div className="form-group">
                        <label>Metric 3</label>
                        <input
                          type="text"
                          value={featuredMetric3}
                          onChange={(e) => setFeaturedMetric3(e.target.value)}
                          placeholder="e.g. 99.9% Uptime"
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="form-group">
                        <label>Featured CTA Text</label>
                        <input
                          type="text"
                          value={featuredCtaText}
                          onChange={(e) => setFeaturedCtaText(e.target.value)}
                          placeholder="Explore Case Study"
                        />
                      </div>
                      <div className="form-group">
                        <label>Display Priority</label>
                        <input
                          type="number"
                          value={featuredPriority}
                          onChange={(e) => setFeaturedPriority(parseInt(e.target.value) || 0)}
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Atmosphere Color (e.g. from-[#8b5cf6] to-[#4f46e5])</label>
                      <input
                        type="text"
                        value={featuredThemeColor}
                        onChange={(e) => setFeaturedThemeColor(e.target.value)}
                        placeholder="e.g. from-[#8b5cf6] to-[#4f46e5]"
                      />
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label>Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value as any)}>
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">{editingItem ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteOpen && (
        <div className="modal-overlay active" onClick={() => setIsDeleteOpen(false)}>
          <div className="modal confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-body" style={{ padding: '32px', textAlign: 'center' }}>
              <div className="confirm-icon" style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(244, 63, 94, 0.1)',
                color: 'var(--accent-rose)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '28px', height: '28px', strokeWidth: 2 }}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              </div>
              <h3 style={{ marginBottom: '8px', fontSize: '1.25rem', fontWeight: 700 }}>Delete Work</h3>
              <p className="confirm-text" style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>
                Are you sure you want to delete this work? This action cannot be undone.
              </p>
              <div className="confirm-actions" style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button className="btn-secondary" onClick={() => setIsDeleteOpen(false)}>Cancel</button>
                <button className="btn-danger" onClick={handleDelete}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Works;
