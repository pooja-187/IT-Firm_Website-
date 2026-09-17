const DataStore = {
  _data: {
    categories: [
      { id: 1, name: 'UI/UX Designing', description: 'User interface and experience design', status: 'active', createdAt: '2025-04-05' }
    ],
    works: [
      { 
        id: 1, 
        title: 'Agency Website', 
        category: 'UI/UX Designing', 
        client: 'CreativeAgency', 
        status: 'active', 
        createdAt: '2025-05-10', 
        imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=80' 
      },
      { 
        id: 2, 
        title: 'DMC WEBSITE', 
        category: 'UI/UX Designing', 
        client: 'TravelGroup', 
        status: 'active', 
        createdAt: '2025-05-18', 
        imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80' 
      }
    ],
    blogs: [],
    partners: Array.from({ length: 17 }, (_, i) => ({
      id: i + 1,
      name: `Partner Enterprise ${i + 1}`,
      type: i % 2 === 0 ? 'Technology' : 'Marketing',
      contact: `contact@partner${i + 1}.com`,
      status: 'active',
      createdAt: '2025-01-10'
    }))
  },

  init() {
    const saved = localStorage.getItem('manzio_data_v2');
    if (saved) {
      this._data = JSON.parse(saved);
    } else {
      this._save();
    }
  },

  _save() {
    localStorage.setItem('manzio_data_v2', JSON.stringify(this._data));
  },

  getAll(collection) {
    return [...this._data[collection]];
  },

  getById(collection, id) {
    return this._data[collection].find(item => item.id === id);
  },

  add(collection, item) {
    const maxId = this._data[collection].reduce((max, i) => Math.max(max, i.id), 0);
    item.id = maxId + 1;
    item.createdAt = new Date().toISOString().split('T')[0];
    this._data[collection].push(item);
    this._save();
    return item;
  },

  update(collection, id, updates) {
    const index = this._data[collection].findIndex(item => item.id === id);
    if (index !== -1) {
      this._data[collection][index] = { ...this._data[collection][index], ...updates };
      this._save();
      return this._data[collection][index];
    }
    return null;
  },

  remove(collection, id) {
    this._data[collection] = this._data[collection].filter(item => item.id !== id);
    this._save();
  },

  getCount(collection) {
    return this._data[collection].length;
  },

  search(collection, query) {
    const q = query.toLowerCase();
    return this._data[collection].filter(item => {
      return Object.values(item).some(val => 
        String(val).toLowerCase().includes(q)
      );
    });
  }
};
