// =============================================================
// ProductForm.tsx — one form used by both the Create and Edit pages
// -------------------------------------------------------------
// In .NET we reused a form with a Partial View (_ProductForm.cshtml) — same idea.
// The key thing to learn: a "controlled component" — each input's value lives
// in React state, i.e. state is the single source of truth.
// =============================================================
import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react"; // types only, not needed at runtime
import type { ProductFormData } from "../types/product.types";
import { Link } from "react-router-dom";

interface ProductFormProps {
  initialData?: ProductFormData; // Edit passes existing data; Create doesn't → so optional (?)
  onSubmit: (data: ProductFormData) => Promise<void>; // what happens on submit — the parent decides
  submitLabel: string; // the button text: "Create Product" / "Update Product"
}

// The starting empty state for a new (Create) form.
const emptyForm: ProductFormData = {
  name: "",
  description: "",
  price: 0,
  inStock: true,
};

export default function ProductForm({
  initialData,
  onSubmit,
  submitLabel,
}: ProductFormProps) {
  // form = the current value of the whole form (all fields in one object).
  // Start from initialData if present, otherwise the empty form. (?? = if left side is null/undefined, use the right side)
  const [form, setForm] = useState<ProductFormData>(initialData ?? emptyForm);
  const [submitting, setSubmitting] = useState(false); // is a submit in progress (to disable the button)
  const [error, setError] = useState<string | null>(null); // validation / error message

  // On the Edit page the data arrives asynchronously — on the first render
  // initialData may be undefined; when it arrives, this effect updates the form with it.
  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]); // runs again whenever initialData changes

  // Typing in any input runs this single function (shared by all fields).
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target; // the input's name attribute tells us which field
    setForm((prev) => ({
      ...prev, // keep all previous fields unchanged (spread = copy)
      // change only this one field ([name] = computed property name)
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked // checkbox → true/false
          : type === "number"
            ? Number(value) // number input → convert string to number
            : value, // everything else → string
    }));
  };

  // On form submit:
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // stop the browser's default page reload (very important!)
    setError(null);

    // simple validation (like .NET's ModelState, but manual here)
    if (!form.name.trim()) {
      setError("Product name is required");
      return;
    }
    if (form.price <= 0) {
      setError("Price must be greater than 0");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(form); // the real work (create/update) is done by the parent
    } catch {
      setError("Operation failed. Please try again.");
    } finally {
      setSubmitting(false); // success or failure — enable the button again
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
      {/* show this box only if there is an error (&& short-circuit) */}
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Product Name
        </label>
        {/* value={form.name} + onChange → this is a "controlled input" */}
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter product name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter product description"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Price (BDT)
        </label>
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          min={0}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="flex items-center gap-2">
        {/* a checkbox uses checked (true/false), not value */}
        <input
          type="checkbox"
          name="inStock"
          checked={form.inStock}
          onChange={handleChange}
          className="w-4 h-4 text-blue-600 rounded"
        />
        <label className="text-sm text-gray-700">In Stock</label>
      </div>

      {/* row with two actions side by side: Save (submit) and Home (cancel) */}
      <div className="flex items-center justify-between">
        {/* while submitting, disable the button and change its text (prevents double-submit) */}
        <button
          type="submit"
          disabled={submitting}
          className="w-50 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
        >
          {submitting ? "Saving..." : submitLabel}
        </button>
        {/* Home = a Link styled as a button; leaves the form and goes back to
            the product list without a full reload (SPA navigation) */}
        <Link
          to="/products"
          className="w-50 bg-green-500 text-white text-center font-semibold py-2 rounded-lg hover:bg-green-700"
        >
          Home
        </Link>
      </div>
    </form>
  );
}

/* =============================================================
   📝 INTERVIEW Q&A — Controlled forms / State / useEffect
   -------------------------------------------------------------
   Q1. What is a controlled vs uncontrolled component?
   → Controlled: the input's value lives in React state (value + onChange).
     React is the source of truth. Uncontrolled: the DOM keeps the value
     and you read it later via a ref. In React, controlled is usually
     recommended.

   Q2. What happens if you don't call e.preventDefault()?
   → On submit the browser's default behavior reloads the whole page, so
     everything resets before our JS handler can do its job properly.

   Q3. Why setForm({ ...prev, [name]: value }) — why spread and [name]?
   → You must not mutate state directly (immutability). So we make a copy of
     the previous object and change just one field. [name] is a computed key,
     meaning the variable's value becomes the property name — so one handler
     can serve all inputs.

   Q4. What's wrong with changing state directly like `form.name = "x"`?
   → React can't tell anything changed (the reference stays the same), so it
     does not re-render and the UI doesn't update. Always pass a new value
     via setState/setForm.

   Q5. setForm(prev => ...) — why an updater function instead of a plain object?
   → When the new state is based on the previous state, the updater form is
     safe (it always sees the correct previous value, even with several
     updates in a row).

   Q6. What is the role of the [initialData] dependency in useEffect?
   → On Edit the data arrives late (async). When initialData changes, the
     effect runs again and fills the form with the new data. With [] it would
     run only once; with no array at all it would run on every render (risk
     of an infinite loop).

   Q7. Why checked instead of value on a checkbox?
   → A checkbox's state is a boolean (on/off), so checked={true/false}; and
     in handleChange we read e.target.checked, not e.target.value.
   ============================================================= */

