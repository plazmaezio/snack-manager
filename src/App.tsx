import "./App.css";
import Home from "./features/daily-menu/Home";
import DishDetail from "./features/menu/pages/DishDetail";
import Login from "./features/auth/pages/Login";
import CreateAccount from "./features/auth/pages/CreateAccount";
import CartPreview from "./features/cart/pages/CartPreview";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "./features/errors/pages/NotFound";
import ManageInventory from "./features/inventory/pages/ManageInventory";
import ManageUsers from "./features/users/pages/ManageUsers";
import MyPurchases from "./features/users/pages/MyPurchases";
import NavBar from "./features/layout/components/NavBar";
import ProtectedRoute from "./features/auth/components/ProtectedRoute";
import RoleRoute from "./features/auth/components/RoleRoute";
import EditProfile from "./features/users/pages/EditProfile";

const App = () => {
  return (
    <Router>
      <NavBar />
      <main>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/menu/:dishId" element={<DishDetail />} />
            <Route path="/cart" element={<CartPreview />} />
            <Route
              path="/manage-users/create-account"
              element={
                <RoleRoute allowedRoles={["ADMIN"]}>
                  <CreateAccount />
                </RoleRoute>
              }
            />
            <Route
              path="/manage-inventory/:section?"
              element={
                <RoleRoute allowedRoles={["ADMIN", "EMPLOYEE"]}>
                  <ManageInventory />
                </RoleRoute>
              }
            />
            
            <Route
              path="/manage-users"
              element={
                <RoleRoute allowedRoles={["ADMIN"]}>
                  <ManageUsers />
                </RoleRoute>
              }
            />
            <Route
              path="/manage-users/users"
              element={
                <RoleRoute allowedRoles={["ADMIN"]}>
                  <ManageUsers />
                </RoleRoute>
              }
            />
            <Route
              path="/manage-users/purchases"
              element={
                <RoleRoute allowedRoles={["ADMIN"]}>
                  <ManageUsers />
                </RoleRoute>
              }
            />
            <Route
              path="/manage-users/purchases/:clientId"
              element={
                <RoleRoute allowedRoles={["ADMIN"]}>
                  <ManageUsers />
                </RoleRoute>
              }
            />
            <Route
              path="/edit-profile"
              element={
                <RoleRoute allowedRoles={["CLIENT"]}>
                  <EditProfile />
                </RoleRoute>
              }
            />
            <Route
              path="/my-purchases"
              element={
                <RoleRoute allowedRoles={["CLIENT"]}>
                  <MyPurchases />
                </RoleRoute>
              }
            />
          </Route>
        </Routes>
      </main>
    </Router>
  );
};

export default App;
