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
