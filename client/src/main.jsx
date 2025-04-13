import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AuthContextProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider> {/* 전체 앱에 로그인 상태 주입 */}
        <App />
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
