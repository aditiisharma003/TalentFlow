// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { store } from "./app/store.js";
import "./index.css";

// Start MSW in development mode
if (import.meta.env.DEV) {
  (async () => {
    try {
      const { worker } = await import("./mocks/browser");
      await worker.start({
        onUnhandledRequest: "bypass", // ignore unhandled requests
      });
      console.log("MSW started successfully");
    } catch (err) {
      console.error("MSW failed to start:", err);
    }
  })();
}

// Render React App
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);