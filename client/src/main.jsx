// 파일 경로: root/client/src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";                         // ★ 추가된 부분
import App from "./App";
import "./index.css";
import { AuthContextProvider } from "./context/AuthContext";

axios.defaults.withCredentials = true;             // ★ 추가된 부분

// 개발 환경일 때만 콘솔 출력
if (import.meta.env.DEV) {
  console.log("API 주소:", import.meta.env.VITE_API_BASE_URL);
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
