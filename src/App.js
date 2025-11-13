import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AnnotationPage from './pages/AnnotationPage';
import { AppProvider } from './context/AppContext';
import './App.css';

function App() {
  return (
    <AppProvider>
     <Router basename={`/${process.env.PUBLIC_URL}`}>
        <div className="App">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/annotate/:paperId" element={<AnnotationPage />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
