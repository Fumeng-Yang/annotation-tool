import React, { useState, useRef, useEffect } from 'react';
import './MultiSelect.css';

function MultiSelect({ options, reference = [], value = [], onChange, placeholder = 'Select options...' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (optionValue) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  const handleRemove = (optionValue, e) => {
    e.stopPropagation();
    onChange(value.filter(v => v !== optionValue));
  };

  const getOptionLabel = (optionValue) => {
    const option = options.find(opt => opt.value === optionValue);
    return option ? option.label : optionValue;
  };

  const filteredOptions = options.filter(option => {
    return (
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (option.definition && option.definition.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (option.description && option.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="multi-select" ref={dropdownRef}>
      <div
        className={`multi-select-control ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="selected-values">
          {value.length === 0 ? (
            <span className="placeholder">{placeholder}</span>
          ) : (
            value.map(val => {

            let colorClass = reference && Array.isArray(reference) && reference.length > 0 ? 'reference-not-matched' : ''
        
            // console.log('Reference:', reference);
            if(reference && reference.find(vval => vval.includes(val))){
              colorClass = 'reference-matched'
            } 
            return ( <span key={val} className={`selected-tag ${colorClass}`}>
                {getOptionLabel(val)}
                <button
                  type="button"
                  onClick={(e) => handleRemove(val, e)}
                  className="remove-tag"
                >
                  ×
                </button>
              </span>
            )
            })
          )}
        </div>
        <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
      </div>

      {isOpen && (
        <div className="multi-select-dropdown">
          <div className="search-box">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search options..."
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="options-list">
            {filteredOptions.length === 0 ? (
              <div className="no-options">No options found</div>
            ) : (
              filteredOptions.map(option => (
                <div
                  key={option.value}
                  className={`option-item ${value.includes(option.value) ? 'selected' : ''}`}
                  onClick={() => handleToggle(option.value)}
                >
                  <input
                    type="checkbox"
                    checked={value.includes(option.value)}
                    onChange={() => { }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="option-content">
                    <div className="option-label">{option.label}</div>
                    <div className="option-definition">{option.definition}</div>
                    <div className="option-description">{option.description}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MultiSelect;
