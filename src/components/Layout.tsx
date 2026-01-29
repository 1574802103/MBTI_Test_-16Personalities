import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Home, Menu, User, X } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-blue-200 transition-all duration-300 transform group-hover:scale-105">
              M
            </div>
            <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 uppercase tracking-wider">MBTI Master</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/" icon={Home} label="首页" isActive={location.pathname === '/'} />
            <NavLink to="/types" icon={BookOpen} label="性格库" isActive={location.pathname === '/types'} />
            <NavLink to="/profile" icon={User} label="我的" isActive={location.pathname === '/profile'} />
          </nav>

          <div className="flex items-center md:hidden">
            <button
              type="button"
              aria-label={mobileOpen ? '关闭菜单' : '打开菜单'}
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl hover:bg-gray-50/50 text-gray-700 transition-colors"
              onClick={() => setMobileOpen(v => !v)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100/70">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
              <div className="flex flex-col gap-2">
                <MobileNavLink to="/" icon={Home} label="首页" isActive={location.pathname === '/'} onClick={() => setMobileOpen(false)} />
                <MobileNavLink to="/types" icon={BookOpen} label="性格库" isActive={location.pathname === '/types'} onClick={() => setMobileOpen(false)} />
                <MobileNavLink to="/profile" icon={User} label="我的" isActive={location.pathname === '/profile'} onClick={() => setMobileOpen(false)} />
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      <footer className="glass-panel border-t border-gray-100 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <span className="text-lg font-bold text-gray-900">MBTI Master</span>
              <p className="text-sm text-gray-500 mt-1">探索真实的自己，发现潜能</p>
            </div>
            <div className="flex space-x-6 text-sm text-gray-500">
              <Link to="/about" className="hover:text-blue-600 transition-colors">关于MBTI</Link>
              <Link to="/types" className="hover:text-blue-600 transition-colors">性格类型</Link>
              <a href="#" className="hover:text-blue-600 transition-colors">隐私政策</a>
            </div>
          </div>
          <div className="mt-8 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} MBTI Master. Based on Jungian Psychology.
          </div>
        </div>
      </footer>
    </div>
  );
};

const NavLink = ({ to, icon: Icon, label, isActive }: { to: string, icon: React.ElementType, label: string, isActive: boolean }) => (
  <Link 
    to={to} 
    className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg transition-all duration-200 ${
      isActive 
        ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm' 
        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50/50'
    }`}
  >
    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
    <span>{label}</span>
  </Link>
);

const MobileNavLink = ({ to, icon: Icon, label, isActive, onClick }: { to: string, icon: React.ElementType, label: string, isActive: boolean, onClick: () => void }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
      isActive 
        ? 'bg-blue-50 text-blue-600 font-bold shadow-sm' 
        : 'text-gray-600 hover:bg-gray-50'
    }`}
  >
    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
    <span className="text-lg">{label}</span>
  </Link>
);
