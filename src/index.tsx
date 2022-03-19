import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ContextProvider } from './context';
import reportWebVitals from './reportWebVitals';
import './styles/index.css';
import { ChakraProvider } from '@chakra-ui/react'

ReactDOM.render(
  <React.StrictMode>
    <ContextProvider> 
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </ContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
