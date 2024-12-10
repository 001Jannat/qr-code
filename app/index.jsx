import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./(root)/sessionDetails";

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
        hii jannat 
      <Home />
    </React.StrictMode>
  );
}
