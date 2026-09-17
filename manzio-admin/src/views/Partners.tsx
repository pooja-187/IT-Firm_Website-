import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import type { Partner } from '../types';

interface PartnersProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const Partners: React.FC<PartnersProps> = ({ showToast }) => {
  const { partners, addPartner, updatePartner, deletePartner } = useData();
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sectorFilter, setSectorFilter] = useState<string>('all');
  
  // Inline feedback state for email copy action
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partner | null>(null);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [contact, setContact] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  // Delete states
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Derive unique sectors for filter dropdown
  const uniqueSectors = Array.from(
    new Set(partners.map(item => item.type).filter(Boolean))
  ).sort();

  // Multi-dimensional filtering logic
  const filteredItems = partners.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.contact.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesSector = sectorFilter === 'all' || item.type === sectorFilter;

    return matchesSearch && matchesStatus && matchesSector;
  });

  // Calculate statistics
  const totalCount = partners.length;
  const activeCount = partners.filter(p => p.status === 'active').length;
  const inactiveCount = partners.filter(p => p.status === 'inactive').length;

  const getInitials = (companyName: string) => {
    const words = companyName.trim().split(/\s+/);
    if (words.length >= 2) {
      // First letter of the first two words
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    // First two letters of the name
    return companyName.replace(/[^a-zA-Z0-9]/g, '').slice(0, 2).toUpperCase();
  };

  const handleCopyEmail = (e: React.MouseEvent, id: number, email: string) => {
    e.stopPropagation();
    if (!email) return;

    navigator.clipboard.writeText(email).then(() => {
      setCopiedId(id);
      showToast(`Copied ${email} to clipboard!`);
      setTimeout(() => {
        setCopiedId(null);
      }, 1500);
    }).catch(() => {
      showToast('Failed to copy email', 'error');
    });
  };

  const handleToggleStatus = (e: React.MouseEvent, id: number, currentStatus: 'active' | 'inactive') => {
    e.stopPropagation();
    const nextStatus = currentStatus === 'active' ? 'inactive' : 'active';
    updatePartner(id, { status: nextStatus });
    showToast(`Status toggled to ${nextStatus.toUpperCase()}!`);
  };

  const openAddModal = () => {
    setEditingItem(null);
    setName('');
    setType('');
    setContact('');
    setLogoUrl('');
    setLogoFile(null);
    setStatus('active');
    setIsModalOpen(true);
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showToast('Logo size should be less than 10MB', 'error');
        return;
      }
      setLogoFile(file);
      setLogoUrl(URL.createObjectURL(file));
    }
  };

  const openEditModal = (e: React.MouseEvent, item: Partner) => {
    e.stopPropagation();
    setEditingItem(item);
    setName(item.name);
    setType(item.type);
    setContact(item.contact);
    setLogoUrl(item.logoUrl || '');
    setLogoFile(null);
    setStatus(item.status);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Partner name is required', 'error');
      return;
    }

    const data = {
      name: name.trim(),
      type: type.trim() || 'Corporate',
      contact: contact.trim(),
      status,
      logoFile,
      removeLogo: editingItem ? !logoUrl : false
    };

    try {
      if (editingItem) {
        await updatePartner(editingItem.id, data);
        showToast('Partner updated successfully!');
      } else {
        await addPartner(data);
        showToast('Partner added successfully!');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Failed to save partner', 'error');
    }
  };

  const promptDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setDeletingId(id);
    setIsDeleteOpen(true);
  };

  const handleDelete = () => {
    if (deletingId !== null) {
      deletePartner(deletingId);
      showToast('Partner deleted successfully!');
    }
    setIsDeleteOpen(false);
    setDeletingId(null);
  };

  return (
    <div>
      <div className="section-header">
        <div className="section-header-left">
          <h3>Partners Directory</h3>
          <p>Manage your corporate collaborations, badges, and status parameters</p>
        </div>
        <button className="add-btn" onClick={openAddModal}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '16px', height: '16px', strokeWidth: '2.5px', fill: 'none' }}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          <span>Add Partner</span>
        </button>
      </div>

      <div className="table-container" style={{ padding: '24px' }}>
        {/* Dynamic Admin Filters & Toolbar */}
        <div className="table-toolbar" style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '20px', marginBottom: '12px' }}>
          <div className="table-search" style={{ flex: 1, minWidth: '240px' }}>
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search partner logo or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Status Selector dropdown */}
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value as any)}
              style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '2px solid var(--border-color)',
                fontSize: '0.875rem',
                background: 'var(--bg-white)',
                color: 'var(--text-secondary)'
              }}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {/* Sectors Selector dropdown */}
            <select 
              value={sectorFilter} 
              onChange={(e) => setSectorFilter(e.target.value)}
              style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '2px solid var(--border-color)',
                fontSize: '0.875rem',
                background: 'var(--bg-white)',
                color: 'var(--text-secondary)'
              }}
            >
              <option value="all">All Sectors</option>
              {uniqueSectors.map(sect => (
                <option key={sect} value={sect}>{sect}</option>
              ))}
            </select>

            {/* Quick Metrics pills */}
            <div className="toolbar-stats" style={{ marginLeft: '8px' }}>
              <span className="toolbar-stat-pill">Total: {totalCount}</span>
              <span className="toolbar-stat-pill active">Active: {activeCount}</span>
              <span className="toolbar-stat-pill inactive">Inactive: {inactiveCount}</span>
            </div>
          </div>
        </div>

        {/* Partners Grid */}
        {filteredItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 32px', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '2rem' }}>📂</span>
            <h4 style={{ marginTop: '16px', color: 'var(--text-primary)', fontWeight: 600 }}>No partners found</h4>
            <p style={{ fontSize: '0.875rem', marginTop: '4px' }}>Try adjusting your search query or filter values</p>
          </div>
        ) : (
          <div className="partners-grid">
            {filteredItems.map(item => (
              <div className="partner-card" key={item.id}>
                {/* Premium Gradient Header displaying emblem and name */}
                <div className="partner-card-header">
                  {item.logoUrl ? (
                    <div className="partner-logo-emblem" style={{ background: 'rgba(255,255,255,0.15)', padding: '4px', overflow: 'hidden' }}>
                      <img src={item.logoUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '6px' }} />
                    </div>
                  ) : (
                    <div className="partner-logo-emblem">
                      {getInitials(item.name)}
                    </div>
                  )}
                  <div className="partner-logo-text" title={item.name}>
                    {item.name}
                  </div>
                </div>

                {/* Card body content */}
                <div className="partner-card-body">
                  <div className="partner-card-info">
                    <span className="partner-card-title">{item.name}</span>
                    <span className="partner-card-meta">Added: {item.createdAt}</span>
                  </div>

                  {/* Sector Pill Badge */}
                  <span className="partner-sector-tag">
                    {item.type}
                  </span>

                  {/* Envelope copy email row */}
                  {item.contact && (
                    <div 
                      className="partner-contact-row" 
                      onClick={(e) => handleCopyEmail(e, item.id, item.contact)}
                      title="Click to copy email address"
                    >
                      <span className="partner-contact-email">{item.contact}</span>
                      <span className="partner-contact-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '13px', height: '13px', strokeWidth: '2.5px' }}>
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                      </span>

                      {/* Inline feedback notification */}
                      <div className={`partner-copy-toast ${copiedId === item.id ? 'show' : ''}`}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '14px', height: '14px', strokeWidth: '3px' }}>
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>Copied!</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer featuring reactive Status Toggler and Edit/Delete controls */}
                <div className="partner-card-footer">
                  <div 
                    className={`partner-status-toggle ${item.status === 'active' ? 'active' : 'inactive'}`}
                    onClick={(e) => handleToggleStatus(e, item.id, item.status)}
                    title={`Click to mark ${item.status === 'active' ? 'Inactive' : 'Active'}`}
                  >
                    {item.status}
                  </div>

                  <div className="partner-card-actions">
                    <button 
                      className="partner-action-btn edit" 
                      onClick={(e) => openEditModal(e, item)}
                      title="Edit details"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button 
                      className="partner-action-btn delete" 
                      onClick={(e) => promptDelete(e, item.id)}
                      title="Delete partner"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                  </div>
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
              <h3>{editingItem ? 'Edit Partner details' : 'Add New Partner'}</h3>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    <span style={{ color: '#8b5cf6' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '16px', height: '16px' }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </span>
                    Partner Company Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Fazo Corp"
                    required
                  />
                </div>
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    <span style={{ color: '#8b5cf6' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '16px', height: '16px' }}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                    </span>
                    Sector / Category
                  </label>
                  <input
                    type="text"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    placeholder="e.g. Technology, Travel, Logistics"
                  />
                </div>
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    <span style={{ color: '#8b5cf6' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '16px', height: '16px' }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    </span>
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="email@partnerdomain.com"
                  />
                </div>

                {/* Logo Upload */}
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    <span style={{ color: '#f59e0b' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '16px', height: '16px' }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    </span>
                    Logo
                  </label>
                  {logoUrl ? (
                    <div className="image-preview-container" style={{ maxHeight: '120px' }}>
                      <img src={logoUrl} alt="Logo preview" className="image-preview-img" style={{ objectFit: 'contain' }} />
                      <button
                        type="button"
                        className="image-preview-remove"
                        onClick={() => setLogoUrl('')}
                        title="Remove Logo"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '14px', height: '14px', strokeWidth: '2.5px' }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </div>
                  ) : (
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
                      }}>Choose File</button>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No file chosen</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
                      />
                    </div>
                  )}
                </div>

                {/* Status */}
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    <span style={{ color: '#f59e0b' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '16px', height: '16px' }}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    </span>
                    Status
                  </label>
                  <select value={status} onChange={(e) => setStatus(e.target.value as any)}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '16px', height: '16px', fill: 'none' }}>
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                    <polyline points="17 21 17 13 7 13 7 21"/>
                    <polyline points="7 3 7 8 15 8"/>
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
              <h3 style={{ marginBottom: '8px', fontSize: '1.25rem', fontWeight: 700 }}>Remove Partner</h3>
              <p className="confirm-text" style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>
                Are you sure you want to remove this partner collaboration? This will purge all associated metrics.
              </p>
              <div className="confirm-actions" style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button className="btn-secondary" onClick={() => setIsDeleteOpen(false)}>Cancel</button>
                <button className="btn-danger" onClick={handleDelete}>Delete Partner</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Partners;
