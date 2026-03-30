import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ExamSetup from './pages/ExamSetup';
import Exam from './pages/Exam';
import Results from './pages/Results';
import Admin from './pages/Admin';


function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<ExamSetup />} />
        <Route path="/exam/:examId" element={<Exam />} />
        <Route path="/results/:examId" element={<Results />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;