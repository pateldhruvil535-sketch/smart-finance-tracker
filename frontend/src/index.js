import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "./index.css";
import "./App.css";

import { FinanceProvider } from "./components/context/FinanceContext";
import { CurrencyProvider } from "./components/context/CurrencyContext";
import { AuthProvider } from "./components/context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <FinanceProvider>
        <CurrencyProvider>
          <App />
        </CurrencyProvider>
      </FinanceProvider>
    </AuthProvider>
  </React.StrictMode>
);