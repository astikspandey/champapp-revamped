import { createRoot } from "react-dom/client";
import App from "./App";

// CSS is built separately with Tailwind CLI and linked in index.html
// import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
