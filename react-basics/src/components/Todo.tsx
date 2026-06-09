// =============================================================
// Todo.tsx — a simple to-do list to practice useState with ARRAYS
// -------------------------------------------------------------
// Builds on the Counter lesson. New ideas here:
//   • state that holds an ARRAY (a list), not just a number
//   • add / toggle / delete items immutably (spread, map, filter)
//   • a controlled input + form submit
//   • rendering a list with .map() and a unique key
// All data lives in local state — no backend needed.
// =============================================================
import { useState } from "react";
import type { FormEvent } from "react";

// The shape of one to-do item.
interface TodoItem {
  id: number;
  text: string;
  done: boolean;
}

export default function Todo() {
  const [todos, setTodos] = useState<TodoItem[]>([]); // the list of to-dos (starts empty)
  const [text, setText] = useState(""); // the text in the input box

  // Add a new to-do when the form is submitted.
  const addTodo = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // stop the browser's default page reload
    const value = text.trim();
    if (!value) return; // ignore empty input

    // Build a NEW array: all old items + one new item. Never push into the old one.
    setTodos((prev) => [
      ...prev,
      { id: Date.now(), text: value, done: false }, // Date.now() = a quick unique id
    ]);
    setText(""); // clear the input box
  };

  // Toggle one item's "done" flag (found by id).
  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      // map → make a new array; change only the matching item, keep the rest as-is
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  // Remove one item (found by id).
  const deleteTodo = (id: number) => {
    // filter → new array with everything EXCEPT the matching id
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  // Derived value (computed from todos) — no separate state needed.
  const remaining = todos.filter((t) => !t.done).length;

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        My To-Do List
      </h2>

      {/* input + Add button (a controlled form) */}
      <form onSubmit={addTodo} className="flex gap-2 mb-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add
        </button>
      </form>

      {/* empty state vs the list */}
      {todos.length === 0 ? (
        <p className="text-center text-gray-400 py-6">
          No tasks yet. Add one above!
        </p>
      ) : (
        <ul className="space-y-2">
          {todos.map((todo) => (
            // key = unique id so React can track each row efficiently
            <li
              key={todo.id}
              className="flex items-center gap-3 border border-gray-200 rounded-lg px-3 py-2"
            >
              {/* checkbox toggles done */}
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id)}
                className="w-4 h-4"
              />

              {/* strike through the text when done (conditional className) */}
              <span
                className={`flex-1 ${
                  todo.done ? "line-through text-gray-400" : "text-gray-800"
                }`}
              >
                {todo.text}
              </span>

              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* small footer count, only when there are items */}
      {todos.length > 0 && (
        <p className="text-sm text-gray-500 mt-4 text-center">
          {remaining} of {todos.length} remaining
        </p>
      )}
    </div>
  );
}

/* =============================================================
   📝 INTERVIEW Q&A — Array state (add / update / remove)
   -------------------------------------------------------------
   Q1. How do you ADD an item to an array in state?
   → Build a NEW array with the old items plus the new one:
     setTodos(prev => [...prev, newItem]). Never use prev.push() — that
     mutates the existing array and React won't re-render.

   Q2. How do you UPDATE one item in an array?
   → Use map to return a new array, changing only the matching item:
     prev.map(t => t.id === id ? { ...t, done: !t.done } : t).
     The { ...t, done: !t.done } makes a new copy of that one item.

   Q3. How do you REMOVE an item?
   → Use filter to keep everything except the match:
     prev.filter(t => t.id !== id).

   Q4. Why immutability (new array/object) instead of editing in place?
   → React decides to re-render by comparing references. A brand-new
     array/object is a new reference, so React sees the change. Mutating
     in place keeps the same reference → no re-render → stale UI.

   Q5. Why is `key` needed on each <li>?
   → It uniquely identifies each row so React can tell which items were
     added/removed/reordered and update the DOM efficiently. Use a stable
     unique id, not the array index.

   Q6. Why Date.now() for the id?
   → It's a quick way to get a unique number per item for a demo. In a real
     app the backend/database usually assigns the id (like Product.id).

   Q7. Why is `remaining` not a useState?
   → It can be computed from todos (derived value). Anything derivable from
     existing state should NOT be its own state — that avoids sync bugs.
   ============================================================= */

/* =============================================================
   📝 INTERVIEW Q&A — Immutability / Array & Object updates (deep dive)
   -------------------------------------------------------------
   Q1. Why does immutability matter — how does React detect a change?
   → React compares the old and new value by REFERENCE (shallow compare). A
     brand-new array/object is a new reference, so the change is detected.
     Mutating in place keeps the same reference → no re-render.

   Q2. Which array methods should you avoid in state, and why?
   → push, pop, shift, splice, sort, reverse — they MUTATE the original
     array. Copy first: [...arr].sort(...).

   Q3. What is [name] in setForm({ ...prev, [name]: value })?
   → A computed property name — the variable's value becomes the key. That is
     how one handler can serve every input.

   Q4. Why wrap an object in ( ) when returning it from an arrow function?
   → Otherwise JS reads the braces as the function body. The ( ) says "this
     is an object literal", e.g. prev => ({ ...prev, x: 1 }).

   Q5. How do you change a field inside a NESTED object?
   → Copy every level, not just the top: { ...prev, address: { ...prev.address,
     city } }. Copying only the outer level mutates the inner one.

   Q6. Why .map() for update and .filter() for remove, not push/splice?
   → map/filter RETURN a new array (immutable) and leave the original intact.
     push/splice change the original, so no re-render happens.

   Q7. Does spread (...) deep-copy or shallow-copy?
   → Shallow (one level). { ...obj } copies the top level; nested objects/
     arrays still share the SAME reference. So nested updates need a copy at
     each level.

   Q8. How do you immutably update the item at a specific index?
   → Use .map() with the index:
       setArr(prev => prev.map((item, i) => i === idx ? newValue : item))

   Q9. How do you add an item to the START of an array (not the end)?
   → Flip the spread order:
       [newItem, ...prev]   // start
       [...prev, newItem]   // end

   Q10. How do you insert/remove at a specific position immutably?
   → splice mutates, so use slice:
       insert: [...prev.slice(0, idx), newItem, ...prev.slice(idx)]
       remove: [...prev.slice(0, idx), ...prev.slice(idx + 1)]
     If items have an id, filter is simpler for remove.

   Q11. How do you sort/reverse a list in state?
   → Copy first; sort/reverse mutate:
       setArr(prev => [...prev].sort((a, b) => a.price - b.price))

   Q12. How do you move/reorder an item immutably?
   → Build a new array; splice the COPY, not the state:
       setArr(prev => { const next = [...prev];
         const [m] = next.splice(from, 1); next.splice(to, 0, m); return next; })

   Q13. Why use the prev => updater form when updating arrays?
   → New state depends on previous state ([...prev, x], prev.map(...)). The
     updater always sees the LATEST state, even with batched/async updates.

   Q14. What happens if you forget ...prev in an object update?
   → The other fields are dropped. setForm({ name: value }) keeps only name
     and loses price/inStock. Almost always start object updates with ...prev.

   Q15. Why is the array index a bad key?
   → On add/remove/reorder the index shifts, so React pairs the wrong row with
     the wrong item and input/checkbox state gets mixed up. Use a stable unique
     id (todo.id), not the index.

   Q16. How do you tame deep/complex nested state?
   → (a) flatten the shape, (b) use useReducer, or (c) a library like Immer
     that lets you write mutating-style code but applies it immutably.
   ============================================================= */
