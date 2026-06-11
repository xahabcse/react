import { useState, useRef } from "react";

function makePassword(
  len: number,
  isNumberAllowed: boolean,
  isCharAllowed: boolean,
) {
  let words = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  if (isNumberAllowed) words += "0123456789";
  if (isCharAllowed) words += "!@#$%^&*";

  let result = "";
  for (let i = 0; i < len; i++) {
    result += words.charAt(Math.floor(Math.random() * words.length));
  }
  return result;
}

export default function PasswordGenerator() {
  const [password, setPassword] = useState(() => makePassword(8, false, false));
  const [length, setLength] = useState(8);
  const [isNumberAllowed, setIsNumberAllowed] = useState(false);
  const [isSpecialCharAllowed, setIsSpecialCharAllowed] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);

  const copyToClipboard = () => {
    passwordRef.current?.select();
    navigator.clipboard.writeText(password);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-teal-800 rounded-2xl shadow-lg p-6">
      <h2 className="text-white text-2xl font-semibold text-center mb-5">
        Password Generator
      </h2>
      <div className="flex rounded-lg overflow-hidden mb-4">
        <input
          type="text"
          ref={passwordRef}
          value={password}
          readOnly
          className="flex-1 bg-white text-orange-500 font-medium px-4 py-2"
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 font-medium"
          onClick={copyToClipboard}
        >
          Copy
        </button>
      </div>
      <div className="flex items-center gap-4 text-orange-500 flex-wrap">
        <input
          type="range"
          min={6}
          max={20}
          value={length}
          onChange={(event) => {
            const newLength = Number(event.target.value);
            setLength(newLength);
            setPassword(
              makePassword(newLength, isNumberAllowed, isSpecialCharAllowed),
            );
          }}
          className="cursor-pointer accent-blue-500"
        />
        <label>Length: {length}</label>

        <input
          type="checkbox"
          checked={isNumberAllowed}
          onChange={(e) => {
            const allowed = e.target.checked;
            setIsNumberAllowed(allowed);
            setPassword(makePassword(length, allowed, isSpecialCharAllowed));
          }}
          className="accent-blue-500"
        />
        <label>Numbers</label>

        <input
          type="checkbox"
          checked={isSpecialCharAllowed}
          onChange={(e) => {
            const allowed = e.target.checked;
            setIsSpecialCharAllowed(allowed);
            setPassword(makePassword(length, isNumberAllowed, allowed));
          }}
          className="accent-blue-500"
        />
        <label>Characters</label>
      </div>
    </div>
  );
}

/* =============================================================
   📝 INTERVIEW Q&A — Password Generator (useRef, no-effect, lazy state)
   -------------------------------------------------------------
   Q1. Why is makePassword defined OUTSIDE the component?
   → It is a pure function (uses only its parameters, no state/props).
     Outside it is not recreated every render, it can be called by the lazy
     initial state above the component, and its parameter names don't shadow
     the component's state. (Inside, it caused a "used before declared" error.)

   Q2. What is useState(() => makePassword(8, false, false)) — why a function?
   → Lazy initial state. Passing a function makes React run it only ONCE on
     mount to compute the first password, not on every render. Useful when the
     initial value is computed (here it also uses Math.random).

   Q3. Why is there NO useEffect, even though the password depends on length
       and the checkboxes?
   → Generating a password is the direct result of a USER EVENT (slide/click),
     so it belongs in the event handlers, not an effect ("You Might Not Need
     an Effect"). Effects are for syncing with external systems; setting state
     inside one also triggers a cascading-render warning.

   Q4. In the handlers, why pass the NEW value (newLength/allowed) into
       makePassword instead of reading length / isNumberAllowed?
   → setState is asynchronous. Right after setLength(x), the variable `length`
     still holds the OLD value in this same handler. So we pass the fresh value
     explicitly to build the correct password (avoids the stale-state trap).

   Q5. Why read e.target.checked instead of toggling prev => !prev here?
   → We need the new boolean both to setState AND to pass into makePassword.
     e.target.checked gives that new value directly, so one read serves both.

   Q6. Why does the password input have readOnly?
   → It's controlled (value={password}) with no onChange. Without readOnly
     React warns and freezes the field; readOnly says the read-only is intended.

   Q7. What is passwordRef (useRef) for? Is it required to copy?
   → Only for passwordRef.current?.select() — highlighting the text on copy.
     The copy itself uses navigator.clipboard.writeText(password) from STATE,
     so copying works without the ref. useRef is needed only to reach the real
     DOM node and call an imperative method (select/focus/scroll/measure).

   Q8. How is each random character picked?
   → Math.random() gives 0..<1; Math.floor(Math.random() times words.length)
     maps it to a valid index 0..length-1; words.charAt(index) returns the char.

   Q9. Why does the pool always start with letters?
   → So the pool is never empty even when both checkboxes are off — there is
     always something to pick. Numbers/specials are appended only when allowed.

   Q10. Why is the range controlled with value={length} and Number(...)?
   → value={length} keeps the slider in sync with state (controlled).
     e.target.value is always a string, so Number(...) converts it to a number.

   Q11. What does the accent-blue-500 class do?
   → A Tailwind utility that colors native form controls (range thumb/track,
     checkbox) blue, with no custom CSS.

   Q12. Could this use useEffect + useCallback instead?
   → Yes (an earlier version did): an effect with deps [length, number, char]
     calling a useCallback-wrapped generator. It works but sets state inside an
     effect (cascading-render warning). The event-handler version is the more
     idiomatic "no effect needed" approach.
   ============================================================= */
