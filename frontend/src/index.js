import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated import
import App from './App';

// Get the container for your app
const container = document.getElementById('root');

// Create a root
const root = ReactDOM.createRoot(container);

// Initial render: Render your app in the root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
