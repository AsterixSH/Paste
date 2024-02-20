// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/index.jsx';
import EditorView from './pages/pasteView/EditorView.jsx';
import './assets/styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/paste/:pasteId" element={<EditorView />} />
      </Routes>
    </Router>
  </React.StrictMode>,
  );