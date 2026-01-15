import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Performance optimization: Initialize DB early
import { db } from "./lib/store";
db.init();

createRoot(document.getElementById("root")!).render(<App />);
