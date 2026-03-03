import React from "react";

import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ApiAuthContextProvider from "./context/AuthContext.jsx";
import { Toaster } from "react-hot-toast";
import "./i18n.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
let query = new QueryClient();
createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={query}>
    <ApiAuthContextProvider>
      <App />

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
            borderRadius: "8px",
            padding: "12px 20px",
            fontSize: "14px",
            fontWeight: "500",
          },
          success: {
            duration: 3000,
            style: {
              background: "#10B981",
              color: "#fff",
              borderRadius: "8px",
              padding: "12px 20px",
              fontSize: "14px",
              fontWeight: "500",
            },
          },
          error: {
            duration: 5000,
            style: {
              background: "#EF4444",
              color: "#fff",
              borderRadius: "8px",
              padding: "12px 20px",
              fontSize: "14px",
              fontWeight: "500",
            },
          },
        }}
      />
    </ApiAuthContextProvider>
  </QueryClientProvider>
  
);
