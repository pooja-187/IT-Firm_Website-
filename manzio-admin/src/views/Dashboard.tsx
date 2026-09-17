import React from 'react';
import { useData } from '../context/DataContext';

export const Dashboard: React.FC = () => {
  const { works, blogs } = useData();

  // Sort and filter recent activity logs
  const recentItems = [
    ...works.slice(-3).map(w => ({
      text: `New work added: ${w.title}`,
      svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>,
      color: 'indigo',
      time: w.createdAt
    })),
    ...blogs.slice(-2).map(b => ({
      text: `Blog published: ${b.title}`,
      svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 11a9 9 0 0 1 9 9"></path><path d="M4 4a16 16 0 0 1 16 16"></path><circle cx="5" cy="19" r="1"></circle></svg>,
      color: 'cyan',
      time: b.date
    }))
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

  return (
    <div>
      <div className="recent-section" style={{ marginTop: '0' }}>
        <h3>Recent Activity</h3>
        <div className="recent-list">
          {recentItems.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No recent activity recorded yet.
            </div>
          ) : (
            recentItems.map((item, idx) => (
              <div className="recent-item" key={idx}>
                <div className={`recent-icon ${item.color}`}>{item.svg}</div>
                <div className="recent-text">
                  <strong>{item.text}</strong>
                  <span>{item.time}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
