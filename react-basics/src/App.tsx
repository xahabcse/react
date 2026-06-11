// =============================================================
// App.tsx — the app's "route map" (which URL shows which page)
// -------------------------------------------------------------
// .NET analogy: this is like the MapControllerRoute(...) routing config.
// The <Layout/> below (Navbar + <main>) is like _Layout.cshtml — the
// shared shell that wraps the normal pages. The 404 page is left OUT of
// that shell on purpose, so it shows with NO Navbar.
// =============================================================
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProductListPage from "./pages/ProductListPage";
import ProductCreatePage from "./pages/ProductCreatePage";
import ProductEditPage from "./pages/ProductEditPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import Counter from "./components/Counter";
import Todo from "./components/Todo";
import Error from "./components/Error";
import PasswordGenerator from "./components/PasswordGenerator";

// -------------------------------------------------------------
// Layout = the shared shell (Navbar + page container) that wraps
// every NORMAL page. <Outlet/> is the empty slot where the matched
// child page gets dropped in — same idea as @RenderBody() in .NET's
// _Layout.cshtml. Anything outside this Layout shows with no Navbar.
// -------------------------------------------------------------
function Layout() {
  return (
    <>
      {/* Navbar lives inside Layout now — so it only shows on pages that use Layout */}
      <Navbar />

      {/* every page's content sits in the middle of this container */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* the matched child page renders right here */}
        <Outlet />
      </main>
    </>
  );
}

export default function App() {
  return (
    // BrowserRouter = turns on routing for the whole app. The page changes
    // based on the URL, but the page never fully reloads — that's the SPA magic.
    <BrowserRouter>
      {/* Routes = a list of Route entries; the one matching the current URL is shown */}
      <Routes>
        {/* ---- Pages WITH the Navbar ---- */}
        {/* This parent Route has NO path — it only wraps its children in <Layout/>.
            Each child renders inside Layout's <Outlet/>, so they all get the Navbar. */}
        <Route element={<Layout />}>
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/create" element={<ProductCreatePage />} />

          {/* :id = the dynamic part; that page reads it with useParams */}
          <Route path="/products/edit/:id" element={<ProductEditPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />

          {/* learning playground: a simple counter (useState practice) */}
          <Route path="/counter" element={<Counter />} />

          {/* learning playground: a simple to-do list (array state practice) */}
          <Route path="/todo" element={<Todo />} />
          <Route path="/password" element={<PasswordGenerator />} />
        </Route>

        {/* ---- Page WITHOUT the Navbar ---- */}
        {/* "*" = if nothing above matched (404 page). It sits OUTSIDE <Layout/>,
            so it renders on its own — no Navbar on top. */}
        <Route path="*" element={<Error />} />
      </Routes>
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

   Q6. How do you show the Navbar on every page EXCEPT one (like the 404)?
   → Use a "layout route": a parent <Route element={<Layout/>}> with NO
     path. Put the shared UI (Navbar) inside Layout, with an <Outlet/>
     where child pages render. Pages you want WITHOUT the shell (the 404)
     go as siblings, outside the layout route.

   Q7. What is <Outlet/>?
   → It's the placeholder inside a layout where the matched child route
     renders — like @RenderBody() in .NET's _Layout.cshtml. Without it,
     the child pages would have nowhere to show.
   ============================================================= */
