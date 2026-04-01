'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight, Clock, Tag } from 'lucide-react';
import Link from 'next/link';
import { blogPosts } from '@/content';

const ease = [0.16, 1, 0.3, 1] as const;

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

export default function BlogSection() {
  const published = blogPosts.filter((p) => p.published).slice(0, 3);

  if (published.length === 0) return null;

  return (
    <section id="blog" className="py-28 md:py-36">
      <div className="max-w-6xl mx-auto px-6">

        <FadeUp>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="section-label mb-3">Writing</p>
              <h2
                className="text-4xl md:text-5xl font-extrabold tracking-tight"
                style={{ fontFamily: 'var(--font-syne)', color: 'var(--text)' }}
              >
                Things I've written.
              </h2>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm"
              style={{ color: 'var(--accent)', fontFamily: 'var(--font-dm-sans)' }}
            >
              All posts <ArrowUpRight size={14} />
            </Link>
          </div>
        </FadeUp>

        <div className="flex flex-col gap-4">
          {published.map((post, i) => (
            <FadeUp key={post.slug} delay={0.1 + i * 0.08}>
              <BlogCard post={post} />
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogCard({ post }: { post: typeof blogPosts[number] }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <motion.div
        whileHover={{ x: 4 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl"
        style={{
          border: '1px solid var(--border)',
          background: 'var(--bg-card)',
          transition: 'border-color 0.2s ease',
        }}
      >
        <div className="flex-1">
          <h3
            className="text-base font-semibold mb-2 group-hover:text-[var(--accent)] transition-colors"
            style={{ fontFamily: 'var(--font-syne)', color: 'var(--text)' }}
          >
            {post.title}
          </h3>
          <p className="text-sm leading-relaxed line-clamp-2" style={{ color: 'var(--text-muted)' }}>
            {post.excerpt}
          </p>
        </div>

        <div className="flex md:flex-col items-start md:items-end gap-3 md:gap-2 flex-shrink-0">
          <div className="flex items-center gap-1.5" style={{ color: 'var(--text-subtle)' }}>
            <Clock size={11} />
            <span className="text-xs" style={{ fontFamily: 'var(--font-mono)' }}>
              {post.readTime} min
            </span>
          </div>
          <span
            className="text-xs"
            style={{ color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)' }}
          >
            {formatDate(post.publishedAt)}
          </span>
          <div className="flex gap-1.5">
            {post.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-md"
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-subtle)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
