import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ProblemProvider } from "./context/ProblemContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ProblemProvider>
      <App />
    </ProblemProvider>
  </StrictMode>
);
