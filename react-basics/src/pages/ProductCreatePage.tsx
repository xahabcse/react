// =============================================================
// ProductCreatePage.tsx — the PAGE for creating a new product
// -------------------------------------------------------------
// It doesn't build a form itself — it uses the reusable <ProductForm/>.
// It only decides "what happens on submit" (create, then go back to the list).
// A page that mostly wires components together is called a "container".
// =============================================================
import { useNavigate } from "react-router-dom";
import { productService } from "../services/product.service";
import ProductForm from "../components/ProductForm";
import type { ProductFormData } from "../types/product.types";

export default function ProductCreatePage() {
  const navigate = useNavigate();

  // This function is passed to ProductForm as the onSubmit prop.
  // It runs only after the form is valid and submitted.
  const handleSubmit = async (data: ProductFormData) => {
    await productService.create(data); // POST → create a new product on the server
    navigate("/products"); // like .NET's RedirectToAction("Index")
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Add New Product
      </h2>
      {/* not passing initialData (it's new) → the form shows empty */}
      <ProductForm onSubmit={handleSubmit} submitLabel="Create Product" />
    </div>
  );
}

/* =============================================================
   📝 INTERVIEW Q&A — Composition / Container component
   -------------------------------------------------------------
   Q1. Why is this page so small? Where is the form?
   → The form is a separate reusable component (ProductForm). This page only
     decides "what happens when creating". This is component composition —
     building bigger UI by combining small pieces.

   Q2. Can a function be passed as a prop?
   → Yes. In React a function is just a normal value — so we pass
     handleSubmit as onSubmit; the child (form) calls it at the right time.

   Q3. How do Create and Edit use the same ProductForm?
   → The form is kept generic: what data to start with (initialData), what
     happens on submit (onSubmit), and the button text (submitLabel) all come
     from outside via props. So one form serves two jobs (DRY).

   Q4. Why navigate after the create await finishes?
   → We first make sure it was saved on the server (await), then send back to
     the list — so the updated list including the new product is shown.
   ============================================================= */
