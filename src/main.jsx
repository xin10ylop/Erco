import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { RequestsProvider } from './context/RequestsContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <RequestsProvider>
        <App />
      </RequestsProvider>
    </BrowserRouter>
  </React.StrictMode>
);
