// =============================================================
// App.tsx — the app's "route map" (which URL shows which page)
// -------------------------------------------------------------
// .NET analogy: this is like the MapControllerRoute(...) routing config,
// and the <Navbar/> + <main> part is like the _Layout.cshtml common layout.
// =============================================================
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProductListPage from "./pages/ProductListPage";
import ProductCreatePage from "./pages/ProductCreatePage";
import ProductEditPage from "./pages/ProductEditPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import Counter from "./components/Counter";
import Todo from "./components/Todo";
import Error from "./components/Error";

export default function App() {
  return (
    // BrowserRouter = turns on routing for the whole app. The page changes
    // based on the URL, but the page never fully reloads — that's the SPA magic.
    <BrowserRouter>
      {/* Navbar is outside Routes — so it always shows on top of every page */}
      <Navbar />

      {/* every page's content sits in the middle of this container */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Routes = a list of Route entries; the one matching the current URL is shown */}
        <Routes>
          {/* visiting "/" redirects straight to /products. replace = back button won't return to "/" */}
          <Route path="/" element={<Navigate to="/products" replace />} />

          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/create" element={<ProductCreatePage />} />

          {/* :id = the dynamic part; that page reads it with useParams */}
          <Route path="/products/edit/:id" element={<ProductEditPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />

          {/* learning playground: a simple counter (useState practice) */}
          <Route path="/counter" element={<Counter />} />

          {/* learning playground: a simple to-do list (array state practice) */}
          <Route path="/todo" element={<Todo />} />

          {/* "*" = if nothing above matched (404 page) */}
          <Route path="*" element={<Error />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

/* =============================================================
   📝 INTERVIEW Q&A — React Router / Routing
   -------------------------------------------------------------
   Q1. Why is routing special in an SPA? Why not a plain <a href>?
   → <a href> fully reloads the page (fetches new HTML from the server).
     React Router changes the URL without a reload — it just swaps the
     matched component. So it's fast and you don't lose state.

   Q2. Difference between BrowserRouter and HashRouter?
   → BrowserRouter gives clean URLs (/products) but the server must send
     all routes to index.html (a fallback). HashRouter uses a # in the URL
     (/#/products) — needs no server config, but looks less clean.

   Q3. How do you read a route parameter like :id?
   → With the useParams() hook: const { id } = useParams(). Like .NET's
     [FromRoute] int id.

   Q4. Won't /products/create be matched by :id as the "create" value?
   → No. React Router v6+ does best-match (ranking), not top-to-bottom.
     A static segment ("create") always wins over a dynamic one (":id").
     So /products/create shows the correct page.

   Q5. What does <Navigate> do?
   → As soon as it renders, it sends you to another route (declarative
     redirect). To redirect from inside code, use useNavigate() instead.

   Q6. Why is Navbar placed outside Routes?
   → Things that should appear on every page (header/footer) go outside
     Routes; they stay put when the page changes, and only the content
     inside Routes swaps.
   ============================================================= */
