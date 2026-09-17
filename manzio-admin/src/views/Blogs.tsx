import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import type { Blog } from '../types';

interface BlogsProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const Blogs: React.FC<BlogsProps> = ({ showToast }) => {
  const { blogs, addBlog, updateBlog, deleteBlog } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Blog | null>(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  // Delete states
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const filteredItems = blogs.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.metaDescription && item.metaDescription.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const openAddModal = () => {
    setEditingItem(null);
    setTitle('');
    setDate(new Date().toISOString().split('T')[0]);
    setMetaDescription('');
    setDescription('');
    setImages([]);
    setImageFiles([]);
    setIsModalOpen(true);
  };

  const openEditModal = (item: Blog) => {
    setEditingItem(item);
    setTitle(item.title);
    setDate(item.date || '');
    setMetaDescription(item.metaDescription || '');
    setDescription(item.description || '');
    setImages(item.images || []);
    setImageFiles([]);
    setIsModalOpen(true);
  };

  const handleMultipleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const selectedFiles = Array.from(files);
      const validFiles = selectedFiles.filter(file => {
        if (file.size > 10 * 1024 * 1024) {
          showToast(`Image ${file.name} exceeds 10MB limit`, 'error');
          return false;
        }
        return true;
      });

      setImageFiles(prev => [...prev, ...validFiles]);
      const newUrls = validFiles.map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newUrls]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    // If the index to remove is from the newly added files, we filter it out
    // Since images state has existing images followed by new preview URLs:
    const existingCount = editingItem ? (editingItem.images?.length || 0) : 0;
    if (indexToRemove >= existingCount) {
      const fileIndex = indexToRemove - existingCount;
      setImageFiles(prev => prev.filter((_, idx) => idx !== fileIndex));
    }
    setImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Blog title is required', 'error');
      return;
    }
    if (!date) {
      showToast('Blog date is required', 'error');
      return;
    }

    const data = {
      title: title.trim(),
      date,
      metaDescription: metaDescription.trim(),
      description: description.trim(),
      imageFiles,
      removeImages: editingItem ? images.length === 0 : false
    };

    try {
      if (editingItem) {
        await updateBlog(editingItem.id, data);
        showToast('Blog post updated successfully!');
      } else {
        await addBlog(data);
        showToast('Blog post added successfully!');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Failed to save blog post', 'error');
    }
  };

  const promptDelete = (id: number) => {
    setDeletingId(id);
    setIsDeleteOpen(true);
  };

  const handleDelete = () => {
    if (deletingId !== null) {
      deleteBlog(deletingId);
      showToast('Blog post deleted successfully!');
    }
    setIsDeleteOpen(false);
    setDeletingId(null);
  };

  return (
    <div>
      <div className="section-header">
        <div className="section-header-left">
          <h3>All Blogs</h3>
          <p>Manage your blog posts</p>
        </div>
        <button className="add-btn" onClick={openAddModal}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '16px', height: '16px', strokeWidth: '2.5px', fill: 'none' }}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          <span>Add Blog</span>
        </button>
      </div>

      <div className="table-container">
        <div className="table-toolbar">
          <div className="table-search">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <span className="table-count">{filteredItems.length} posts</span>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>TITLE</th>
              <th>DATE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📻</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>No blogs found</div>
                  <div style={{ fontSize: '0.85rem' }}>Get started by adding your first blog post</div>
                </td>
              </tr>
            ) : (
              filteredItems.map(item => (
                <tr key={item.id}>
                  <td>#{item.id}</td>
                  <td><strong>{item.title}</strong></td>
                  <td>{item.date}</td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn edit" onClick={() => openEditModal(item)} title="Edit">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '14px', height: '14px', strokeWidth: '2.5px', fill: 'none' }}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      </button>
                      <button className="action-btn delete" onClick={() => promptDelete(item.id)} title="Delete">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '14px', height: '14px', strokeWidth: '2.5px', fill: 'none' }}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay active" onClick={() => setIsModalOpen(false)}>
          <div className="modal" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingItem ? 'Edit Blog' : 'Add Blog'}</h3>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Title & Date side-by-side */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      <span style={{ color: '#8b5cf6', display: 'inline-flex', alignItems: 'center' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '16px', height: '16px' }}>
                          <path d="M6 4v16M18 4v16M6 12h12" />
                        </svg>
                      </span>
                      <span>Title</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Blog title"
                      required
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      <span style={{ color: '#8b5cf6', display: 'inline-flex', alignItems: 'center' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '16px', height: '16px' }}>
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      </span>
                      <span>Date</span>
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Meta Description */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    <span style={{ color: '#8b5cf6', display: 'inline-flex', alignItems: 'center' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '16px', height: '16px' }}>
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                      </svg>
                    </span>
                    <span>Meta Description</span>
                  </label>
                  <textarea
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Short meta description"
                    style={{ minHeight: '80px', resize: 'vertical' }}
                  />
                </div>

                {/* Description */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    <span style={{ color: '#8b5cf6', display: 'inline-flex', alignItems: 'center' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '16px', height: '16px' }}>
                        <line x1="21" y1="10" x2="3" y2="10" />
                        <line x1="21" y1="6" x2="3" y2="6" />
                        <line x1="21" y1="14" x2="3" y2="14" />
                        <line x1="21" y1="18" x2="3" y2="18" />
                      </svg>
                    </span>
                    <span>Description</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Blog content"
                    style={{ minHeight: '140px', resize: 'vertical' }}
                  />
                </div>

                {/* Images */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    <span style={{ color: '#8b5cf6', display: 'inline-flex', alignItems: 'center' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '16px', height: '16px' }}>
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </span>
                    <span>Images</span>
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '2px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 12px',
                    background: 'var(--bg-white)',
                    position: 'relative',
                    cursor: 'pointer'
                  }}>
                    <button type="button" style={{
                      background: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      borderRadius: '4px',
                      padding: '6px 12px',
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      color: '#475569',
                      marginRight: '12px',
                      pointerEvents: 'none'
                    }}>
                      Choose Files
                    </button>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {images.length > 0 ? `${images.length} file(s) selected` : 'No file chosen'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleMultipleFilesChange}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: 0,
                        cursor: 'pointer',
                        width: '100%',
                        height: '100%'
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '6px' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '14px', height: '14px' }}>
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    <span>You can select multiple images</span>
                  </div>

                  {/* Previews */}
                  {images.length > 0 && (
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '14px' }}>
                      {images.map((img, idx) => (
                        <div key={idx} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                          <img src={img} alt={`Preview ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            style={{
                              position: 'absolute',
                              top: '4px',
                              right: '4px',
                              background: 'rgba(244, 63, 94, 0.95)',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '50%',
                              width: '20px',
                              height: '20px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                              transition: 'background 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#e11d48'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(244, 63, 94, 0.95)'}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
              <div className="modal-footer" style={{ marginTop: '10px' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '16px', height: '16px', fill: 'none' }}>
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  <span>Save</span>
                </button>
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
              <h3 style={{ marginBottom: '8px', fontSize: '1.25rem', fontWeight: 700 }}>Delete Blog</h3>
              <p className="confirm-text" style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>
                Are you sure you want to delete this blog post? This action cannot be undone.
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

export default Blogs;
