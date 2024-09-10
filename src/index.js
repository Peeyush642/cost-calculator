import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { CostProvider } from './context/costContext';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CostProvider>
      <App />
    </CostProvider>
  </React.StrictMode>
);


