import { useState } from 'react'; // Ensure useState is imported
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../hooks/useNotifications';
import { LayoutDashboard, ShoppingBag, Users, CreditCard, Settings, LogOut, Trash2, Briefcase, BarChart2, Bell, AlertCircle, CheckCircle, Menu } from 'lucide-react';

const AdminLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const { notifications, unreadCount } = useNotifications();
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar state

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
            {/* Mobile Sidebar Backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden glass-backdrop"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`w-64 bg-gradient-to-b from-secondary-900 to-secondary-800 text-white fixed h-screen z-30 transition-transform duration-300 shadow-2xl ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                }`}>
                <div className="p-6 flex-1">
                    <div className="flex items-center gap-3 mb-8">
                        <img src={`${import.meta.env.BASE_URL}images/logo.png`} alt="Eyas Admin" className="w-10 h-10 rounded-2xl bg-white/10 p-1 shadow-lg" />
                        <div>
                            <h2 className="font-serif font-bold text-lg tracking-wide">Eyas Admin</h2>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <button
                                    key={item.path}
                                    onClick={() => navigate(item.path)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-900/20'
                                        : 'hover:bg-white/5 text-gray-400 hover:text-white'
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                                    <span className="font-medium">{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>

                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/20 transition-all duration-200 text-red-300 hover:text-red-200"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside >

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col min-h-screen md:ml-64 transition-all duration-300">
                {/* Top Header */}
                <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-20 px-4 md:px-8 py-4 flex justify-between items-center shadow-sm">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-xl md:text-2xl font-serif font-bold text-secondary-900">
                                {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
                            </h1>
                            <p className="hidden md:block text-sm text-gray-500">Welcome back, {user?.username || 'Admin'}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Notification Bell */}
                        <div className="relative">
                            <button
                                onClick={() => setIsNotifOpen(!isNotifOpen)}
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
                            >
                                <Bell className="w-6 h-6 text-gray-600" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                                )}
                            </button>

                            {/* Notification Dropdown */}
                            {isNotifOpen && (
                                <div className="absolute right-0 top-full mt-4 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 text-gray-900 animate-slide-up origin-top-right transform">
                                    <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 mb-2">
                                        <h3 className="font-bold text-sm text-gray-700">Notifications</h3>
                                        {unreadCount > 0 && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">{unreadCount} New</span>}
                                    </div>

                                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                        {notifications.length > 0 ? (
                                            <div className="space-y-1">
                                                {notifications.map(notif => (
                                                    <div
                                                        key={notif.id}
                                                        onClick={() => {
                                                            navigate(notif.link);
                                                            setIsNotifOpen(false);
                                                        }}
                                                        className={`p-3 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors border-l-4 mx-1 ${notif.type === 'critical' ? 'border-red-500 bg-red-50/30' :
                                                            notif.type === 'warning' ? 'border-yellow-500 bg-yellow-50/30' :
                                                                'border-blue-500'
                                                            }`}
                                                    >
                                                        <h4 className={`text-xs font-bold uppercase mb-1 ${notif.type === 'critical' ? 'text-red-700' :
                                                            notif.type === 'warning' ? 'text-yellow-700' : 'text-gray-700'
                                                            }`}>
                                                            {notif.title}
                                                        </h4>
                                                        <p className="text-sm text-gray-600 leading-snug">{notif.message}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-8 text-center">
                                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                                </div>
                                                <p className="text-sm text-gray-500 font-medium">No new notifications</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {isNotifOpen && (
                                <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsNotifOpen(false)} />
                            )}
                        </div>

                        <div className="h-8 w-px bg-gray-200"></div>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-secondary-900 text-white flex items-center justify-center font-bold font-serif shadow-md">
                                {user?.username?.[0]?.toUpperCase() || 'A'}
                            </div>
                        </div>
                    </div>
                </header >

                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div >
        </div >
    );
};

export default AdminLayout;
