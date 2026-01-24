import React from 'react';
import { TrendingUp, Users, CalendarCheck, DollarSign } from 'lucide-react';

const StatCard = ({ title, value, icon, color }) => (
    <div className="stat-card glass-panel animate-fade-in">
        <div className="stat-icon" style={{ backgroundColor: `${color}20`, color: color }}>
            {icon}
        </div>
        <div className="stat-info">
            <span className="stat-title">{title}</span>
            <h3 className="stat-value">{value}</h3>
        </div>
    </div>
);

const DashboardHome = () => {
    return (
        <div className="dashboard-home">
            <h1 className="page-title">Dashboard Overview</h1>

            <div className="stats-grid">
                <StatCard
                    title="Total Bookings"
                    value="12"
                    icon={<CalendarCheck size={24} />}
                    color="#3B82F6"
                />
                <StatCard
                    title="Active Orders"
                    value="5"
                    icon={<TrendingUp size={24} />}
                    color="#F59E0B"
                />
                <StatCard
                    title="New Customers"
                    value="8"
                    icon={<Users size={24} />}
                    color="#8B5CF6"
                />
                <StatCard
                    title="Revenue (Today)"
                    value="₹3,200"
                    icon={<DollarSign size={24} />}
                    color="#10B981"
                />
            </div>

            <div className="recent-activity glass-panel animate-fade-in" style={{ marginTop: '40px', padding: '24px' }}>
                <h3>Recent Activity</h3>
                <p className="text-muted">System integration active. Connect real-time listeners for live feed.</p>
            </div>

            <style jsx="true">{`
        .dashboard-home {
          padding-top: 20px;
        }

        .page-title {
          margin-bottom: 30px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
        }

        .stat-card {
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 20px;
          background: white;
        }

        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-title {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--text-dark);
        }
      `}</style>
        </div>
    );
};

export default DashboardHome;
