import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Truck, Shield, Menu, X, Snowflake } from 'lucide-react';

const navLinks = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Vehicles', path: '/vehicles', icon: Truck },
  { name: 'Admin', path: '/admin', icon: Shield },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="bg-dark-900/80 backdrop-blur-xl border-b border-dark-800/50 sticky top-0 z-50">
      <div className="max-w-full mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center shadow-neon-cyan group-hover:shadow-neon transition-shadow duration-300">
              <Snowflake size={16} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold bg-gradient-to-r from-primary-400 via-cyan-400 to-primary-400 bg-clip-text text-transparent leading-tight">
                ColdChain
              </span>
              <span className="text-[9px] text-dark-500 font-medium uppercase tracking-widest leading-tight">
                Command Center
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`
                    flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${isActive
                      ? 'bg-primary-600/15 text-primary-400 border border-primary-500/20'
                      : 'text-dark-400 hover:text-dark-200 hover:bg-dark-800/60'
                    }
                  `}
                >
                  <link.icon size={15} />
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-dark-400 hover:text-dark-200 hover:bg-dark-800/60 transition-colors"
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-3 animate-fade-in">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`
                      flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium
                      transition-all duration-200
                      ${isActive
                        ? 'bg-primary-600/15 text-primary-400 border border-primary-500/20'
                        : 'text-dark-400 hover:text-dark-200 hover:bg-dark-800/60'
                      }
                    `}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <link.icon size={16} />
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
