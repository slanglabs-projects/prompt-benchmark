import React from 'react';
import { createRoot } from 'react-dom/client'; // Updated import
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

// Get the root element from the DOM
const container = document.getElementById('root');

// Create a root
const root = createRoot(container);

// Render the App component into the root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
