import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { apiGet } from '../config/api';
import './DashboardPage.css';

function DashboardPage() {
  const { coderName, papers, setPapers, setLoading, logout } = useApp();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!coderName) {
      navigate('/login');
      return;
    }
    loadPapers();
  }, [coderName, navigate]);

  const loadPapers = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await apiGet('papers', { coder_name: coderName });
      
      if (response.success) {
        setPapers(response.papers || []);
      } else {
        setError(response.error || 'Failed to load papers');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Load papers error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredPapers = () => {
    let filtered = papers;

    // Filter by status
    if (filter !== 'all') {
      filtered = filtered.filter(paper => paper.status === filter);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(paper => 
        paper.title.toLowerCase().includes(term) ||
        paper.paper_id.toString().includes(term)
      );
    }

    return filtered;
  };

  const getProgressStats = () => {
    const total = papers.length;
    const completed = papers.filter(p => p.status === 'completed').length;
    const inProgress = papers.filter(p => p.status === 'in_progress').length;
    const notStarted = papers.filter(p => p.status === 'not_started').length;
    
    return { total, completed, inProgress, notStarted };
  };

  const handlePaperClick = (paperId) => {
    navigate(`/annotate/${paperId}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const stats = getProgressStats();
  const filteredPapers = getFilteredPapers();

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Paper Annotation Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {coderName}</span>
            <button onClick={handleLogout} className="btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="progress-section">
          <h2>Progress Overview</h2>
          <div className="progress-stats">
            <div className="stat-card">
              <div className="stat-value">{stats.completed}</div>
              <div className="stat-label">Completed</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.inProgress}</div>
              <div className="stat-label">In Progress</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.notStarted}</div>
              <div className="stat-label">Not Started</div>
            </div>
            <div className="stat-card total">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Papers</div>
            </div>
          </div>
          
          <div className="progress-bar-container">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
              />
            </div>
            <div className="progress-text">
              {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}% Complete
            </div>
          </div>
        </div>

        <div className="controls-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by title or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-buttons">
            <button
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              All ({papers.length})
            </button>
            <button
              className={filter === 'not_started' ? 'active' : ''}
              onClick={() => setFilter('not_started')}
            >
              Not Started ({stats.notStarted})
            </button>
            <button
              className={filter === 'in_progress' ? 'active' : ''}
              onClick={() => setFilter('in_progress')}
            >
              In Progress ({stats.inProgress})
            </button>
            <button
              className={filter === 'completed' ? 'active' : ''}
              onClick={() => setFilter('completed')}
            >
              Completed ({stats.completed})
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={loadPapers} className="btn-retry">
              Retry
            </button>
          </div>
        )}

        <div className="papers-list">
          {filteredPapers.length === 0 ? (
            <div className="no-papers">
              {searchTerm ? 'No papers match your search' : 'No papers to display'}
            </div>
          ) : (
            filteredPapers.map(paper => (
              <div
                key={paper.paper_id}
                className={`paper-card ${paper.status}`}
                onClick={() => handlePaperClick(paper.paper_id)}
              >
                <div className="paper-header">
                  <span className="paper-id">ID: {paper.paper_id}</span>
                  <span className={`status-badge ${paper.status}`}>
                    {paper.status.replace('_', ' ')}
                  </span>
                </div>
                <h3 className="paper-title">{paper.title}</h3>
                <p className="paper-abstract">
                  {paper.abstract.substring(0, 200)}
                  {paper.abstract.length > 200 ? '...' : ''}
                </p>
                {paper.pdf_link && (
                  <a 
                    href={paper.pdf_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="paper-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Paper →
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
