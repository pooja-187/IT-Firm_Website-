import React, { useEffect, useState } from 'react';
import { useData } from '../context/DataContext';

export const StatsGrid: React.FC = () => {
  const { categories, works, blogs, partners } = useData();

  // Animation count hooks
  const [catCount, setCatCount] = useState(0);
  const [workCount, setWorkCount] = useState(0);
  const [blogCount, setBlogCount] = useState(0);
  const [partnerCount, setPartnerCount] = useState(0);

  useEffect(() => {
    const animateCount = (target: number, setter: React.Dispatch<React.SetStateAction<number>>) => {
      if (target === 0) {
        setter(0);
        return;
      }
      let current = 0;
      const step = Math.max(1, Math.floor(target / 20));
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setter(current);
      }, 40);
    };

    animateCount(categories.length, setCatCount);
    animateCount(works.length, setWorkCount);
    animateCount(blogs.length, setBlogCount);
    animateCount(partners.length, setPartnerCount);
  }, [categories.length, works.length, blogs.length, partners.length]);

  return (
    <div className="stats-grid" style={{ marginBottom: '32px' }}>
      {/* Total Categories */}
      <div className="stat-card blue">
        <div className="stat-card-top">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2H2v10l9.29 9.29c.39.39 1.02.39 1.41 0l7.59-7.59c.39-.39.39-1.02 0-1.41L12 2z"></path><path d="M7 7h.01"></path></svg>
          </div>
        </div>
        <div className="stat-value">{catCount}</div>
        <div className="stat-label">Total Categories</div>
        <div className="stat-change">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '14px', height: '14px', strokeWidth: 3, marginRight: '2px' }}><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
          <span>Active items</span>
        </div>
      </div>

      {/* Total Works */}
      <div className="stat-card emerald">
        <div className="stat-card-top">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
          </div>
        </div>
        <div className="stat-value">{workCount}</div>
        <div className="stat-label">Total Works</div>
        <div className="stat-change">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '14px', height: '14px', strokeWidth: 3, marginRight: '2px' }}><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
          <span>Portfolio items</span>
        </div>
      </div>

      {/* Total Blogs */}
      <div className="stat-card purple">
        <div className="stat-card-top">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 11a9 9 0 0 1 9 9"></path><path d="M4 4a16 16 0 0 1 16 16"></path><circle cx="5" cy="19" r="1"></circle></svg>
          </div>
        </div>
        <div className="stat-value">{blogCount}</div>
        <div className="stat-label">Total Blogs</div>
        <div className="stat-change">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '14px', height: '14px', strokeWidth: 3, marginRight: '2px' }}><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
          <span>Published posts</span>
        </div>
      </div>

      {/* Total Partners */}
      <div className="stat-card orange">
        <div className="stat-card-top">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
        </div>
        <div className="stat-value">{partnerCount}</div>
        <div className="stat-label">Total Partners</div>
        <div className="stat-change">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '14px', height: '14px', strokeWidth: 3, marginRight: '2px' }}><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
          <span>Active partners</span>
        </div>
      </div>
    </div>
  );
};

export default StatsGrid;
