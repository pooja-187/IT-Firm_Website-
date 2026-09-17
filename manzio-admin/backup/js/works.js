const Works = {
  render() {
    const container = document.getElementById('works-content');
    const items = DataStore.getAll('works');
    container.innerHTML = `
      <div class="section-header">
        <div class="section-header-left">
          <h3>All Works</h3>
          <p>Manage your portfolio works efficiently</p>
        </div>
        <button class="add-btn" onclick="Works.openModal()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width:16px;height:16px;stroke-width:2.5px;fill:none"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          <span>Add Work</span>
        </button>
      </div>
      <div class="table-container" style="background:none;border:none;box-shadow:none;padding:0">
        <div class="table-toolbar" style="background:#ffffff;border:1px solid var(--border-light);border-radius:var(--radius-md);box-shadow:var(--shadow-sm);margin-bottom:24px;padding:16px 24px">
          <div class="table-search">
            <span class="search-icon">🔍</span>
            <input type="text" placeholder="Search works by title or category..." oninput="Works.search(this.value)">
          </div>
          <span class="table-count">${items.length} works</span>
        </div>
        
        <div class="works-grid" id="works-grid">
          ${Works.renderCards(items)}
        </div>
        
        ${items.length === 0 ? '<div class="empty-state" style="background:#ffffff;border-radius:var(--radius-md);border:1px solid var(--border-light);box-shadow:var(--shadow-sm)"><div class="empty-icon">🎨</div><p>No works yet. Add your first work!</p></div>' : ''}
      </div>
    `;
  },

  renderCards(items) {
    const getMockup = (item) => {
      if (item.imageUrl) return item.imageUrl;
      const mockups = {
        'Web Design': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
        'Mobile Apps': 'https://images.unsplash.com/photo-1510519138101-570d1dca3d66?w=600&auto=format&fit=crop&q=80',
        'Branding': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
        'UI/UX Design': 'https://images.unsplash.com/photo-1541462608143-67571c6738dd?w=600&auto=format&fit=crop&q=80',
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

    return items.map(item => `
      <div class="work-card">
        <div class="work-card-image">
          <img src="${getMockup(item)}" alt="${item.title}">
          <span class="work-card-badge">${item.status}</span>
        </div>
        <div class="work-card-body">
          <h4 class="work-card-title">${item.title}</h4>
          <div class="work-card-tag">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2H2v10l9.29 9.29c.39.39 1.02.39 1.41 0l7.59-7.59c.39-.39.39-1.02 0-1.41L12 2z"></path><path d="M7 7h.01"></path></svg>
            <span>${item.category}</span>
          </div>
          <div class="work-card-client">Client: ${item.client || 'N/A'}</div>
        </div>
        <div class="work-card-footer">
          <button class="work-card-btn edit" onclick="Works.openModal(${item.id})">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            <span>Edit</span>
          </button>
          <button class="work-card-btn delete" onclick="Works.confirmDelete(${item.id})">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            <span>Delete</span>
          </button>
        </div>
      </div>
    `).join('');
  },

  search(query) {
    const items = query ? DataStore.search('works', query) : DataStore.getAll('works');
    document.getElementById('works-grid').innerHTML = Works.renderCards(items);
  },

  openModal(id = null) {
    const item = id ? DataStore.getById('works', id) : null;
    const categories = DataStore.getAll('categories');
    const modal = document.getElementById('modal-overlay');
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3>${item ? 'Edit Work' : 'Add Work'}</h3>
          <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Title</label>
            <input type="text" id="modal-title" value="${item ? item.title : ''}" placeholder="Work title">
          </div>
          <div class="form-group">
            <label>Category</label>
            <select id="modal-category">
              ${categories.map(c => `<option value="${c.name}" ${item && item.category === c.name ? 'selected' : ''}>${c.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Client</label>
            <input type="text" id="modal-client" value="${item ? item.client : ''}" placeholder="Client name">
          </div>
          <div class="form-group">
            <label>Image URL (Optional)</label>
            <input type="text" id="modal-image" value="${item && item.imageUrl ? item.imageUrl : ''}" placeholder="https://example.com/image.jpg">
          </div>
          <div class="form-group">
            <label>Status</label>
            <select id="modal-status">
              <option value="active" ${item && item.status === 'active' ? 'selected' : ''}>Active</option>
              <option value="draft" ${item && item.status === 'draft' ? 'selected' : ''}>Draft</option>
              <option value="inactive" ${item && item.status === 'inactive' ? 'selected' : ''}>Inactive</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" onclick="closeModal()">Cancel</button>
          <button class="btn-primary" onclick="Works.save(${id || 'null'})">${item ? 'Update' : 'Create'}</button>
        </div>
      </div>
    `;
    modal.classList.add('active');
  },

  save(id) {
    const data = {
      title: document.getElementById('modal-title').value,
      category: document.getElementById('modal-category').value,
      client: document.getElementById('modal-client').value,
      imageUrl: document.getElementById('modal-image').value,
      status: document.getElementById('modal-status').value
    };
    if (!data.title) { alert('Title is required'); return; }
    if (id) {
      DataStore.update('works', id, data);
    } else {
      DataStore.add('works', data);
    }
    closeModal();
    Works.render();
    Dashboard.render();
  },

  confirmDelete(id) {
    const item = DataStore.getById('works', id);
    const modal = document.getElementById('modal-overlay');
    modal.innerHTML = `
      <div class="modal confirm-modal">
        <div class="modal-body" style="padding:32px;text-align:center">
          <div class="confirm-icon">🗑️</div>
          <h3 style="margin-bottom:8px">Delete Work</h3>
          <p class="confirm-text">Are you sure you want to delete "${item.title}"? This action cannot be undone.</p>
          <div class="confirm-actions">
            <button class="btn-secondary" onclick="closeModal()">Cancel</button>
            <button class="btn-danger" onclick="Works.delete(${id})">Delete</button>
          </div>
        </div>
      </div>
    `;
    modal.classList.add('active');
  },

  delete(id) {
    DataStore.remove('works', id);
    closeModal();
    Works.render();
    Dashboard.render();
  }
};
