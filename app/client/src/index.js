import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ChatProvider from './context/ChatProvider.js';
ReactDom.render(
  <React.StrictMode>
  <ChakraProvider>
    <BrowserRouter>
      <ChatProvider>
        <App />
      </ChatProvider>
    </BrowserRouter>
  </ChakraProvider>
  </React.StrictMode>
  , document.getElementById('app')
);
