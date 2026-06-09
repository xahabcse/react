// =============================================================
// ProductCard.tsx — a small "card" for one product (shown many times in the list)
// -------------------------------------------------------------
// This is a reusable component. It does not fetch data and is not tied to any
// URL — it just receives data through "props" and displays it nicely.
// In .NET this is like a Partial View / ViewComponent.
// =============================================================
import { Link } from "react-router-dom";
import type { Product } from "../types/product.types";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

// The type of props this component accepts:
interface ProductCardProps {
  product: Product; // which product to show
  onDelete: (id: number) => void; // function to tell the parent when delete is clicked
}

// We "destructure" the props with { } (pull them straight out of the object).
export default function ProductCard({ product, onDelete }: ProductCardProps) {
  // On delete: confirm first, then call the parent's onDelete.
  // Note: the card does not delete by itself — it only "reports the event" to the parent.
  // Pattern: data flows down via props, events flow up via callbacks.
  const handleDelete = () => {
    if (window.confirm(`Delete "${product.name}"?`)) {
      onDelete(product.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        {/* inside { } you put a JS value — like Razor's @Model.Name */}
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>

        {/* different color and text based on a condition — this is conditional rendering */}
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            product.inStock
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {product.inStock ? "In Stock" : "Out of Stock"}
        </span>
      </div>

      <p className="text-gray-500 text-sm mb-3 line-clamp-2">
        {product.description}
      </p>

      <p className="text-xl font-bold text-blue-600 mb-4">
        {/* toLocaleString() → shows 75000 as 75,000 */}
        {product.price.toLocaleString()} BDT
      </p>

      <div className="flex gap-2">
        {/* use Link to go to Details / Edit (changes route, no reload) */}
        <Link
          to={`/products/${product.id}`}
          className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
        >
          <FaEye /> Details
        </Link>
        <Link
          to={`/products/edit/${product.id}`}
          className="flex items-center gap-1 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 text-sm"
        >
          <FaEdit /> Edit
        </Link>
        {/* delete is an action (not navigation), so a button + onClick */}
        <button
          onClick={handleDelete}
          className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
        >
          <FaTrash /> Delete
        </button>
      </div>
    </div>
  );
}

/* =============================================================
   📝 INTERVIEW Q&A — Props / Events / Conditional rendering
   -------------------------------------------------------------
   Q1. What are props? How are they different from state?
   → props = data passed from parent to child, read-only for the child.
     state = a component's own internal data that it can change itself.
     In short: props come from outside, state lives inside.

   Q2. `onClick={handleDelete}` vs `onClick={handleDelete()}` — difference?
   → First: passing the function reference, runs on click (correct).
     Second: the function is called during render (wrong!). If you need an
     argument, wrap it: onClick={() => handleDelete(id)}.

   Q3. How do you send data/events from child to parent?
   → The parent passes a function as a prop (here onDelete); the child calls
     it. In React data flows one way (parent→child) and events come back via
     callbacks — this is "one-way data flow / lifting state up".

   Q4. What are the ways to do conditional rendering?
   → (a) ternary: {cond ? <A/> : <B/>}, (b) &&: {cond && <A/>},
     (c) compute into a variable first, (d) early return.

   Q5. Can props be changed from the child?
   → No, props are immutable (read-only). To change them, change the
     parent's state, and new props will flow down.
   ============================================================= */
