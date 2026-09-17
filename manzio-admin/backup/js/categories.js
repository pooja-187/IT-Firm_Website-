const Categories = {
  render() {
    const container = document.getElementById('categories-content');
    const items = DataStore.getAll('categories');
    container.innerHTML = `
      <div class="section-header">
        <div class="section-header-left">
          <h3>All Categories</h3>
          <p>Manage your portfolio and blog categories</p>
        </div>
        <button class="add-btn" onclick="Categories.openModal()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width:16px;height:16px;stroke-width:2.5px;fill:none"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          <span>Add Category</span>
        </button>
      </div>
      <div class="table-container">
        <div class="table-toolbar">
          <div class="table-search">
            <span class="search-icon">🔍</span>
            <input type="text" placeholder="Search categories..." oninput="Categories.search(this.value)" id="cat-search">
          </div>
          <span class="table-count">${items.length} categories</span>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="categories-tbody">
            ${Categories.renderRows(items)}
          </tbody>
        </table>
        ${items.length === 0 ? '<div class="empty-state"><div class="empty-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width:48px;height:48px;stroke-width:1.5px"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg></div><p>No categories yet. Add your first category!</p></div>' : ''}
      </div>
    `;
  },

  renderRows(items) {
    return items.map(item => `
      <tr>
        <td><strong>${item.name}</strong></td>
        <td>${item.description}</td>
        <td><span class="status-badge ${item.status}">${item.status}</span></td>
        <td>${item.createdAt}</td>
        <td>
          <div class="action-btns">
            <button class="action-btn edit" onclick="Categories.openModal(${item.id})" title="Edit">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width:14px;height:14px;stroke-width:2.5px;fill:none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>
            <button class="action-btn delete" onclick="Categories.confirmDelete(${item.id})" title="Delete">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width:14px;height:14px;stroke-width:2.5px;fill:none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  },

  search(query) {
    const items = query ? DataStore.search('categories', query) : DataStore.getAll('categories');
    document.getElementById('categories-tbody').innerHTML = Categories.renderRows(items);
  },

  openModal(id = null) {
    const item = id ? DataStore.getById('categories', id) : null;
    const modal = document.getElementById('modal-overlay');
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3>${item ? 'Edit Category' : 'Add Category'}</h3>
          <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Name</label>
            <input type="text" id="modal-name" value="${item ? item.name : ''}" placeholder="Category name">
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea id="modal-desc" placeholder="Category description">${item ? item.description : ''}</textarea>
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
          <button class="btn-primary" onclick="Categories.save(${id || 'null'})">${item ? 'Update' : 'Create'}</button>
        </div>
      </div>
    `;
    modal.classList.add('active');
  },

  save(id) {
    const data = {
      name: document.getElementById('modal-name').value,
      description: document.getElementById('modal-desc').value,
      status: document.getElementById('modal-status').value
    };
    if (!data.name) { alert('Name is required'); return; }
    if (id) {
      DataStore.update('categories', id, data);
    } else {
      DataStore.add('categories', data);
    }
    closeModal();
    Categories.render();
    Dashboard.render(); // update counts
  },

  confirmDelete(id) {
    const item = DataStore.getById('categories', id);
    const modal = document.getElementById('modal-overlay');
    modal.innerHTML = `
      <div class="modal confirm-modal">
        <div class="modal-body" style="padding:32px;text-align:center">
          <div class="confirm-icon">🗑️</div>
          <h3 style="margin-bottom:8px">Delete Category</h3>
          <p class="confirm-text">Are you sure you want to delete "${item.name}"? This action cannot be undone.</p>
          <div class="confirm-actions">
            <button class="btn-secondary" onclick="closeModal()">Cancel</button>
            <button class="btn-danger" onclick="Categories.delete(${id})">Delete</button>
          </div>
        </div>
      </div>
    `;
    modal.classList.add('active');
  },

  delete(id) {
    DataStore.remove('categories', id);
    closeModal();
    Categories.render();
    Dashboard.render();
  }
};
