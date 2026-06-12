import { createBrowserRouter } from "react-router-dom";
import Home from "../layouts/Home";
import TraderLayout from "../layouts/TraderLayout";
import ProductPage from "../pages/trader/ProductPage";
import CreateShopPage from "../pages/trader/CreateShopPage";
import SelectShopPage from "../pages/trader/SelectShopPage";
import { StoreProtectedRoute } from "./ProtectedRoutes/StoreProtectedRoute";
import { ProtectedRoute } from "./ProtectedRoutes/ProtectedRoute";
import ProductShowPage from "../pages/customer/ProductShowPage";
import OrdersPage from "../pages/trader/OrdersPage";
import ShopInfoPage from "../pages/trader/ShopInfoPage";
import EditUserInfoPage from "../pages/trader/TraderInfoPage";
import PasswordResetFlow from "../commponents/ForgetPass";



export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
    {
    path: "/forget",
    element: <PasswordResetFlow />
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
      {
        path: "/account",
        element: <EditUserInfoPage />,
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
          { path: "products", element: <ProductPage /> }, { path: "order", element: <OrdersPage /> },
          { path: "info", element: <ShopInfoPage /> }
        ],
      },
    ],
  },
  {
    path: "/shop/:websiteId",
    element: <ProductShowPage />,
  },
  {
    path: "*",
    element: <h1>404 - Page Not Found</h1>,
  },
]);