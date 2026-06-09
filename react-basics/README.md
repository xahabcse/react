# Product CRUD App

A simple product management (CRUD) web app built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS v4**, and **React Router v7**. Data is served by a lightweight mock REST API ([json-server](https://github.com/typicode/json-server)), so you can run the whole thing locally with **no real backend or database**.

You can list, search, view, create, edit, and delete products.

---

## ⚠️ Important: where to run commands

The app lives in the **`react-basics/`** subfolder, **not** the repository root.

```text
Todo-app/            ← repo root (do NOT run npm run dev here)
└── react-basics/    ← the actual app — run all commands from here
    ├── src/
    ├── db.json
    └── package.json ← the scripts (dev, server, build) live here
```

If you run `npm run dev` from the repo root you'll get `npm error Missing script: "dev"`.
Always `cd react-basics` first.

---

## Prerequisites

- **Node.js 20.19+ or 22.12+** (required by Vite 7) — check with `node -v`
- **npm** (comes with Node) — check with `npm -v`

---

## Getting started

The app needs **two processes running at the same time**:

1. the **mock API** (json-server) on port **3001**
2. the **frontend** (Vite dev server) on port **5173**

### 1. Install dependencies

```bash
cd react-basics
npm install
```

### 2. Start the mock API (Terminal 1)

```bash
npm run server
```

This watches `db.json` and serves the REST API at `http://localhost:3001`.
Leave this terminal running.

### 3. Start the frontend (Terminal 2)

```bash
npm run dev
```

Open the URL Vite prints (default `http://localhost:5173`) in your browser.

> 💡 Both commands must run from inside `react-basics/`, each in its own terminal.
> If you only start the frontend, the product list will show **"Failed to load products"** because the API isn't running.

---

## Available scripts

Run these from the `react-basics/` folder:

| Command           | What it does                                                       |
| ----------------- | ------------------------------------------------------------------ |
| `npm run dev`     | Start the Vite dev server with hot reload (frontend)               |
| `npm run server`  | Start json-server mock API on port 3001 (watches `db.json`)        |
| `npm run build`   | Type-check (`tsc -b`) and build the production bundle into `dist/` |
| `npm run preview` | Preview the production build locally                               |
| `npm run lint`    | Run ESLint over the project                                        |

---

## How it works

- **Frontend** talks to the API via `axios`. The base URL is defined in
  [`src/services/product.service.ts`](src/services/product.service.ts):

  ```ts
  const API_URL = "http://localhost:3001/products";
  ```

  If you change the API port, update it here.

- **Mock data** lives in [`db.json`](db.json). json-server turns the `products`
  array into a full REST API automatically:

  | Method   | Endpoint        | Action            |
  | -------- | --------------- | ----------------- |
  | `GET`    | `/products`     | List all products |
  | `GET`    | `/products/:id` | Get one product   |
  | `POST`   | `/products`     | Create a product  |
  | `PUT`    | `/products/:id` | Update a product  |
  | `DELETE` | `/products/:id` | Delete a product  |

  Changes you make in the UI are persisted back to `db.json` on disk.

---

## Routes

| Path                 | Page            | Description                        |
| -------------------- | --------------- | ---------------------------------- |
| `/`                  | →               | Redirects to `/products`           |
| `/products`          | Product list    | Grid of products + search box      |
| `/products/create`   | Create product  | Form to add a new product          |
| `/products/:id`      | Product details | View a single product              |
| `/products/edit/:id` | Edit product    | Form to update an existing product |
| `*`                  | 404             | Not Found fallback                 |

---

## Project structure

```text
react-basics/
├── db.json                      # Mock database (json-server)
├── index.html                   # Vite HTML entry
├── vite.config.ts               # Vite + React + Tailwind config
├── eslint.config.js
├── tsconfig*.json               # TypeScript configs
└── src/
    ├── main.tsx                 # App entry / React root
    ├── App.tsx                  # Router and route definitions
    ├── index.css                # Global styles (Tailwind)
    ├── components/
    │   ├── Navbar.tsx           # Top navigation
    │   ├── ProductCard.tsx      # Product tile (list view)
    │   ├── ProductForm.tsx      # Shared create/edit form
    │   └── Spinner.tsx          # Loading indicator
    ├── pages/
    │   ├── ProductListPage.tsx
    │   ├── ProductCreatePage.tsx
    │   ├── ProductEditPage.tsx
    │   └── ProductDetailPage.tsx
    ├── services/
    │   └── product.service.ts   # Axios API calls
    └── types/
        └── product.types.ts     # Product / ProductFormData types
```

---

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite 7](https://vite.dev/) — dev server & build tool
- [Tailwind CSS v4](https://tailwindcss.com/) — styling
- [React Router v7](https://reactrouter.com/) — client-side routing
- [Axios](https://axios-http.com/) — HTTP client
- [React Icons](https://react-icons.github.io/react-icons/) — icons
- [json-server](https://github.com/typicode/json-server) — mock REST API

---

## Troubleshooting

| Problem                                  | Fix                                                                                            |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `npm error Missing script: "dev"`        | You're in the repo root. Run `cd react-basics` first.                                          |
| Page shows **"Failed to load products"** | The mock API isn't running. Start it with `npm run server` in a terminal.                      |
| Port 3001 already in use                 | Stop the other process, or change the port in the `server` script and in `product.service.ts`. |
| Port 5173 already in use                 | Vite will pick the next free port — use the URL it prints.                                     |
| Changes to `db.json` not reflected       | Make sure `npm run server` is running (it watches the file).                                   |
