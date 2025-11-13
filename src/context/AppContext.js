import React, { createContext, useState, useContext, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [coderName, setCoderName] = useState(() => {
    return sessionStorage.getItem('coderName') || null;
  });
  
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (coderName) {
      sessionStorage.setItem('coderName', coderName);
    } else {
      sessionStorage.removeItem('coderName');
    }
  }, [coderName]);

  const login = (name) => {
    setCoderName(name);
  };

  const logout = () => {
    setCoderName(null);
    setPapers([]);
    sessionStorage.clear();
  };

  const updatePaperInList = (paperId, updates) => {
    setPapers(prevPapers => 
      prevPapers.map(paper => 
        paper.paper_id === paperId 
          ? { ...paper, ...updates }
          : paper
      )
    );
  };

  const value = {
    coderName,
    papers,
    loading,
    error,
    login,
    logout,
    setPapers,
    setLoading,
    setError,
    updatePaperInList
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
