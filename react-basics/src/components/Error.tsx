// =============================================================
// Error.tsx — the 404 "Not Found" page.
// -------------------------------------------------------------
// Shown by the catch-all "*" route in App.tsx when the URL does not
// match any real page. It sits OUTSIDE the Layout, so it renders on
// its own — with no Navbar on top.
// =============================================================
import { Link } from "react-router-dom";

export default function Error() {
  return (
    <>
      {/* center everything in the middle of the screen */}
      <div className="flex flex-col items-center justify-center text-sm max-md:px-4 py-20">
        {/* big heading */}
        <h1 className="text-4xl md:text-5xl font-bold bg-gray-500 bg-clip-text text-transparent">
          404 Not Found
        </h1>

        {/* thin divider line under the heading */}
        <div className="h-px w-80 rounded bg-gray-800 my-5 md:my-7"></div>

        {/* short explanation for the user */}
        <p className="md:text-xl text-gray-400 max-w-lg text-center">
          The page you are looking for does not exist or has been moved.
        </p>

        {/* Link (NOT a plain <a>) = goes back WITHOUT a full page reload —
            that's the SPA navigation. We send the user to /products (the real
            landing page); "/" has no route anymore, so it would just 404 again. */}
        <Link
          to="/products"
          className="group flex items-center gap-1 bg-white hover:bg-gray-200 px-7 py-2.5 text-gray-800 rounded-full mt-10 font-medium active:scale-95 transition-all"
        >
          Back to Products
        </Link>
      </div>
    </>
  );
}
