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

// =============================================================
// 📝 INTERVIEW Q&A — Component & JSX (the foundation)
// -------------------------------------------------------------
// NOTE: this block uses // line comments (not /* */) ON PURPOSE.
// Q7 below shows a JSX comment, which contains the characters * and /.
// Inside a /* */ block that */ would close the comment early and break
// the file. On // lines it is just plain text, so it is safe.
// -------------------------------------------------------------
// Q1. What is a component?
// → A JavaScript function that returns JSX (UI). Its name MUST start with a
//   capital letter (Counter, Todo) so React treats it as a component, not a
//   plain HTML tag.
//
// Q2. What is JSX? Does the browser understand it?
// → HTML-like syntax written inside JavaScript. The browser does NOT
//   understand it directly; the build tool (Vite/Babel) compiles it into
//   React.createElement(...) calls. That object tree is the Virtual DOM.
//
// Q3. Why className instead of class?
// → `class` is a reserved keyword in JavaScript, so JSX uses className to
//   avoid the conflict.
//
// Q4. Why must a component return a single root element?
// → Because the JSX compiles down to a single createElement call. To return
//   siblings, wrap them in a <div> or, with no extra DOM node, a Fragment
//   <>...</>.
//
// Q5. What do the { } do inside JSX?
// → "JavaScript starts here." They embed any expression — a variable,
//   math ({2+2}), a function call, a ternary, a .map(). Like Razor's @value.
//
// Q6. Why can't you write if / for directly inside JSX? How to branch/loop?
// → { } holds an EXPRESSION (something with a value), not a STATEMENT.
//   if/for are statements. So branch with a ternary or && , and loop with
//   .map() (which returns an array):
//     {isLoading ? <Spinner/> : <List/>}
//     {error && <p>{error}</p>}
//     {todos.map(t => <li key={t.id}>{t.text}</li>)}
//
// Q7. How do you write a comment inside JSX?
// → {/* like this */}. Plain <!-- --> or // do not work inside JSX.
//
// Q8. How do inline styles work? Does style="color:red" work?
// → No. style takes an OBJECT with camelCase keys:
//     <p style={{ color: "red", fontSize: "20px" }}>Hi</p>
//   The double {{ }} = outer "JS starts" + inner object.
//
// Q9. How do false / null / undefined render? What about 0?
// → false/null/undefined render NOTHING (that's why cond && <X/> works).
//   But 0 is a number, so it DOES show. {items.length && <List/>} prints a
//   stray "0" when empty — use {items.length > 0 && <List/>} instead.
//
// Q10. Difference between an "element" and a "component"?
// → A component is the function/recipe (Counter). An element is one instance
//   made from it (<Counter />). Like a C# class vs an object/instance.
//
// Q11. Can a component return null? What happens?
// → Yes. `return null` means "render nothing" — common for conditionally
//   hiding UI: if (!user) return null.
//
// Q12. What if a component name starts with a lowercase letter?
// → React treats it as a built-in HTML tag, so <counter /> tries to make a
//   <counter> DOM element and your component never runs. Always Capitalize.
//
// Q13. Can one file hold multiple components?
// → Yes, but only one `export default` (the main one). Common convention:
//   one main component per file.
//
// Q14. Why use a Fragment <>...</> instead of a <div> wrapper?
// → A <div> adds an extra DOM node that can break layout/CSS. A Fragment
//   satisfies the single-root rule but adds NOTHING to the DOM.
//
// Q15. What can go inside JSX { }?
// → Any expression: variables, math, strings, function calls, ternaries,
//   .map(), even other JSX. NOT allowed: if / for / while (statements).
// =============================================================
