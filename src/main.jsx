import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initializeStorage } from './utils/localStorage';
import './index.css';

// Seed localStorage with mock/demo data on first load.
// This is a frontend-only data layer; a future backend integration
// will replace these service calls with real REST API requests.
initializeStorage();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
