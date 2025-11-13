import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { apiPost } from '../config/api';
import MultiSelect from '../components/MultiSelect';
import annotationSchema from '../config/annotationSchema.json';
import HighlightedText from '../pages/HighlightedText';
import './AnnotationPage.css';

function AnnotationPage() {
  const { paperId } = useParams();
  const { coderName, papers, updatePaperInList } = useApp();
  const navigate = useNavigate();

  const [paper, setPaper] = useState(null);
  const [annotations, setAnnotations] = useState({});
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [showPaper, setShowPaper] = useState(true);
  const [error, setError] = useState('');

  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    if (!coderName) {
      navigate('/login');
      return;
    }

    const currentPaper = papers.find(p => p.paper_id === paperId);
    if (!currentPaper) {
      navigate('/dashboard');
      return;
    }

    setPaper(currentPaper);
    setAnnotations(currentPaper.annotations || {});
    setNotes(currentPaper.annotations?.notes || '');
  }, [paperId, papers, coderName, navigate]);

  const saveAnnotation = useCallback(async (status = 'in_progress') => {
    if (!paper) return;

    setSaving(true);
    setSaveStatus('Saving...');
    setError('');

    try {
      const response = await apiPost('save_annotation', {
        coder_name: coderName,
        paper_id: paperId,
        annotations: {
          ...annotations,
          notes: notes
        },
        status: status
      });

      if (response.success) {
        setSaveStatus('Saved');
        updatePaperInList(paperId, {
          annotations: { ...annotations, notes },
          status: status
        });
        setTimeout(() => setSaveStatus(''), 2000);
      } else {
        setError(response.error || 'Failed to save');
        setSaveStatus('');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setSaveStatus('');
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  }, [paper, coderName, paperId, annotations, notes, updatePaperInList]);

  const handleAnnotationChange = (field, value) => {
    setAnnotations(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-save with debouncing
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // saveTimeoutRef.current = setTimeout(() => {
    //   saveAnnotation();
    // }, 2000);
  };

  const handleNotesChange = (e) => {
    const value = e.target.value;
    setNotes(value);

    // Auto-save with debouncing
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // saveTimeoutRef.current = setTimeout(() => {
    //   saveAnnotation();
    // }, 2000);
  };

  const handleManualSave = () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveAnnotation();
  };

  const handleComplete = async () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    await saveAnnotation('completed');
  };

  const handleNavigation = (direction) => {
    const currentIndex = papers.findIndex(p => p.paper_id === paperId);
    if (direction === 'prev' && currentIndex > 0) {
      navigate(`/annotate/${papers[currentIndex - 1].paper_id}`);
    } else if (direction === 'next' && currentIndex < papers.length - 1) {
      navigate(`/annotate/${papers[currentIndex + 1].paper_id}`);
    }
  };

  const getCurrentPaperIndex = () => {
    return papers.findIndex(p => p.paper_id === paperId);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleManualSave();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleManualSave]);

  if (!paper) {
    return <div className="loading">Loading...</div>;
  }

  const currentIndex = getCurrentPaperIndex();
  const isFirstPaper = currentIndex === 0;
  const isLastPaper = currentIndex === papers.length - 1;

  return (
    <div className="annotation-page">
      <header className="annotation-header">
        <div className="header-content">
          <button onClick={() => navigate('/dashboard')} className="btn-back">
            ← Back to Dashboard
          </button>
          <div className="paper-progress">
            Paper {currentIndex + 1} of {papers.length}
            <span className="paper-id-badge">ID: {paper.paper_id}</span>
          </div>
          <div className="save-status">
            {saveStatus && <span className="status-text">{saveStatus}</span>}
            {saving && <span className="spinner">⟳</span>}
          </div>
        </div>
      </header>


      <div className="annotation-content">
        <div className="paper-info-section">
          <div className="paper-info-card">

            <h4 className="paper-title"><HighlightedText text={paper.title} /></h4>
            <div className="paper-abstract">
              {/* <h3>Abstract</h3> */}
              <p><HighlightedText text={paper.abstract} /></p>
            </div>
            {paper.pdf_link && (
              <a
                href={paper.pdf_link}
                target="_blank"
                rel="noopener noreferrer"
                className="paper-link-button"
              >
                Open PDF in New Tab →
              </a>
            )}
          </div>
      <div className="" >
        <div className="paper-info-card">
        <a onClick={() => setShowPaper(!showPaper)}   className="paper-link-button">
          {showPaper ? 'Hide Paper' : 'Show Paper'}
        </a>
         {showPaper && <iframe className='PDF-viewer'
            src={paper.pdf_link.replace(/\/view(\?.*)?$/, '/preview')}
            width="100%"
            height="800px"
            allow="autoplay"
            style={{ border: 'none' }}
          />
          }
        </div>
      </div>

        </div>
        <div className='paper-info-section'>
          <div className="annotation-form-section">
            {/* <h2>Annotations</h2> */}

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <form className="annotation-form">
              {Object.keys(annotationSchema).map(fieldKey => {
                const field = annotationSchema[fieldKey];

                // Skip influence fields if code_full_paper is false
                if (paper.code_full_paper === "No" &&
                  (fieldKey === 'ai_influence' || fieldKey === 'human_influence')) {
                  return <div key={fieldKey} className="form-group">
                    <label>
                      {field.label}
                      <span className="field-definition" title={field.definition}>ⓘ</span>
                    </label>
                    <div className="multi-select"> <div className='multi-select-control text-gray'> No need to code this </div></div>
                  </div>;
                }

                return (
                  <div key={fieldKey} className="form-group">
                    <label>
                      {field.label}
                      <span className="field-definition" title={field.definition}>ⓘ</span>
                    </label>
                    <MultiSelect
                      options={field.options}
                      value={annotations[fieldKey] || []}
                      onChange={(value) => handleAnnotationChange(fieldKey, value)}
                      placeholder={`Select ${field.label.toLowerCase()}...`}
                    />
                  </div>
                );
              })}

              <div className="form-group">
                <label htmlFor="notes">
                  Notes
                  <span className="optional-label">(Optional)</span>
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={handleNotesChange}
                  placeholder="Add any additional comments..."
                  rows="1"
                />
              </div>
            </form>

            <div className="action-buttons">
              <button
                onClick={handleComplete}
                className="btn-complete"
                disabled={saving}
              >
                Mark as Complete
              </button>
               <button
                onClick={handleManualSave}
                className="btn-secondary"
                disabled={saving}
              >
                Save Progress
              </button>
            </div>
          </div>

          <div className="annotation-footer">
            <button
              onClick={() => handleNavigation('prev')}
              className="btn-nav"
              disabled={isFirstPaper}
            >
              ← Previous Paper
            </button>
            <div className="keyboard-hint">
              Tip: Press Ctrl+S (Cmd+S on Mac) to save
            </div>
            <button
              onClick={() => handleNavigation('next')}
              className="btn-nav"
              disabled={isLastPaper}
            >
              Next Paper →
            </button>
          </div>
        </div>

      </div>


    </div>
  );
}

export default AnnotationPage;
