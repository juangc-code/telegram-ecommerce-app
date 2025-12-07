import { BrowserRouter, Routes, Route } from "react-router-dom";
import CatalogPage from "../pages/catalog/CatalogPage";
import ProductPage from "../pages/product/ProductPage";
import CheckoutPage from "../pages/checkout/CheckoutPage";
import PaymentStatusPage from "../pages/payment/PaymentStatusPage";
import LoginPage from "../pages/login/LoginPage";
import ProtectedRoute from "../components/ProtectedRoute";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <CatalogPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProtectedRoute>
              <ProductPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/status"
          element={
            <ProtectedRoute>
              <PaymentStatusPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}