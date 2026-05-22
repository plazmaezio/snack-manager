import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./shared/contexts/ThemeContext.tsx";
import { AuthProvider } from "./features/auth/contexts/AuthContext.tsx";
import { CartProvider } from "./features/cart/contexts/CartContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
