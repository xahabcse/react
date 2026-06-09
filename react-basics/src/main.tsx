// =============================================================
// main.tsx — the "entry point" of the whole app (everything starts here)
// -------------------------------------------------------------
// .NET analogy: this is like Program.cs / Main() — when the app starts,
// this file runs first.
// Job: find the <div id="root"> in index.html and "render" our entire
// React app (<App />) inside it.
// =============================================================
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css"; // global CSS (Tailwind) — importing it here applies it app-wide
import App from "./App.tsx";

// document.getElementById("root") → that empty div in index.html.
// The trailing "!" tells TypeScript "this won't be null, I'm sure" (non-null assertion).
createRoot(document.getElementById("root")!).render(
  // StrictMode = a development helper that catches potential bugs (e.g. it
  // runs effects twice to check your cleanup is correct). It renders nothing
  // visible and has no effect in a production build.
  <StrictMode>
    <App />
  </StrictMode>
);

/* =============================================================
   📝 INTERVIEW Q&A — Entry point / Rendering
   -------------------------------------------------------------
   Q1. What does createRoot do?
   → It is the React 18+ API; it turns a DOM node into a React "root",
     then .render() mounts the component tree there. (Replaces the old
     ReactDOM.render and enables concurrent features.)

   Q2. Why is there only one root for the whole app?
   → This is a SPA (Single Page Application). index.html has a single empty
     div; React builds and updates the entire UI inside that one place
     using JavaScript.

   Q3. What is StrictMode? Is it in production?
   → A development-only helper that surfaces problems early (impure render,
     old APIs, wrong effects). In development it intentionally renders a
     component twice; in a production build it does nothing.

   Q4. What is the "Virtual DOM"?
   → React keeps a lightweight copy of the UI in memory (the virtual DOM).
     When state changes it compares the new copy with the old one
     (diffing) and updates only the changed parts in the real DOM — so it
     is fast.

   Q5. Why import index.css here and not inside a component?
   → It is a global style; loaded once at the very start it applies
     everywhere. Vite sees this import and adds the CSS to the bundle.
   ============================================================= */
