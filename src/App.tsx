import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import ManageInventory from "./pages/ManageInventory";
import NavBar from "./Components/NavBar";
import AdminRoute from "./Components/AdminRoute";
import ProtectedRoute from "./Components/ProtectedRoute";

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
                <AdminRoute>
                  <CreateAccount />
                </AdminRoute>
              }
            />
            <Route
              path="/manage-inventory/:section?"
              element={
                <AdminRoute>
                  <ManageInventory />
                </AdminRoute>
              }
            />
          </Route>
        </Routes>
      </main>
    </Router>
  );
};

export default App;
