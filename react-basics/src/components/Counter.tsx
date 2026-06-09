// =============================================================
// Counter.tsx — a simple counter to learn useState
// -------------------------------------------------------------
// This is the classic first React exercise. It teaches the single most
// important hook: useState — how a component "remembers" a value and
// re-renders the UI automatically when that value changes.
// =============================================================
import { useState } from "react";

export default function Counter() {
  // useState(0) → start the count at 0.
  // It returns a pair (an array of two things):
  //   count    → the current value
  //   setCount → the function to change it (calling it re-renders the UI)
  const [count, setCount] = useState(0);

  return (
    <div className="max-w-xs mx-auto text-center bg-white rounded-lg shadow-md p-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Counter</h2>

      {/* show the current value from state */}
      <p className="text-6xl font-bold text-blue-600 mb-6">{count}</p>

      <div className="flex justify-center gap-3">
        {/* onClick takes a function. We use an arrow function so it runs
            ON CLICK (not during render). prev = the latest value of count. */}
        <button
          onClick={() => setCount((prev) => prev - 1)}
          disabled={count === 0} // when count is 0, this becomes true → button is disabled
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          − Decrease
        </button>

        {/* set the value directly back to 0 */}
        <button
          onClick={() => setCount(0)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Reset
        </button>

        <button
          onClick={() => setCount((prev) => prev + 1)}
          className={`px-4 py-2   text-white rounded-lg hover:bg-yellow-700 ${ count > 10 ? "bg-red-600" : "bg-teal-400"}`}
        >
          + Increase
        </button>
      </div>
    </div>
  );
}

/* =============================================================
   📝 INTERVIEW Q&A — useState
   -------------------------------------------------------------
   Q1. What does useState return?
   → An array of two: [current value, setter function]. We destructure it:
     const [count, setCount] = useState(0). The 0 is the initial value.

   Q2. Why not just write `count = count + 1` or `count++`?
   → Changing the variable directly does NOT re-render the UI. React only
     re-renders when you call the setter (setCount). State is updated
     through the setter, never by direct assignment.

   Q3. setCount(count + 1) vs setCount(prev => prev + 1) — difference?
   → Both work for one click. But the updater form (prev => prev + 1) is
     safer when updates are based on the previous value, especially if
     several updates happen quickly — it always uses the latest value.

   Q4. Why onClick={() => setCount(...)} instead of onClick={setCount(...)}?
   → With () => ... we pass a function that runs on click. Without the arrow,
     setCount(...) would run immediately during render (wrong).

   Q5. When does this component re-render?
   → Every time setCount changes the value. React re-runs the Counter
     function, reads the new count, and updates only what changed in the DOM.
   ============================================================= */
