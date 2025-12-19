import { useState, useEffect } from "react";
import adminApi from "../../../services/adminApi";
import "./TenantsPage.css";

export default function TenantsPage() {
  const [tenants, setTenants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadTenants();
  }, []);

  const loadTenants = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await adminApi.get('/tenants');
      setTenants(response.data || []);
    } catch (err) {
      console.error("Failed to load tenants:", err);
      setError("Failed to load tenants");
      setTenants([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTenant = async (tenantId) => {
    if (!confirm("Are you sure you want to delete this tenant?")) {
      return;
    }

    try {
      await adminApi.delete(`/admin/tenants/${tenantId}`);
      setTenants(tenants.filter(t => t.id !== tenantId));
    } catch (err) {
      console.error("Failed to delete tenant:", err);
      alert("Failed to delete tenant");
    }
  };

  const filteredTenants = tenants.filter(tenant =>
    tenant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.id?.toString().includes(searchTerm)
  );

  if (isLoading) {
    return (
      <div className="tenants-loading">
        <div className="spinner"></div>
        <p>Loading tenants...</p>
      </div>
    );
  }

  return (
    <div className="tenants-page">
      <div className="tenants-header">
        <div>
          <h1>Tenants</h1>
          <p>Manage all tenants in the system</p>
        </div>
      </div>

      {error && (
        <div className="tenants-error">
          {error}
        </div>
      )}

      <div className="tenants-controls">
        <div className="search-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search tenants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredTenants.length === 0 ? (
        <div className="tenants-empty">
          <p>{searchTerm ? "No tenants found matching your search" : "No tenants found"}</p>
        </div>
      ) : (
        <div className="tenants-table-container">
          <table className="tenants-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTenants.map((tenant) => (
                <tr key={tenant.id}>
                  <td>{tenant.id}</td>
                  <td>{tenant.name}</td>
                  <td>{tenant.email}</td>
                  <td>
                    <span className={`status-badge ${tenant.isActive ? 'active' : 'inactive'}`}>
                      {tenant.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{tenant.createdAt ? new Date(tenant.createdAt).toLocaleDateString() : '-'}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-edit" title="Edit">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        className="btn-delete"
                        title="Delete"
                        onClick={() => handleDeleteTenant(tenant.id)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
