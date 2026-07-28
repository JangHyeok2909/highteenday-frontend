import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import axios from 'axios';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { BrowserRouter } from 'react-router-dom';
import { setupAxiosInterceptors } from './utils/setupAxios';
import { HelmetProvider } from 'react-helmet-async';

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL || '';
setupAxiosInterceptors();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <HelmetProvider>
    <BrowserRouter>
      <React.StrictMode>
        <AuthProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </AuthProvider>
      </React.StrictMode>
    </BrowserRouter>
  </HelmetProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
