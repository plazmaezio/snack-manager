import "./App.css";
import Home from "./features/menu/pages/Home";
import Login from "./features/auth/pages/Login";
import CreateAccount from "./features/auth/pages/CreateAccount";
import CartPreview from "./features/cart/pages/CartPreview";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "./features/errors/pages/NotFound";
import ManageInventory from "./features/inventory/pages/ManageInventory";
import NavBar from "./features/layout/components/NavBar";
import ProtectedRoute from "./features/auth/components/ProtectedRoute";
import RoleRoute from "./features/auth/components/RoleRoute";

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
            <Route path="/cart" element={<CartPreview />} />
            <Route
              path="/create-account"
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
          </Route>
        </Routes>
      </main>
    </Router>
  );
};

export default App;
