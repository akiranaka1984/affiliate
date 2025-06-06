import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/index.css';
import AppRoutes from './routes';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>
);
