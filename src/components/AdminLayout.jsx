import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminAuthService from "../services/AdminAuthService";
import "./AdminLayout.css";

export default function AdminLayout({ children }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = AdminAuthService.getStoredUser();

  const handleLogout = () => {
    AdminAuthService.logout();
    navigate("/admin/login");
  };

  const navItems = [
    { path: "/admin/dashboard", label: "Dashboard" },
    { path: "/admin/tenants", label: "Tenants" },
    { path: "/admin/users", label: "Users" },
  ];

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-brand">
            <h1>Admin Portal</h1>
          </div>

          <nav className="admin-nav">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`admin-nav-item ${location.pathname === item.path ? "active" : ""}`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="admin-user-menu">
            <button
              className="admin-user-button"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="admin-user-avatar">
                {user?.username?.charAt(0).toUpperCase() || "A"}
              </div>
              <span className="admin-user-name">{user?.username || "Admin"}</span>
            </button>

            {showUserMenu && (
              <div className="admin-user-dropdown">
                <div className="admin-user-info">
                  <div className="admin-user-info-name">{user?.username || "Admin"}</div>
                  <div className="admin-user-info-email">{user?.userId || user?.email || ""}</div>
                </div>
                <button className="admin-logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
}
