'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { siteConfig } from '@/content';

const navLinks = [
  { label: 'About',    href: '#about'    },
  { label: 'Projects',     href: '#projects' },
  { label: 'Academic', href: '#academics' },
  { label: "Experience", href: '#resume'},
  { label: 'Blog',     href: '#blog'     },
  { label: 'Contact',  href: '#contact'  },
  { label: 'Notes', href: '/pages/notes' },
];

export default function Navigation() {
  const [scrolled, setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted]     = useState(false);
  const { theme, setTheme }       = useTheme();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
  setMobileOpen(false);
  if (href.startsWith('/')) {
    window.location.href = href;
  } else {
    window.location.href = '/' + href;
  }
};

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[var(--bg)]/80 backdrop-blur-xl border-b border-[var(--border)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 group"
            aria-label="Back to top"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-200 group-hover:scale-105"
              style={{
                background: 'var(--accent)',
                color: '#000',
                fontFamily: 'var(--font-syne)',
              }}
            >
              {siteConfig.initials}
            </div>
            <span
              className="hidden sm:block text-sm font-medium"
              style={{ fontFamily: 'var(--font-syne)', color: 'var(--text)' }}
            >
              {siteConfig.name.split(' ')[0]}
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="px-4 py-2 rounded-lg text-sm transition-all duration-150 hover:bg-[var(--bg-surface)]"
                style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-dm-sans)' }}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:bg-[var(--bg-surface)]"
                style={{ color: 'var(--text-muted)' }}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:bg-[var(--bg-surface)]"
              style={{ color: 'var(--text-muted)' }}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 border-b border-[var(--border)] backdrop-blur-xl"
            style={{ background: 'var(--bg)/90' }}
          >
            <nav className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-left px-4 py-3 rounded-lg text-sm transition-all hover:bg-[var(--bg-surface)]"
                  style={{ color: 'var(--text)', fontFamily: 'var(--font-dm-sans)' }}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
