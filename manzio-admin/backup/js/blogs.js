const Blogs = {
  render() {
    const container = document.getElementById('blogs-content');
    const items = DataStore.getAll('blogs');
    container.innerHTML = `
      <div class="section-header">
        <div class="section-header-left">
          <h3>All Blog Posts</h3>
          <p>Manage your published blog posts and articles</p>
        </div>
        <button class="add-btn" onclick="Blogs.openModal()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width:16px;height:16px;stroke-width:2.5px;fill:none"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          <span>Add Blog Post</span>
        </button>
      </div>
      <div class="table-container">
        <div class="table-toolbar">
          <div class="table-search">
            <span class="search-icon">🔍</span>
            <input type="text" placeholder="Search blogs..." oninput="Blogs.search(this.value)">
          </div>
          <span class="table-count">${items.length} posts</span>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Excerpt</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="blogs-tbody">
            ${Blogs.renderRows(items)}
          </tbody>
        </table>
        ${items.length === 0 ? '<div class="empty-state"><div class="empty-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width:48px;height:48px;stroke-width:1.5px"><path d="M4 11a9 9 0 0 1 9 9"></path><path d="M4 4a16 16 0 0 1 16 16"></path><circle cx="5" cy="19" r="1"></circle></svg></div><p>No blog posts yet. Write your first post!</p></div>' : ''}
      </div>
    `;
  },

  renderRows(items) {
    return items.map(item => `
      <tr>
        <td><strong>${item.title}</strong></td>
        <td>${item.author}</td>
        <td class="excerpt-cell">${item.excerpt}</td>
        <td><span class="status-badge ${item.status}">${item.status === 'active' ? 'published' : item.status}</span></td>
        <td>${item.createdAt}</td>
        <td>
          <div class="action-btns">
            <button class="action-btn edit" onclick="Blogs.openModal(${item.id})" title="Edit">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width:14px;height:14px;stroke-width:2.5px;fill:none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>
            <button class="action-btn delete" onclick="Blogs.confirmDelete(${item.id})" title="Delete">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width:14px;height:14px;stroke-width:2.5px;fill:none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  },

  search(query) {
    const items = query ? DataStore.search('blogs', query) : DataStore.getAll('blogs');
    document.getElementById('blogs-tbody').innerHTML = Blogs.renderRows(items);
  },

  openModal(id = null) {
    const item = id ? DataStore.getById('blogs', id) : null;
    const modal = document.getElementById('modal-overlay');
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3>${item ? 'Edit Blog Post' : 'Add Blog Post'}</h3>
          <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Title</label>
            <input type="text" id="modal-title" value="${item ? item.title : ''}" placeholder="Blog title">
          </div>
          <div class="form-group">
            <label>Author</label>
            <input type="text" id="modal-author" value="${item ? item.author : 'Admin'}" placeholder="Author name">
          </div>
          <div class="form-group">
            <label>Excerpt</label>
            <textarea id="modal-excerpt" placeholder="Brief description of the blog post">${item ? item.excerpt : ''}</textarea>
          </div>
          <div class="form-group">
            <label>Status</label>
            <select id="modal-status">
              <option value="active" ${item && item.status === 'active' ? 'selected' : ''}>Published</option>
              <option value="draft" ${item && item.status === 'draft' ? 'selected' : ''}>Draft</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" onclick="closeModal()">Cancel</button>
          <button class="btn-primary" onclick="Blogs.save(${id || 'null'})">${item ? 'Update' : 'Publish'}</button>
        </div>
      </div>
    `;
    modal.classList.add('active');
  },

  save(id) {
    const data = {
      title: document.getElementById('modal-title').value,
      author: document.getElementById('modal-author').value,
      excerpt: document.getElementById('modal-excerpt').value,
      status: document.getElementById('modal-status').value
    };
    if (!data.title) { alert('Title is required'); return; }
    if (id) {
      DataStore.update('blogs', id, data);
    } else {
      DataStore.add('blogs', data);
    }
    closeModal();
    Blogs.render();
    Dashboard.render();
  },

  confirmDelete(id) {
    const item = DataStore.getById('blogs', id);
    const modal = document.getElementById('modal-overlay');
    modal.innerHTML = `
      <div class="modal confirm-modal">
        <div class="modal-body" style="padding:32px;text-align:center">
          <div class="confirm-icon">🗑️</div>
          <h3 style="margin-bottom:8px">Delete Blog Post</h3>
          <p class="confirm-text">Are you sure you want to delete "${item.title}"? This action cannot be undone.</p>
          <div class="confirm-actions">
            <button class="btn-secondary" onclick="closeModal()">Cancel</button>
            <button class="btn-danger" onclick="Blogs.delete(${id})">Delete</button>
          </div>
        </div>
      </div>
    `;
    modal.classList.add('active');
  },

  delete(id) {
    DataStore.remove('blogs', id);
    closeModal();
    Blogs.render();
    Dashboard.render();
  }
};
