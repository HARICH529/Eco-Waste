import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Menu, X, Leaf } from 'lucide-react';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path) => location.pathname === path;

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-soft py-2' : 'bg-transparent py-4'}`}>
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-primary-100 p-2 rounded-lg group-hover:bg-primary-200 transition-colors">
                            <Leaf className="text-primary-600" size={24} />
                        </div>
                        <span className="text-2xl font-bold text-gray-800 tracking-tight">Eco<span className="text-primary-600">Waste</span></span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/"
                            className={`font-medium transition-colors ${isActive('/') ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'}`}
                        >
                            Home
                        </Link>
                        {user ? (
                            <>
                                {user.role === 'admin' ? (
                                    <Link
                                        to="/admin"
                                        className={`font-medium transition-colors ${isActive('/admin') ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'}`}
                                    >
                                        Admin Dashboard
                                    </Link>
                                ) : (
                                    <Link
                                        to="/dashboard"
                                        className={`font-medium transition-colors ${isActive('/dashboard') ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'}`}
                                    >
                                        Dashboard
                                    </Link>
                                )}
                                <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                                    <Link to="/profile" className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors">
                                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-sm">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-sm font-medium">{user.name}</span>
                                    </Link>
                                    <button
                                        onClick={() => {
                                            logout();
                                            navigate('/login');
                                        }}
                                        className="text-gray-500 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
                                        title="Logout"
                                    >
                                        <LogOut size={20} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">Login</Link>
                                <Link to="/register" className="btn-primary shadow-lg shadow-primary-500/30">Get Started</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-primary-600 focus:outline-none p-2">
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-100 py-4 px-4 flex flex-col space-y-4 animate-in slide-in-from-top-5">
                        <Link to="/" className="text-gray-600 hover:text-primary-600 font-medium py-2" onClick={() => setIsOpen(false)}>Home</Link>
                        {user ? (
                            <>
                                {user.role === 'admin' ? (
                                    <Link to="/admin" className="text-gray-600 hover:text-primary-600 font-medium py-2" onClick={() => setIsOpen(false)}>Admin Dashboard</Link>
                                ) : (
                                    <Link to="/dashboard" className="text-gray-600 hover:text-primary-600 font-medium py-2" onClick={() => setIsOpen(false)}>Dashboard</Link>
                                )}
                                <div className="border-t border-gray-100 pt-4 mt-2">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">{user.name}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => {
                                        logout();
                                        setIsOpen(false);
                                        navigate('/login');
                                    }} className="w-full btn-outline flex items-center justify-center gap-2">
                                        <LogOut size={18} /> Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col gap-3 border-t border-gray-100 pt-4">
                                <Link to="/login" className="btn-outline text-center" onClick={() => setIsOpen(false)}>Login</Link>
                                <Link to="/register" className="btn-primary text-center" onClick={() => setIsOpen(false)}>Register</Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav >
    );
};

export default Navbar;
