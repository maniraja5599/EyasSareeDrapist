import { useState } from 'react'; // Ensure useState is imported
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../hooks/useNotifications';
import { LayoutDashboard, ShoppingBag, Users, CreditCard, Settings, LogOut, Trash2, Briefcase, BarChart2, Bell, AlertCircle, CheckCircle } from 'lucide-react';

const AdminLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const { notifications, unreadCount } = useNotifications();
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: BarChart2, label: 'Reports', path: '/admin/reports' },
        { icon: ShoppingBag, label: 'Orders', path: '/admin/orders' },
        { icon: Users, label: 'Customers', path: '/admin/customers' },
        { icon: Briefcase, label: 'Partners', path: '/admin/partners' },
        { icon: CreditCard, label: 'Payments', path: '/admin/payments' },
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
        { icon: Trash2, label: 'Recycle Bin', path: '/admin/recycle-bin' },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/admin/login');
    };

    return (
        <div className="min-h-screen bg-cream-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gradient-to-b from-secondary-900 to-secondary-800 text-white fixed h-screen z-10 transition-all duration-300 flex flex-col">
                <div className="p-6 flex-1">
                    <div className="flex items-center gap-3 mb-8">
                        <img src={`${import.meta.env.BASE_URL}images/logo.png`} alt="Eyas Admin" className="w-12 h-12 rounded-2xl bg-white/10 p-1 shadow-lg" />
                        <div>
                            <h2 className="font-serif font-bold text-xl tracking-wide">Eyas Admin</h2>
                            <p className="text-xs text-gray-400 truncate max-w-[150px]">{user?.username || 'Admin'}</p>
                        </div>
                    </div>

                    {/* Notification Bell (Mobile/Sidebar Integrated) */}
                    <div className="mb-6 relative">
                        <button
                            onClick={() => setIsNotifOpen(!isNotifOpen)}
                            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5"
                        >
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Bell className="w-5 h-5 text-gray-300" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border border-secondary-900"></span>
                                    )}
                                </div>
                                <span className="font-medium text-gray-300">Notifications</span>
                            </div>
                            {unreadCount > 0 && (
                                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount}</span>
                            )}
                        </button>

                        {/* Notification Dropdown */}
                        {isNotifOpen && (
                            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-50 text-gray-900 animate-slide-up origin-top">
                                {notifications.length > 0 ? (
                                    <div className="space-y-2">
                                        {notifications.map(notif => (
                                            <div
                                                key={notif.id}
                                                onClick={() => {
                                                    navigate(notif.link);
                                                    setIsNotifOpen(false);
                                                }}
                                                className={`p-3 rounded-lg cursor-pointer hover:bg-gray-50 border-l-4 ${notif.type === 'critical' ? 'border-red-500 bg-red-50/50' :
                                                    notif.type === 'warning' ? 'border-yellow-500 bg-yellow-50/50' :
                                                        'border-blue-500'
                                                    }`}
                                            >
                                                <h4 className={`text-xs font-bold uppercase mb-1 ${notif.type === 'critical' ? 'text-red-700' :
                                                    notif.type === 'warning' ? 'text-yellow-700' : 'text-gray-700'
                                                    }`}>
                                                    {notif.title}
                                                </h4>
                                                <p className="text-xs text-gray-600 leading-snug">{notif.message}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 text-center text-xs text-gray-500">
                                        <CheckCircle className="w-8 h-8 text-green-100 mx-auto mb-2" />
                                        No new notifications
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <nav className="space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <button
                                    key={item.path}
                                    onClick={() => navigate(item.path)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                        ? 'bg-primary-500 text-white shadow-md'
                                        : 'hover:bg-white/10 text-gray-300 hover:text-white'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium">{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/20 transition-all duration-200 text-red-300 hover:text-red-200"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside >

            {/* Main Content */}
            < main className="ml-64 flex-1 p-8 overflow-y-auto" >
                {children}
            </main >
        </div >
    );
};

export default AdminLayout;
