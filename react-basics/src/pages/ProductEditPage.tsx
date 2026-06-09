// =============================================================
// ProductEditPage.tsx — the PAGE for editing an existing product
// -------------------------------------------------------------
// It first fetches the product by id and fills the form with it (initialData),
// then updates it on submit. It reuses the same ProductForm as Create.
// =============================================================
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productService } from "../services/product.service";
import ProductForm from "../components/ProductForm";
import Spinner from "../components/Spinner";
import type { ProductFormData } from "../types/product.types";

export default function ProductEditPage() {
  const { id } = useParams<{ id: string }>(); // the :id from the URL
  const navigate = useNavigate();

  // initialData = what the form shows up-front (the existing data). Starts undefined.
  const [initialData, setInitialData] = useState<ProductFormData | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // When the page opens, fetch the existing product by id and shape it for the form.
  useEffect(() => {
    const load = async () => {
      try {
        const product = await productService.getById(Number(id));
        // Take only the fields the form needs (drop id — ProductFormData has no id).
        setInitialData({
          name: product.name,
          description: product.description,
          price: product.price,
          inStock: product.inStock,
        });
      } catch {
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (data: ProductFormData) => {
    await productService.update(Number(id), data); // PUT → update on the server
    navigate("/products");
  };

  if (loading) return <Spinner />;
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Edit Product
      </h2>
      {/* pass initialData → the form comes pre-filled */}
      <ProductForm
        initialData={initialData}
        onSubmit={handleSubmit}
        submitLabel="Update Product"
      />
    </div>
  );
}

/* =============================================================
   📝 INTERVIEW Q&A — Edit flow / Prefilled form
   -------------------------------------------------------------
   Q1. What's the main difference between the Edit and Create pages?
   → Edit first fetches the existing data by id and fills the form
     (initialData), and calls update() on submit. Create shows an empty form
     and calls create() on submit. But the form (UI) is the same — only the
     props differ.

   Q2. How does the old data get "prefilled" into the form?
   → Here initialData is fetched into state and passed to ProductForm via
     props. ProductForm's own useEffect sets its form state from that
     initialData — so the inputs appear pre-filled.

   Q3. Why map only 4 fields instead of using the whole product?
   → The form's type is ProductFormData — it has no id. Taking only the
     needed fields keeps the types matching and avoids accidentally sending
     the id into form data.

   Q4. Two useEffects (this page + ProductForm) — is that a problem?
   → No. This page fetches the data; ProductForm syncs its own state when
     that data arrives. Each component has its own separate responsibility —
     this is normal.

   Q5. Why isn't passing the initial value as a prop enough for a controlled form?
   → useState(initialData) only runs on the first render. If the data arrives
     later (async), the state would stay stale — so a useEffect is needed to
     update it afterwards.
   ============================================================= */
