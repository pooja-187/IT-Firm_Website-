const Dashboard = {
  render() {
    const container = document.getElementById('dashboard-content');
    const stats = [
      { 
        label: 'Total Categories', 
        value: DataStore.getCount('categories'), 
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2H2v10l9.29 9.29c.39.39 1.02.39 1.41 0l7.59-7.59c.39-.39.39-1.02 0-1.41L12 2z"></path><path d="M7 7h.01"></path></svg>`, 
        colorClass: 'blue', 
        change: 'Active items', 
        up: true 
      },
      { 
        label: 'Total Works', 
        value: DataStore.getCount('works'), 
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`, 
        colorClass: 'emerald', 
        change: 'Portfolio items', 
        up: true 
      },
      { 
        label: 'Total Blogs', 
        value: DataStore.getCount('blogs'), 
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 11a9 9 0 0 1 9 9"></path><path d="M4 4a16 16 0 0 1 16 16"></path><circle cx="5" cy="19" r="1"></circle></svg>`, 
        colorClass: 'purple', 
        change: 'Published posts', 
        up: true 
      },
      { 
        label: 'Total Partners', 
        value: DataStore.getCount('partners'), 
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`, 
        colorClass: 'orange', 
        change: 'Active partners', 
        up: true 
      }
    ];

    const recentItems = [
      ...DataStore.getAll('works').slice(-3).map(w => ({ 
        text: `New work added: ${w.title}`, 
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`, 
        color: 'indigo', 
        time: w.createdAt 
      })),
      ...DataStore.getAll('blogs').slice(-2).map(b => ({ 
        text: `Blog published: ${b.title}`, 
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 11a9 9 0 0 1 9 9"></path><path d="M4 4a16 16 0 0 1 16 16"></path><circle cx="5" cy="19" r="1"></circle></svg>`, 
        color: 'cyan', 
        time: b.createdAt 
      }))
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

    container.innerHTML = `
      <div class="stats-grid">
        ${stats.map(s => `
          <div class="stat-card ${s.colorClass}">
            <div class="stat-card-top">
              <div class="stat-icon">${s.svg}</div>
            </div>
            <div class="stat-value" data-count="${s.value}">0</div>
            <div class="stat-label">${s.label}</div>
            <div class="stat-change">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width:14px;height:14px;stroke-width:3px;margin-right:2px"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
              <span>${s.change}</span>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="recent-section">
        <h3>Recent Activity</h3>
        <div class="recent-list">
          ${recentItems.map(item => `
            <div class="recent-item">
              <div class="recent-icon ${item.color}">${item.svg}</div>
              <div class="recent-text">
                <strong>${item.text}</strong>
                <span>${item.time}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Animate count-up
    setTimeout(() => {
      container.querySelectorAll('.stat-value').forEach(el => {
        const target = parseInt(el.dataset.count);
        let current = 0;
        const step = Math.max(1, Math.floor(target / 30));
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = current;
        }, 30);
      });
    }, 200);
  }
};
