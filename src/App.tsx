import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ExamPage from './pages/ExamPage';
import Result from './pages/Result';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/exam" />} />
        <Route path="/exam" element={<ExamPage />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </Router>
  );
};

export default App;
