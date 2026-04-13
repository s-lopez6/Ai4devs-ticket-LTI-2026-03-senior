import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import AddCandidatePage from './pages/AddCandidatePage';
import HomePage from './pages/HomePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/candidates/new" element={<AddCandidatePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
