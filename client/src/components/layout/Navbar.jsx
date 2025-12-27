import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Services', href: '#services' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  const handleNavClick = (e, href) => {
    if (isAdminPage) {
      e.preventDefault();
      window.location.href = '/' + href;
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
              Sample App
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {!isAdminPage && navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="nav-link"
                onClick={(e) => handleNavClick(e, link.href)}
              >
                {link.name}
              </a>
            ))}
            {isAdminPage && (
              <Link to="/" className="nav-link">
                Back to Home
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-500 focus:outline-none"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-3">
              {!isAdminPage && navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="nav-link px-3 py-2 rounded-md hover:bg-gray-100"
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  {link.name}
                </a>
              ))}
              {isAdminPage && (
                <Link
                  to="/"
                  className="nav-link px-3 py-2 rounded-md hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Back to Home
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
