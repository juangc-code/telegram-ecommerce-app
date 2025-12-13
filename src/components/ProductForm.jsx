import { useState, useEffect } from 'react';
import './ProductForm.css';

const PRODUCT_TYPES = [
  { value: 'FIXED_PRICE', label: 'Fixed price' },
  { value: 'CONTENT', label: 'Contenido' },
  { value: 'SERVICE', label: 'Service' },
  { value: 'VARIABLE_PRICE', label: 'Variable price' }
];

export default function ProductForm({ product, storeId, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    storeId: storeId || '',
    categoryId: '',
    name: '',
    sku: '',
    description: '',
    productType: 'VARIABLE_PRICE',
    price: '',
    minPrice: '',
    suggestedPrice: '',
    currencyCode: '',
    isDigital: false,
    inventoryCount: '',
    requiresShipping: false,
    imageUrl: '',
    additionalImages: '',
    metadata: '',
    isActive: true
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        storeId: product.storeId || storeId,
        categoryId: product.categoryId || '',
        name: product.name || '',
        sku: product.sku || '',
        description: product.description || '',
        productType: product.productType || 'VARIABLE_PRICE',
        price: product.price || '',
        minPrice: product.minPrice || '',
        suggestedPrice: product.suggestedPrice || '',
        currencyCode: product.currencyCode || '',
        isDigital: product.isDigital || false,
        inventoryCount: product.inventoryCount || '',
        requiresShipping: product.requiresShipping !== undefined ? product.requiresShipping : false,
        imageUrl: product.imageUrl || '',
        additionalImages: product.additionalImages ? product.additionalImages.join(', ') : '',
        metadata: product.metadata || '',
        isActive: product.isActive !== undefined ? product.isActive : true
      });
    }
  }, [product, storeId]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    } else if (formData.name.length > 200) {
      newErrors.name = 'Product name must not exceed 200 characters';
    }

    if (formData.sku && formData.sku.length > 100) {
      newErrors.sku = 'SKU must not exceed 100 characters';
    }

    if (formData.description && formData.description.length > 2000) {
      newErrors.description = 'Description must not exceed 2000 characters';
    }

    if (!formData.productType) {
      newErrors.productType = 'Product type is required';
    }

    // if (formData.productType !== 'PAY_WHAT_YOU_WANT' && (!formData.price || parseFloat(formData.price) <= 0)) {
    //   newErrors.price = 'Price must be greater than 0';
    // }

    if (!formData.currencyCode) {
      newErrors.currencyCode = 'Currency code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Auto-set isDigital based on productType
    if (name === 'productType') {
      if (value === 'DIGITAL') {
        setFormData(prev => ({ ...prev, isDigital: true, requiresShipping: false }));
      } else if (value === 'SERVICE') {
        setFormData(prev => ({ ...prev, requiresShipping: false }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload = {
      ...formData,
      storeId: parseInt(formData.storeId),
      categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
      price: formData.price ? parseFloat(formData.price) : null,
      minPrice: formData.minPrice ? parseFloat(formData.minPrice) : null,
      suggestedPrice: formData.suggestedPrice ? parseFloat(formData.suggestedPrice) : null,
      inventoryCount: formData.inventoryCount ? parseInt(formData.inventoryCount) : null,
      additionalImages: formData.additionalImages
        ? formData.additionalImages.split(',').map(url => url.trim()).filter(url => url)
        : null
    };

    onSubmit(payload);
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2>{product ? 'Edit Product' : 'Create New Product'}</h2>

      <div className="form-group">
        <label htmlFor="name">Product Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          maxLength={200}
          required
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="sku">SKU</label>
          <input
            type="text"
            id="sku"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            maxLength={100}
          />
          {errors.sku && <span className="error">{errors.sku}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="productType">Product Type *</label>
          <select
            id="productType"
            name="productType"
            value={formData.productType}
            onChange={handleChange}
            required
          >
            {PRODUCT_TYPES.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          {errors.productType && <span className="error">{errors.productType}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          maxLength={2000}
          rows={4}
        />
        {errors.description && <span className="error">{errors.description}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            min="0"
            required={false}
          />
          {errors.price && <span className="error">{errors.price}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="currencyCode">Currency *</label>
          <input
            type="text"
            id="currencyCode"
            name="currencyCode"
            value={formData.currencyCode}
            onChange={handleChange}
            maxLength={3}
            placeholder="ARS"
            required
          />
          {errors.currencyCode && <span className="error">{errors.currencyCode}</span>}
        </div>
      </div>

      {formData.productType === 'PAY_WHAT_YOU_WANT' && (
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="minPrice">Minimum Price</label>
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              value={formData.minPrice}
              onChange={handleChange}
              step="0.01"
              min="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="suggestedPrice">Suggested Price</label>
            <input
              type="number"
              id="suggestedPrice"
              name="suggestedPrice"
              value={formData.suggestedPrice}
              onChange={handleChange}
              step="0.01"
              min="0"
            />
          </div>
        </div>
      )}

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="inventoryCount">Inventory Count</label>
          <input
            type="number"
            id="inventoryCount"
            name="inventoryCount"
            value={formData.inventoryCount}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="categoryId">Category ID</label>
          <input
            type="number"
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="imageUrl">Image URL</label>
        <input
          type="url"
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="additionalImages">Additional Images (comma-separated URLs)</label>
        <input
          type="text"
          id="additionalImages"
          name="additionalImages"
          value={formData.additionalImages}
          onChange={handleChange}
          placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
        />
      </div>

      <div className="form-group">
        <label htmlFor="metadata">Metadata (JSON)</label>
        <textarea
          id="metadata"
          name="metadata"
          value={formData.metadata}
          onChange={handleChange}
          rows={3}
          placeholder='{"key": "value"}'
        />
      </div>

      <div className="form-checkboxes">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="isDigital"
            checked={formData.isDigital}
            onChange={handleChange}
          />
          Is Digital
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            name="requiresShipping"
            checked={formData.requiresShipping}
            onChange={handleChange}
          />
          Requires Shipping
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
          />
          Is Active
        </label>
      </div>

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          {product ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}
