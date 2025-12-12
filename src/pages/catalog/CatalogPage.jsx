import ProductCard from "../../components/ProductCard";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppProvider";
import { useStore } from "../../context/StoreProvider";
import { useProducts } from "../../context/ProductProvider";
import UserMenu from "../../components/UserMenu";
import "./CatalogPage.css";

export default function CatalogPage() {
  const navigate = useNavigate();
  const { setProduct } = useApp();
  const { storeSlug, store } = useStore();
  const { products, isLoading, error } = useProducts();

  const handleSelect = (p) => {
    setProduct(p);
    navigate(`/${storeSlug}/product/${p.id}`);
  };

  if (isLoading) {
    return (
      <>
        <UserMenu />
        <div className="page-container">
          <div className="page-card catalog-card">
            <div className="page-header">
              <h1 className="page-title">{store?.data?.name || 'Loading...'}</h1>
              <p className="page-subtitle">Loading products...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <UserMenu />
        <div className="page-container">
          <div className="page-card catalog-card">
            <div className="page-header">
              <h1 className="page-title">{store?.data?.name}</h1>
              <p className="page-subtitle error">Error: {error}</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <UserMenu />
      <div className="page-container">
        <div className="page-card catalog-card">
          <div className="page-header">
            <h1 className="page-title">{store?.data?.name || 'Catalog'}</h1>
            <p className="page-subtitle">Select a product or service</p>
          </div>

          <div className="products-list">
            {products.length === 0 ? (
              <p className="page-subtitle">No products available</p>
            ) : (
              products.map((p) => (
                <ProductCard key={p.id} product={p} onSelect={() => handleSelect(p)} />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}