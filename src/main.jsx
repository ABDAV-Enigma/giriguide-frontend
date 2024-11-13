import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { NextUIProvider } from "@nextui-org/system";
import Login from "./pages/auth/Login.jsx";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import Mountain from "./pages/mountain/Mountain";
import TourGuide from "./pages/tour-guide/TourGuide.jsx";
import SideBar from "./components/SideBar.jsx";
import SecureLink from "./HOC/SecureLink.jsx";
import HikingPoint from "./pages/hikingPoint/HikingPoint.jsx";
import Transaction from "./pages/transaction/Transaction.jsx";
import Widraw from "./pages/widraw/Widraw.jsx";
import Route from "./pages/rute/Route.jsx";
import AdminDashboard from "./pages/Dashboard.jsx";
import NotFound from "./pages/NotFound.jsx";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/login", element: <Login /> },
  {
    path: "/dashboard",
    element: (
      <SecureLink>
        <SideBar active="/dashboard">
          <AdminDashboard />
        </SideBar>
      </SecureLink>
    ),
  },
  {
    path: "/mountain",
    element: (
      <SecureLink>
        <SideBar active="/mountain">
          <Mountain />
        </SideBar>
      </SecureLink>
    ),
  },
  {
    path: "/tour-guide",
    element: (
      <SecureLink>
        <SideBar active="/tour-guide">
          <TourGuide />
        </SideBar>
      </SecureLink>
    ),
  },
  {
    path: "/hiking-point",
    element: (
      <SecureLink>
        <SideBar active="/hiking-point">
          <HikingPoint />
        </SideBar>
      </SecureLink>
    ),
  },
  {
    path: "/transaction",
    element: (
      <SecureLink>
        <SideBar active="/hiking-point">
          <Transaction />
        </SideBar>
      </SecureLink>
    ),
  },
  {
    path: "/withdraw",
    element: (
      <SecureLink>
        <SideBar active="/withdraw">
          <Widraw />
        </SideBar>
      </SecureLink>
    ),
  },
  {
    path: "/route",
    element: (
      <SecureLink>
        <SideBar active="/route">
          <Route />
        </SideBar>
      </SecureLink>
    ),
  },
  { path: "*", element: <NotFound /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <NextUIProvider>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </NextUIProvider>
  </StrictMode>
);
