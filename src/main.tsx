import React from 'react';
import ReactDOM from 'react-dom/client';
import App from 'src/App';

/**
 * Serves as the entry point for a React application using React 18.3.1.
 *
 * @function
 * @returns {void}
 */
const renderApp = (): void => {
  // Finds the DOM element with the ID 'root'.
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    //Provides a fallback mechanism (e.g., displaying an error message in the console) if the application fails to load.
    console.error('Root element not found. Ensure there is an element in the document with id "root".');
    return;
  }

  // Render the <App /> component into the 'root' element using ReactDOM.createRoot.
  const root = ReactDOM.createRoot(rootElement);

  try {
    //Renders the App component into the root element using ReactDOM.createRoot().
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    //Implements basic error handling to catch potential rendering errors.
    console.error('Failed to render the application:', error);
  }
};

//Render the main application.
renderApp();