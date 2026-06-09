// =============================================================
// product.service.ts — the only place that talks to the API (server)
// -------------------------------------------------------------
// .NET analogy: this is your Service layer + HttpClient.
//   axios  ≈ HttpClient
//   Keeping every HTTP call in one place keeps the components clean, and
//   changing the URL/logic once works everywhere (the DRY principle).
// =============================================================
import axios from "axios";
import type { Product, ProductFormData } from "../types/product.types";

// Address of our mock backend (json-server). For a real API you only
// change this one line — no component code needs to be touched.
const API_URL = "http://localhost:3001/products";

// All functions live inside one object — whoever needs it imports it.
export const productService = {
  // get all products → GET /products
  getAll: async (): Promise<Product[]> => {
    const res = await axios.get<Product[]>(API_URL);
    return res.data; // axios wraps every response; the real data is in res.data
  },

  // get one product by id → GET /products/5
  getById: async (id: number): Promise<Product> => {
    const res = await axios.get<Product>(`${API_URL}/${id}`);
    return res.data;
  },

  // create a new product → POST /products  (form data goes in the body)
  create: async (data: ProductFormData): Promise<Product> => {
    const res = await axios.post<Product>(API_URL, data);
    return res.data;
  },

  // update an existing product → PUT /products/5
  update: async (id: number, data: ProductFormData): Promise<Product> => {
    const res = await axios.put<Product>(`${API_URL}/${id}`, data);
    return res.data;
  },

  // delete a product → DELETE /products/5  (returns nothing, so void)
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  },
};

/* =============================================================
   📝 INTERVIEW Q&A — axios / async-await / Service layer
   -------------------------------------------------------------
   Q1. Why a separate service layer? Why not call axios from components?
   → (1) all API calls live in one place, (2) change the URL/headers once
     and it applies everywhere, (3) components only care about UI, (4) it
     is easier to test. This is separation of concerns.

   Q2. What does async / await actually do?
   → await is used on something that takes time (a network call) — the
     function "waits" for the result without freezing (blocking) the UI.
     An async function always returns a Promise.

   Q3. What is a Promise?
   → A promise of a future value. Three states: pending → fulfilled /
     rejected. await gives you the fulfilled value; a rejection is caught
     by try/catch.

   Q4. axios vs fetch?
   → axios parses JSON for you (res.data is ready), makes base URL /
     interceptors easy, and has convenient error handling. fetch is
     built-in but more manual (you call res.json(), and it does not throw
     on HTTP errors by itself).

   Q5. What is the `<Product[]>` in `axios.get<Product[]>`?
   → A generic — it tells axios "the response data is of type Product[]",
     so res.data gets autocomplete + type-safety.

   Q6. Why is there no error handling here?
   → On purpose. How to show an error (spinner/toast/redirect) is a UI
     decision, so we let the error throw and catch it in the component's
     try/catch (see ProductListPage).
   ============================================================= */
