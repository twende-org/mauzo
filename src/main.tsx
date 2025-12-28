import './output.css'
import App from './App.tsx'
import '@fontsource/poppins/400.css'; 
import '@fontsource/poppins/500.css'; 
import '@fontsource/poppins/700.css';
import { Provider } from 'react-redux';
import { store } from './store/index.ts';

// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
