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
  const { coderName, papers, references, updatePaperInList } = useApp();
  const navigate = useNavigate();

  const [paper, setPaper] = useState(null);
  const [annotations, setAnnotations] = useState({});
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [showPaper, setShowPaper] = useState(true);
  const [error, setError] = useState('');

  const baked_decision_type=["2-10251","2-104","2-10728","2-10923","2-11124","2-11486","2-11526","2-11649","2-1182","2-1195","2-1254","2-14204","2-14389","2-14897","2-15360","2-15366","2-15372","2-15374","2-15393","2-15407","2-15451","2-15463","2-15468","2-15469","2-15473","2-15534","2-1555","2-15558","2-15559","2-15586","2-15593","2-15646","2-16029","2-1608","2-1686","2-16953","2-16979","2-17012","2-17146","2-1809","2-187","2-1901","2-19326","2-19747","2-19768","2-19772","2-19783","2-19789","2-19802","2-19846","2-19853","2-19857","2-19872","2-19874","2-19915","2-19916","2-19917","2-19920","2-19939","2-19956","2-20181","2-2108","2-21106","2-2198","2-2205","2-2215","2-2228","2-2231","2-2240","2-2244","2-2250","2-2250","2-2256","2-22654","2-22809","2-22988","2-23404","2-2364","2-2368","2-23749","2-23851","2-2426","2-2478","2-24902","2-24996","2-24996","2-25136","2-2518","2-25255","2-25498","2-2552","2-2557","2-26105","2-26120","2-26128","2-26473","2-26784","2-27018","2-27074","2-27187","2-27699","2-27699","2-28227","2-29174","2-29847","2-30375","2-30800","2-31003","2-31838","2-3363","2-3368","2-3375","2-3377","2-33969","2-3407","2-3420","2-3427","2-3442","2-3448","2-3456","2-3477","2-3482","2-3488","2-3491","2-3509","2-3510","2-3515","2-3552","2-3573","2-3583","2-3601","2-36070","2-36160","2-3623","2-3630","2-3646","2-3649","2-3657","2-3659","2-3675","2-3748","2-38195","2-38243","2-38290","2-38295","2-38313","2-38327","2-38360","2-38432","2-38448","2-38469","2-38472","2-38494","2-38528","2-38528","2-38612","2-38754","2-38898","2-38915","2-38930","2-38984","2-39035","2-39286","2-39372","2-39422","2-39456","2-39465","2-39516","2-407","2-4566","2-4580","2-4587","2-4590","2-4600","2-4606","2-4611","2-4659","2-4664","2-4669","2-4671","2-4677","2-4711","2-4742","2-4800","2-4830","2-4841","2-4861","2-4877","2-488","2-6697","2-6700","2-6799","2-6975","2-7291","2-7543","2-7548","2-7583","2-7751","2-7832","2-7951","2-7977","2-7977","2-8150","2-8227","2-8797","2-8918","2-9542","2-9630","2-9771","2-9873","2-9998"]
  
  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    if (!coderName) {
      navigate('/login');
      return;
    }

    const currentPaper = papers.find(p => p.id === paperId);
    if (!currentPaper) {
      navigate('/dashboard');
      return;
    }

    // console.log(currentPaper)
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
        id: paperId,
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
    handleNavigation('next');
  };

  const handleNavigation = (direction) => {
    const currentIndex = papers.findIndex(p => p.id === paperId);
    if (direction === 'prev' && currentIndex > 0) {
      navigate(`/annotate/${papers[currentIndex - 1].id}`);
    } else if (direction === 'next' && currentIndex < papers.length - 1) {
      navigate(`/annotate/${papers[currentIndex + 1].id}`);
    }
  };

  const getCurrentPaperIndex = () => {
    return papers.findIndex(p => p.id === paperId);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      // console.log(e.key)
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleManualSave();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleComplete();
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNavigation('next');
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleNavigation('prev');
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
            <span className="paper-id-badge">ID: {paper.id}</span>
          </div>
          <div className="save-status">

            {saveStatus && <span className="status-text">{saveStatus}</span>}
            {saving && <span className="spinner">⟳</span>}
            <span className='paper-progress'>Hello, {coderName}!</span>
          </div>
        </div>
      </header>

      <div className='general-reminder'>Use full-text papers to code AI and human influences. Use abstracts for the other dimensions, but refer to the full text whenever you are unsure.</div>

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
              <a onClick={() => setShowPaper(!showPaper)} className="paper-link-button">
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
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <form className="annotation-form">
              {Object.keys(annotationSchema).map(fieldKey => {
                const field = annotationSchema[fieldKey];
                let reference = null, reference2 = null, merged = [];

                if (paper.annotations && paper.annotations.reference && paper.annotations.reference != '' && references) {
                  console.log(references)
                  reference = references.filter(ref => ref.id === paper.id)[0].annotations;
                  merged = reference[fieldKey] ? [...reference[fieldKey]] : [];
                  if (references.filter(ref => ref.id === paper.id)[1]) {
                    reference2 = references.filter(ref => ref.id === paper.id)[1].annotations;
                    merged = reference2[fieldKey] ? [...merged, ...reference2[fieldKey]] : merged;
                  }
                }

                // Skip influence fields if code_full_paper is false
                if (paper.code_full_paper === "No" &&
                  (fieldKey === 'ai_influence' || fieldKey === 'human_influence')) {
                  return <div key={fieldKey} className="form-group">
                    <label>
                      {field.label}
                      <span className="field-definition" title={field.definition}>ⓘ</span>
                    </label>
                    <div className="multi-select"> <div className='multi-select-control disabled-field'> No need to code this </div></div>
                  </div>;
                }

                return (
                  <div key={fieldKey} className="form-group">
                    <div className='form-group'>
                      <label>
                        {field.label}
                        <span className="field-definition" title={field.definition}>ⓘ</span>
                        <span className=""> {fieldKey === 'decision_types' ? baked_decision_type.includes(paper.id) ? '(think twice)' : '' : ''}</span>
                      </label>
                      <MultiSelect
                        options={field.options}
                        value={annotations ? annotations[fieldKey] : []}
                        onChange={(value) => handleAnnotationChange(fieldKey, value)}
                        reference={merged}
                        placeholder={`Select ${field.label.toLowerCase()}...`}
                      />
                    </div>
                    {reference && <div className='form-group-sub'>
                      {reference[fieldKey] && reference[fieldKey].map((val, idx) => {
                        let label = "not-matched";
                        if (annotations[fieldKey].find(v => val.includes(v))) {
                          label = "matched";
                        } else {
                          if (!field.options.find(opt => val.includes(opt.value))) {
                            label = "notexist"
                          }
                        }
                        let vals = val.split(' (')
                        let val1 = vals[0], number = vals.length > 1 ? ('(' + vals[1].substring(0, 1) + ')') : "";
                        return (<span key={idx} className={`reference-badge-${label}`}>{val1} <font className="vote_count">{number}</font></span>)
                      })}
                      <span className="model-name">{reference.model}</span>
                    </div>
                    }
                    {reference2 && <div className='form-group-sub'>
                      {reference2[fieldKey] && reference2[fieldKey].map((val, idx) => {
                        let label = "not-matched";
                        if (annotations[fieldKey].find(v => val.includes(v))) {
                          label = "matched";
                        }else {
                          if (!field.options.find(opt => val.includes(opt.value))) {
                            label = "notexist"
                          }
                        }
                        let vals = val.split(' (')
                        let val1 = vals[0], number = vals.length > 1 ? ('(' + vals[1].substring(0, 1) + ')') : "";
                        return (<span key={idx} className={`reference-badge-${label}`}>{val1} <font className="vote_count">{number}</font></span>)
                      })}
                      <span className="model-name">{reference2.model}</span>
                    </div>
                    }
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
            <div className="reminder">Remember to save your work frequently!</div>
          </div>

          <div className="annotation-footer">
            <button
              onClick={() => handleNavigation('prev')}
              className="btn-nav"
              disabled={isFirstPaper}
            >
              ← Previous Paper
            </button>
            <div className="general-reminder">
              Tip: Press Ctrl+S (Cmd+S on Mac) to save <br />
              Ctrl/Cmd+Enter to mark as complete; ←/→ to navigate papers.
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
