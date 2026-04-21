import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import ManageInventory from "./pages/ManageInventory";
import NavBar from "./components/NavBar";
import RoleRoute from "./components/RoleRoute";
import ProtectedRoute from "./components/ProtectedRoute";

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
                // this one should be admin + epmploee route
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