/* =============================================================
   📝 INTERVIEW Q&A — Event handling
   -------------------------------------------------------------
   Q1. How does React handle events? How is it different from HTML?
   → You pass a FUNCTION to a JSX prop (onClick={fn}). Names are camelCase
     (onClick, onChange) and the value is a function — in HTML it was a string
     (onclick="...").

   Q2. onClick={fn} vs onClick={fn()} — difference?
   → The first passes a function reference, runs on click (correct). The
     second CALLS fn during render (wrong). To pass an argument, wrap it:
     onClick={() => fn(arg)}.

   Q3. How do you pass an argument to a handler?
   → Wrap it in an arrow function so it runs on the event:
     onClick={() => onDelete(id)}.

   Q4. What is a SyntheticEvent?
   → React's cross-browser wrapper around the native event. It gives the same
     API everywhere (e.target, e.preventDefault(), ...), so behavior is
     consistent across browsers.

   Q5. What does e.preventDefault() do? What happens without it?
   → It stops the browser's default behavior. Without it, a form submit
     reloads the whole page (state lost); a link navigates away.

   Q6. What does e.stopPropagation() do?
   → It stops the event from bubbling up to parent elements, so an inner
     element's click does not also trigger an outer handler.

   Q7. e.target vs e.currentTarget?
   → e.target is the deepest element where the event actually happened.
     e.currentTarget is the element the handler is attached to. The difference
     matters with bubbling (e.g. a click inside a form/list).

   Q8. checkbox: e.target.value or e.target.checked?
   → e.target.checked (a boolean, on/off). Text inputs use e.target.value
     (a string).

   Q9. How does one handler serve many inputs?
   → Give each input a name attribute, then in the handler read e.target.name
     and update state with [name]: value (see handleChange above).

   Q10. Does an inline arrow onClick={() => ...} hurt performance?
   → It creates a new function each render — usually negligible. Only for very
     large lists or heavy children is it worth optimizing with useCallback.
   ============================================================= */

/* =============================================================
   📝 INTERVIEW Q&A — Controlled inputs
   -------------------------------------------------------------
   Q1. What does a controlled input need?
   → Two things: value={state} (state → input) and onChange (input → state).
     State is the single source of truth.

   Q2. What if you set value but not onChange?
   → The input becomes read-only/frozen (you can't type) and React warns.
     Provide both, or use defaultValue for an uncontrolled input.

   Q3. What's special about a number input?
   → e.target.value is always a STRING, so convert with Number(value), else
     math/comparisons break.

   Q4. What's different about a checkbox?
   → Use checked={boolean}, not value; and read e.target.checked in the
     handler.

   Q5. How do you set a textarea's value?
   → With the value prop (<textarea value={x} />), not via children like HTML.

   Q6. How does one handler serve a whole form?
   → Keep the form as an object, give each input a name, and do
     setForm(prev => ({ ...prev, [name]: value })).

   Q7. value vs defaultValue?
   → value = controlled (React owns it, set every render). defaultValue =
     uncontrolled (set once initially, then the DOM keeps it).

   Q8. Why use controlled inputs at all?
   → Live validation, conditionally disabling the submit button, formatting/
     transforming input, and one place (state) holding all the data.

   Q9. How do you clear/reset a controlled input?
   → Set its state back to the initial value (setText(""), setForm(emptyForm)).
     Since value follows state, the input clears itself.

   Q10. Is a file input (<input type="file">) controlled?
   → No, always uncontrolled. For security JS can't set its value, so read
     e.target.files in onChange and never pass value=.

   Q11. How do you handle a group of checkboxes (multi-select)?
   → Keep an array in state and add/remove the value immutably on change:
     setTags(prev => checked ? [...prev, val] : prev.filter(t => t !== val)).

   Q12. value goes from undefined to a string — what warning appears?
   → "A component is changing an uncontrolled input to controlled." Start with
     a defined value ("" not undefined) so it's controlled from the first render.

   Q13. How do you format/transform input as the user types?
   → Transform inside onChange before setState, e.g.
     onChange={e => setCode(e.target.value.toUpperCase())}.

   Q14. Why can controlled inputs feel laggy in big forms, and what helps?
   → Every keystroke re-renders. Split components, debounce expensive work
     (search/API), or for very large forms consider uncontrolled + refs.
   ============================================================= */
