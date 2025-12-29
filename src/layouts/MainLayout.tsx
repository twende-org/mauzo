import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function MainLayout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <div className="min-h-screen bg-slate-50 font-sans antialiased flex flex-col">
            {/* Header / Navbar */}
            <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        {/* Logo Area */}
                        <Link to="/" className="text-xl md:text-2xl font-bold flex items-center gap-2">
                            <span className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white text-sm font-black shadow-sm shrink-0">
                                MK
                            </span>
                            <span className="tracking-tight text-gray-800 truncate">
                                Mauzo<span className="text-primary font-extrabold">Kidijitali</span>
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        {!isAuthPage && (
                            <div className="hidden md:flex items-center gap-4">
                               
                                <Button variant="secondary" onClick={() => navigate('/login')}>
                                    Ingia
                                </Button>
                               
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        {!isAuthPage && (
                            <div className="md:hidden flex items-center">
                                <button 
                                    onClick={toggleMenu}
                                    className="text-gray-600 hover:text-primary focus:outline-none p-2"
                                >
                                    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        {isMenuOpen ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                        )}
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Navigation Dropdown */}
                {isMenuOpen && !isAuthPage && (
                    <div className="md:hidden bg-white border-b border-gray-100 animate-slide-down">
                        <div className="px-4 pt-2 pb-6 space-y-3 shadow-inner">
                            {/* <Link 
                                to="/" 
                                className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Nyumbani
                            </Link> */}
                            <div className="grid grid-cols-1 gap-2 pt-2">
                                <Button variant="secondary" onClick={() => { navigate('/login'); setIsMenuOpen(false); }}>
                                    Ingia
                                </Button>
                              
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-8 text-center px-4">
                <p className="text-sm text-gray-500 font-medium">
                    &copy; 2025 MauzoKidijitali. Haki zote zimehifadhiwa.
                </p>
            </footer>
        </div>
    );
}
