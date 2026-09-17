import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import type { FAQ } from '../types';

interface FAQProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const FAQView: React.FC<FAQProps> = ({ showToast }) => {
  const { faqs, addFAQ, updateFAQ, deleteFAQ } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FAQ | null>(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  // Delete states
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const filteredItems = faqs.filter(item => 
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAddModal = () => {
    setEditingItem(null);
    setQuestion('');
    setAnswer('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: FAQ) => {
    setEditingItem(item);
    setQuestion(item.question);
    setAnswer(item.answer);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) {
      showToast('Question and Answer are required', 'error');
      return;
    }

    const data = {
      question: question.trim(),
      answer: answer.trim()
    };

    try {
      if (editingItem) {
        await updateFAQ(editingItem.id, data);
        showToast('FAQ updated successfully!');
      } else {
        await addFAQ(data);
        showToast('FAQ added successfully!');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Failed to save FAQ', 'error');
    }
  };

  const promptDelete = (id: number) => {
    setDeletingId(id);
    setIsDeleteOpen(true);
  };

  const handleDelete = () => {
    if (deletingId !== null) {
      deleteFAQ(deletingId);
      showToast('FAQ deleted successfully!');
    }
    setIsDeleteOpen(false);
    setDeletingId(null);
  };

  return (
    <div>
      <div className="section-header">
        <div className="section-header-left">
          <h3>Frequently Asked Questions</h3>
          <p>Manage system FAQ listings that appear on the website</p>
        </div>
        <button className="add-btn" onClick={openAddModal}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '16px', height: '16px', strokeWidth: '2.5px', fill: 'none' }}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          <span>Add FAQ</span>
        </button>
      </div>

      <div className="table-container">
        <div className="table-toolbar">
          <div className="table-search">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <span className="table-count">{filteredItems.length} FAQs</span>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>ID</th>
              <th style={{ width: '300px' }}>Question</th>
              <th>Answer</th>
              <th style={{ width: '120px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '32px' }}>
                  No FAQs found.
                </td>
              </tr>
            ) : (
              filteredItems.map(item => (
                <tr key={item.id}>
                  <td>#{item.id}</td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.question}</td>
                  <td>{item.answer}</td>
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
              <h3>{editingItem ? 'Edit FAQ' : 'Add FAQ'}</h3>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Question</label>
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Enter the question..."
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Answer</label>
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Provide the detailed answer..."
                    style={{ minHeight: '120px', resize: 'vertical' }}
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
              <h3 style={{ marginBottom: '8px', fontSize: '1.25rem', fontWeight: 700 }}>Delete FAQ</h3>
              <p className="confirm-text" style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>
                Are you sure you want to delete this FAQ? This action cannot be undone.
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

export default FAQView;
