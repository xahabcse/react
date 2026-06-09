// =============================================================
// ProductListPage.tsx — the PAGE that shows the list of all products
// -------------------------------------------------------------
// In .NET this is the equivalent of ProductController.Index() + Index.cshtml.
// What to learn: holding data in state, fetching data from the API with
// useEffect, rendering a list with .map(), and filtering with a search box.
// =============================================================
import { useState, useEffect } from "react";
import { productService } from "../services/product.service";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";
import type { Product } from "../types/product.types";

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]); // the list coming from the server
  const [loading, setLoading] = useState(true); // is data still loading
  const [error, setError] = useState<string | null>(null); // message if something fails
  const [search, setSearch] = useState(""); // the text in the search box

  // An empty [] as the second argument to useEffect = this runs only once,
  // right after the page first loads. (like .NET's Page_Load / OnInitializedAsync)
  useEffect(() => {
    const load = async () => {
      try {
        const data = await productService.getAll();
        setProducts(data); // state changed → React re-renders by itself
      } catch {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    load(); // an effect's callback can't be async directly, so we make one inside and call it
  }, []);

  // When deleting a product: delete it on the server, then remove it from local state too.
  // We build a new array with filter — we don't mutate the old one (immutability).
  const deleteProduct = async (id: number) => {
    await productService.delete(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // "early return" — if loading/error, stop here and don't run the UI below.
  if (loading) return <Spinner />;
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;

  // filter by the search text — computed during render (a derived value, no separate state needed).
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Products ({filtered.length})
        </h2>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)} // typing updates state → list re-filters
          className="border border-gray-300 rounded-lg px-3 py-2 w-64 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-500 py-10">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* .map() builds one ProductCard from each product */}
          {filtered.map((product) => (
            <ProductCard
              key={product.id} // key = identifies each item uniquely (required in lists)
              product={product} // pass data down via props
              onDelete={deleteProduct} // runs this when delete happens (event flows up)
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* =============================================================
   📝 INTERVIEW Q&A — useState / useEffect / Lists
   -------------------------------------------------------------
   Q1. What does useState return?
   → An array: [current value, a function to change it]. e.g.
     const [products, setProducts] = useState([]). Calling setProducts makes
     React re-render the component with the new value.

   Q2. What is useEffect, and what does the dependency array mean?
   → It runs side-effects (API call, subscription) "after" render.
     • []  → only once (on mount)
     • [x] → first time + every time x changes
     • (none) → on every render (careful: can loop)

   Q3. Why can't the useEffect callback be async?
   → The effect's callback must return either nothing or a cleanup function.
     An async function returns a Promise — so we make a separate async
     function inside and call it (here load()).

   Q4. Why is key required when rendering a list?
   → key lets React identify each item; it quickly knows what was
     added/removed/changed (efficient re-render). Avoid using the index as
     key (bugs on reorder/delete) — a unique id is better.

   Q5. Why didn't I make `filtered` a state?
   → It can be computed from products + search (derived). What can be derived
     should not be state — duplicate state leads to sync bugs.

   Q6. Why filter after delete instead of calling getAll() again?
   → The server already deleted it; to update the UI fast we just remove it
     from the local list (fewer network calls, snappier UX).
   ============================================================= */
