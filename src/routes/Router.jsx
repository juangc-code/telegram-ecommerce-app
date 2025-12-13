import { BrowserRouter, Routes, Route } from "react-router-dom";
import CatalogPage from "../pages/catalog/CatalogPage";
import ProductPage from "../pages/product/ProductPage";
import CheckoutPage from "../pages/checkout/CheckoutPage";
import PaymentStatusPage from "../pages/payment/PaymentStatusPage";
import LoginPage from "../pages/login/LoginPage";
import StoreLandingPage from "../pages/landing/StoreLandingPage";
import ProductManagementPage from "../pages/product-management/ProductManagementPage";
import ProtectedRoute from "../components/ProtectedRoute";
import { StoreProvider } from "../context/StoreProvider";
import { ProductProvider } from "../context/ProductProvider";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Store-specific routes with dynamic slug */}
        <Route path="/:storeSlug" element={<StoreProvider><StoreLandingPage /></StoreProvider>} />
        <Route
          path="/:storeSlug/catalog"
          element={
            <StoreProvider>
              <ProductProvider>
                <ProtectedRoute>
                  <CatalogPage />
                </ProtectedRoute>
              </ProductProvider>
            </StoreProvider>
          }
        />
        <Route
          path="/:storeSlug/manage-products"
          element={
            <StoreProvider>
              <ProtectedRoute>
                <ProductManagementPage />
              </ProtectedRoute>
            </StoreProvider>
          }
        />
        <Route
          path="/:storeSlug/product/:id"
          element={
            <StoreProvider>
              <ProtectedRoute>
                <ProductPage />
              </ProtectedRoute>
            </StoreProvider>
          }
        />
        <Route
          path="/:storeSlug/checkout"
          element={
            <StoreProvider>
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            </StoreProvider>
          }
        />
        <Route
          path="/:storeSlug/status"
          element={
            <StoreProvider>
              <ProtectedRoute>
                <PaymentStatusPage />
              </ProtectedRoute>
            </StoreProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}