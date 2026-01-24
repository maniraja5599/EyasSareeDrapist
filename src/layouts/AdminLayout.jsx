import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Settings, LogOut } from 'lucide-react';

const AdminLayout = () => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="admin-container">
            <aside className="sidebar glass-panel">
                <div className="sidebar-header">
                    <h2>EYAS <span style={{ color: 'var(--primary-gold)' }}>ADMIN</span></h2>
                </div>

                <nav className="sidebar-nav">
                    <Link to="/admin" className={`nav-item ${isActive('/admin') ? 'active' : ''}`}>
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>
                    <Link to="/admin/orders" className={`nav-item ${isActive('/admin/orders') ? 'active' : ''}`}>
                        <ShoppingBag size={20} />
                        <span>Orders</span>
                    </Link>
                    <Link to="/admin/settings" className={`nav-item ${isActive('/admin/settings') ? 'active' : ''}`}>
                        <Settings size={20} />
                        <span>Settings</span>
                    </Link>
                </nav>

                <div className="sidebar-footer">
                    <button className="logout-btn">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <main className="admin-content">
                <Outlet />
            </main>

            <style jsx="true">{`
        .admin-container {
          display: flex;
          min-height: 100vh;
          background-color: #F5F5F5;
          padding-top: 80px; /* Offset for main navbar if visible, or remove main navbar on admin routes */
        }

        .sidebar {
          width: 260px;
          margin: 20px;
          height: calc(100vh - 120px);
          position: fixed;
          display: flex;
          flex-direction: column;
          padding: 24px;
        }

        .sidebar-header {
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex-grow: 1;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          color: var(--text-muted);
          text-decoration: none;
          transition: all 0.2s;
          font-weight: 500;
        }

        .nav-item:hover, .nav-item.active {
          background-color: var(--primary-gold);
          color: white;
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
        }

        .admin-content {
          margin-left: 300px; /* Sidebar width + gap */
          flex-grow: 1;
          padding: 20px;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px;
          border: none;
          background: none;
          color: var(--text-muted);
          cursor: pointer;
          font-weight: 500;
        }
        
        .logout-btn:hover {
           color: var(--secondary-velvet);
        }
      `}</style>
        </div>
    );
};

export default AdminLayout;
