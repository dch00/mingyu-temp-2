import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./layout/layout";
import Index from "./routes/_index";
import Profile from "./routes/profile";
import Sessions from "./routes/sessions";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Index /> },
      {
        path: "/profile/:user_id",
        element: <Profile />
      },
      { path: "/sessions", element: <Sessions /> }
    ]
  }
]);

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
