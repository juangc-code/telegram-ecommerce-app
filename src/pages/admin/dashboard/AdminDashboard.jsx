import { useState, useEffect } from "react";
import adminApi from "../../../services/adminApi";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalTenants: 0,
    totalUsers: 0,
    activeTenants: 0,
    activeUsers: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await adminApi.get('/admin/stats');
      if (response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error("Failed to load stats:", err);
      setError("Failed to load dashboard statistics");
      // Set default values on error
      setStats({
        totalTenants: 0,
        totalUsers: 0,
        activeTenants: 0,
        activeUsers: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="admin-dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Overview of your platform</p>
      </div>

      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon tenants">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalTenants}</div>
            <div className="stat-label">Total Tenants</div>
            <div className="stat-detail">{stats.activeTenants} active</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon users">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalUsers}</div>
            <div className="stat-label">Total Users</div>
            <div className="stat-detail">{stats.activeUsers} active</div>
          </div>
        </div>
      </div>

      <div className="dashboard-quick-actions">
        <h2>Quick Actions</h2>
        <div className="quick-actions-grid">
          <a href="/admin/tenants" className="quick-action-card">
            <div className="quick-action-title">Manage Tenants</div>
            <div className="quick-action-desc">View and manage all tenants</div>
          </a>
          <a href="/admin/users" className="quick-action-card">
            <div className="quick-action-title">Manage Users</div>
            <div className="quick-action-desc">View and manage all users</div>
          </a>
        </div>
      </div>
    </div>
  );
}
