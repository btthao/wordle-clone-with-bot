import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ContextProvider } from './context';
import reportWebVitals from './reportWebVitals';
import './styles/index.css';

ReactDOM.render(
  <React.StrictMode>
    <ContextProvider> 
      <App />
    </ContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
