import { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreProvider';
import { ProductService } from '../../services';
import ProductForm from '../../components/ProductForm';
import UserMenu from '../../components/UserMenu';
import './ProductManagementPage.css';

export default function ProductManagementPage() {
  const { store } = useStore();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    if (store?.data?.id) {
      fetchProducts();
    }
  }, [store?.data?.id]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setAccessDenied(false);
      const response = await ProductService.getProductsByStoreId(store.data.id, 0, 100);
      setProducts(response?.data?.content || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      if (err.response?.status === 403) {
        setAccessDenied(true);
        setError(null);
      } else {
        setError('Failed to load products');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await ProductService.deleteProduct(productId);
      await fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      if (err.response?.status === 403) {
        alert('Access Denied: You don\'t have permission to delete products');
      } else {
        alert('Failed to delete product');
      }
    }
  };

  const handleSubmit = async (productData) => {
    try {
      if (editingProduct) {
        await ProductService.updateProduct(editingProduct.id, productData);
      } else {
        await ProductService.createProduct(productData);
      }

      setShowForm(false);
      setEditingProduct(null);
      await fetchProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      if (err.response?.status === 403) {
        alert('Access Denied: You don\'t have permission to manage products');
      } else {
        alert('Failed to save product');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  if (isLoading) {
    return (
      <>
        <UserMenu />
        <div className="page-container">
          <div className="page-card">
            <p>Loading products...</p>
          </div>
        </div>
      </>
    );
  }

  if (accessDenied) {
    return (
      <>
        <UserMenu />
        <div className="page-container">
          <div className="access-denied-container">
            <div className="access-denied-content">
              <h1>Access Denied</h1>
              <p>You don't have permission to access this page.</p>
              <p className="access-denied-hint">Only store owners can manage products.</p>
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
          <div className="page-card">
            <p className="error-message">{error}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <UserMenu />
      <div className="page-container">
        <div className="product-management">
          <div className="management-header">
            <h1>Product Management</h1>
            <button className="btn-create" onClick={handleCreate}>
              + Create Product
            </button>
          </div>

          {showForm ? (
            <ProductForm
              product={editingProduct}
              storeId={store?.data?.id}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          ) : (
            <div className="products-table-container">
              {products.length === 0 ? (
                <div className="empty-state">
                  <p>No products found. Create your first product to get started.</p>
                </div>
              ) : (
                <table className="products-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>SKU</th>
                      <th>Type</th>
                      <th>Price</th>
                      <th>Inventory</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <div className="product-name">
                            {product.imageUrl && (
                              <img src={product.imageUrl} alt={product.name} className="product-thumbnail" />
                            )}
                            <span>{product.name}</span>
                          </div>
                        </td>
                        <td>{product.sku || '-'}</td>
                        <td>
                          <span className="product-type">{product.productType}</span>
                        </td>
                        <td>
                          {product.price ? `${product.currencyCode || ''} ${parseFloat(product.price).toFixed(2)}`.trim() : '-'}
                        </td>
                        <td>{product.inventoryCount ?? '-'}</td>
                        <td>
                          <span className={`status-badge ${product.isActive ? 'active' : 'inactive'}`}>
                            {product.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-edit"
                              onClick={() => handleEdit(product)}
                              title="Edit"
                            >
                              Edit
                            </button>
                            <button
                              className="btn-delete"
                              onClick={() => handleDelete(product.id)}
                              title="Delete"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
