// =============================================================
// ProductDetailPage.tsx — the PAGE that shows details of one product
// -------------------------------------------------------------
// It reads the :id from the URL (useParams) and fetches that one product.
// In .NET this is like ProductController.Details(id) + Details.cshtml.
// =============================================================
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { productService } from "../services/product.service";
import type { Product } from "../types/product.types";
import Spinner from "../components/Spinner";
import { FaArrowLeft, FaEdit, FaTrash } from "react-icons/fa";

export default function ProductDetailPage() {
  // useParams → pulls the id out of the URL /products/:id (it comes as a string).
  // Like .NET's [FromRoute] int id.
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate(); // to go to another page from code (like RedirectToAction)

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch a fresh product whenever the id changes — that's why [id] is a dependency.
  useEffect(() => {
    const load = async () => {
      try {
        const data = await productService.getById(Number(id)); // string id → number
        setProduct(data);
      } catch {
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleDelete = async () => {
    if (!product) return;
    if (window.confirm(`Delete "${product.name}"?`)) {
      await productService.delete(product.id);
      navigate("/products"); // after deleting, send back to the list page
    }
  };

  if (loading) return <Spinner />;
  if (error || !product) {
    // ?? = if the left side is null/undefined, show the right-side text
    return (
      <p className="text-center text-red-500 py-10">{error ?? "Not found"}</p>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        to="/products"
        className="inline-flex items-center gap-1 text-blue-600 hover:underline mb-6"
      >
        <FaArrowLeft /> Back to Products
      </Link>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              product.inStock
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {product.inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        <p className="text-gray-600 mb-4">{product.description}</p>

        <p className="text-3xl font-bold text-blue-600 mb-6">
          {product.price.toLocaleString()} BDT
        </p>

        <div className="flex gap-3">
          <Link
            to={`/products/edit/${product.id}`}
            className="flex items-center gap-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
          >
            <FaEdit /> Edit
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            <FaTrash /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   📝 INTERVIEW Q&A — Route params / Programmatic navigation
   -------------------------------------------------------------
   Q1. How do you read :id from the URL?
   → With the useParams() hook: const { id } = useParams(). The name must
     match the route (here path="/products/:id" → the key is "id").

   Q2. Why Number(id) on the useParams id?
   → All URL params arrive as strings ("5"). Our service wants a number, so
     we convert with Number(id).

   Q3. Link vs useNavigate — when to use which?
   → Link: the user clicks to go somewhere (declarative).
     useNavigate: when you must navigate from inside code — e.g. after a
     delete/submit, navigate("/products") (programmatic / imperative).

   Q4. Why is product's type Product | null?
   → Before the data arrives there is no product (null), hence the union
     type. We null-check (`!product`) before render so product.name doesn't
     crash.

   Q5. What would happen without the [id] dependency?
   → If the id changes within the same component (e.g. /products/2 →
     /products/3) the effect wouldn't run again and you'd see stale data.
     With [id], changing the id triggers a fresh fetch.
   ============================================================= */
