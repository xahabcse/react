// =============================================================
// Spinner.tsx — the simplest component: just shows a spinning loader
// -------------------------------------------------------------
// No props, no state — it only returns UI.
// It is shown while data is loading to mean "please wait".
// A component like this is called a "presentational" or "dumb" component.
// =============================================================
export default function Spinner() {
  return (
    <div className="flex justify-center items-center py-20">
      {/* the animate-spin (Tailwind) class is what makes the circle spin */}
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

/* =============================================================
   📝 INTERVIEW Q&A — Component basics
   -------------------------------------------------------------
   Q1. What is a React component, really?
   → A JavaScript function that returns JSX (UI). The name must start with
     a capital letter (Spinner), otherwise React treats it as an HTML tag.

   Q2. Function component vs class component?
   → Classes used to be needed for state/lifecycle. Now that hooks
     (useState, useEffect) exist, function components are the standard —
     smaller and simpler.

   Q3. Can a component return multiple elements?
   → Not directly — there must be one parent. For multiple, wrap them in a
     <div> or an empty Fragment <>...</> (use Fragment to avoid an extra div).

   Q4. Why make such a tiny thing its own component?
   → Reuse. Wherever you need loading, just write <Spinner />; change the
     style once and it changes everywhere.
   ============================================================= */
