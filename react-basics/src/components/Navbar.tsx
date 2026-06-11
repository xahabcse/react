// =============================================================
// Navbar.tsx — the top navigation bar (visible on every page)
// -------------------------------------------------------------
// NavLink is like Link, but it lets you style the link of "the page we are
// currently on" differently (active state). Like the menu highlight in a
// .NET _Layout.
// =============================================================
import { NavLink } from "react-router-dom";

export default function Navbar() {
  // NavLink gives each link an { isActive } flag → we pick the class from it.
  // So the link for the page we are currently on stays red.
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "text-white bg-red-700 px-4 py-2 rounded" // style for the active link
      : "text-blue-200 hover:text-white px-4 py-2"; // style for a normal link

  return (
    <nav className="bg-blue-500 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-white text-xl font-bold">Product CRUD</h1>
        <div className="flex gap-2">
          {/* to = which URL to go to. Clicking changes the route without a page reload. */}
          <NavLink to="/products" className={linkClass}>
            Products
          </NavLink>
          <NavLink to="/counter" className={linkClass}>
            Counter
          </NavLink>
          <NavLink to="/todo" className={linkClass}>
            Todo
          </NavLink>
          <NavLink to="/password" className={linkClass}>
            Password
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

/* =============================================================
   📝 INTERVIEW Q&A — Link / NavLink / Navigation
   -------------------------------------------------------------
   Q1. Link vs a plain <a> tag — difference?
   → <a href> fully reloads the page (the whole app loads again).
     <Link>/<NavLink> changes the route without a reload (client-side
     navigation) — fast, and state is kept.

   Q2. Difference between Link and NavLink?
   → Same job (navigation), but NavLink gives extra "active" info — you can
     style/class the current route's link differently. That's why menus use
     NavLink.

   Q3. Why can className be a function here?
   → On NavLink, className can be not just a string but a function that
     receives { isActive } and returns a string. So it's one class when
     active and another when not.

   Q4. How does Navbar, written once, show on every page?
   → In App.tsx it is placed outside <Routes>; so it stays when the route
     changes, and only the page part inside Routes swaps.
   ============================================================= */
