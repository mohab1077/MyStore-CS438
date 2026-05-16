import { createBrowserRouter } from "react-router-dom";
import Home from "../layouts/Home";
import TraderLayout from "../layouts/TraderLayout";
import ProductPage from "../pages/trader/ProductPage";
import CreateShopPage from "../pages/trader/CreateShopPage";
import SelectShopPage from "../pages/trader/SelectShopPage";
import { StoreProtectedRoute } from "./ProtectedRoutes/StoreProtectedRoute";
import { ProtectedRoute } from "./ProtectedRoutes/ProtectedRoute";



export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/choose",
        element: <SelectShopPage />,
      },
      {
        path: "/create",
        element: <CreateShopPage />,
      },
    ],
  },

  {
    element: <StoreProtectedRoute />,
    children: [
      {
        path: "/user",
        element: <TraderLayout />,
        children: [
          { path: "products", element: <ProductPage /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <h1>404 - Page Not Found</h1>,
  },
]);