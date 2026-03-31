import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Global styles including Tailwind directives

/**
 * The root of the React application.
 * We wrap the App in React.StrictMode to catch potential problems 
 * during development, such as side-effect cleanups.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);