import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import type { Statistic } from '../types';

interface StatisticsProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const Statistics: React.FC<StatisticsProps> = ({ showToast }) => {
  const { statistics, addStatistic, updateStatistic, deleteStatistic } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Statistic | null>(null);
  const [number, setNumber] = useState<string>('');
  const [suffix, setSuffix] = useState('+');
  const [label, setLabel] = useState('');

  // Delete states
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const filteredItems = statistics.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.suffix.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.number.toString().includes(searchQuery)
  );

  const openAddModal = () => {
    setEditingItem(null);
    setNumber('');
    setSuffix('+');
    setLabel('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: Statistic) => {
    setEditingItem(item);
    setNumber(item.number.toString());
    setSuffix(item.suffix);
    setLabel(item.label);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!number.trim() || !label.trim()) {
      showToast('Number and Label are required', 'error');
      return;
    }

    const numericValue = parseInt(number.trim(), 10);
    if (isNaN(numericValue)) {
      showToast('Please enter a valid numeric value', 'error');
      return;
    }

    const data = {
      number: numericValue,
      suffix: suffix.trim(),
      label: label.trim()
    };

    try {
      if (editingItem) {
        await updateStatistic(editingItem.id, data);
        showToast('Statistic metric updated successfully!');
      } else {
        await addStatistic(data);
        showToast('Statistic metric added successfully!');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Failed to save statistic', 'error');
    }
  };

  const promptDelete = (id: number) => {
    setDeletingId(id);
    setIsDeleteOpen(true);
  };

  const handleDelete = () => {
    if (deletingId !== null) {
      deleteStatistic(deletingId);
      showToast('Statistic deleted successfully!');
    }
    setIsDeleteOpen(false);
    setDeletingId(null);
  };

  return (
    <div>
      <div className="section-header">
        <div className="section-header-left">
          <h3>Statistics Metrics</h3>
          <p>Configure numeric display achievements shown on the platform</p>
        </div>
        <button className="add-btn" onClick={openAddModal}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '16px', height: '16px', strokeWidth: '2.5px', fill: 'none' }}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          <span>Add Metric</span>
        </button>
      </div>

      <div className="table-container">
        <div className="table-toolbar">
          <div className="table-search">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search statistics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <span className="table-count">{filteredItems.length} metrics</span>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>ID</th>
              <th>Metric Value</th>
              <th>Suffix</th>
              <th>Label Description</th>
              <th style={{ width: '120px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '32px' }}>
                  No statistics found.
                </td>
              </tr>
            ) : (
              filteredItems.map(item => (
                <tr key={item.id}>
                  <td>#{item.id}</td>
                  <td style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {item.number}
                  </td>
                  <td><span style={{ fontSize: '1rem', fontWeight: 600, color: '#8b5cf6' }}>{item.suffix}</span></td>
                  <td><strong>{item.label}</strong></td>
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
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingItem ? 'Edit Metric' : 'Add Metric'}</h3>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '16px' }}>
                  <div className="form-group">
                    <label>Number Value</label>
                    <input
                      type="number"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      placeholder="e.g. 350"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Suffix</label>
                    <input
                      type="text"
                      value={suffix}
                      onChange={(e) => setSuffix(e.target.value)}
                      placeholder="e.g. +"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Label</label>
                  <input
                    type="text"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="e.g. Projects Shipped"
                    required
                  />
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
              <h3 style={{ marginBottom: '8px', fontSize: '1.25rem', fontWeight: 700 }}>Delete Metric</h3>
              <p className="confirm-text" style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>
                Are you sure you want to delete this achievement metric? This action cannot be undone.
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

export default Statistics;
