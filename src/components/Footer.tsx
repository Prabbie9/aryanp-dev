'use client';

import { ArrowUp } from 'lucide-react';
import { siteConfig } from '@/content';

export default function Footer() {
  return (
    <footer
      className="py-10 mt-0"
      style={{ borderTop: '1px solid var(--border)' }}
    >
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold"
            style={{ background: 'var(--accent)', color: '#000', fontFamily: 'var(--font-syne)' }}
          >
            {siteConfig.initials}
          </div>
          <span className="text-sm" style={{ color: 'var(--text-subtle)' }}>
            © {new Date().getFullYear()} {siteConfig.name}. Built with care.
          </span>
        </div>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 text-sm transition-opacity hover:opacity-60"
          style={{ color: 'var(--text-subtle)' }}
          aria-label="Back to top"
        >
          Back to top <ArrowUp size={13} />
        </button>
      </div>
    </footer>
  );
}
