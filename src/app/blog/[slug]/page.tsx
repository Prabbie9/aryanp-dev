'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useParams } from 'next/navigation';
import { blogPosts, siteConfig } from '@/content';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 z-[60] h-0.5 transition-all"
      style={{ width: `${progress}%`, background: 'var(--accent)' }}
    />
  );
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const post = blogPosts.find((p) => p.slug === slug && p.published);

  if (!post) {
    return (
      <main>
        <Navigation />
        <div className="max-w-3xl mx-auto px-6 pt-40 pb-24 text-center">
          <h1
            className="text-4xl font-extrabold mb-4"
            style={{ fontFamily: 'var(--font-syne)', color: 'var(--text)' }}
          >
            Post not found
          </h1>
          <p className="mb-8" style={{ color: 'var(--text-muted)' }}>
            This post doesn't exist or hasn't been published yet.
          </p>
          <Link href="/blog" className="btn-primary">
            Back to blog
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <ReadingProgress />
      <Navigation />

      <article className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        {/* Back */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm mb-12 transition-opacity hover:opacity-60"
          style={{ color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)' }}
        >
          <ArrowLeft size={14} /> All posts
        </Link>

        {/* Header */}
        <header className="mb-12">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full"
                style={{
                  background: 'var(--accent-dim)',
                  color: 'var(--accent)',
                  border: '1px solid var(--accent)',
                  fontFamily: 'var(--font-mono)',
                  opacity: 0.8,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <h1
            className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-syne)', color: 'var(--text)' }}
          >
            {post.title}
          </h1>

          <div
            className="flex flex-wrap items-center gap-5 pb-8"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <div className="flex items-center gap-2" style={{ color: 'var(--text-subtle)' }}>
              <Calendar size={13} />
              <span className="text-sm" style={{ fontFamily: 'var(--font-mono)' }}>
                {formatDate(post.publishedAt)}
              </span>
            </div>
            <div className="flex items-center gap-2" style={{ color: 'var(--text-subtle)' }}>
              <Clock size={13} />
              <span className="text-sm" style={{ fontFamily: 'var(--font-mono)' }}>
                {post.readTime} min read
              </span>
            </div>
            <div className="flex items-center gap-2" style={{ color: 'var(--text-subtle)' }}>
              <span className="text-sm" style={{ fontFamily: 'var(--font-mono)' }}>
                by {siteConfig.name}
              </span>
            </div>
          </div>
        </header>

        {/* Body */}
        <div className="prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Footer of post */}
        <div
          className="mt-16 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-60"
            style={{ color: 'var(--text-muted)' }}
          >
            <ArrowLeft size={14} /> More posts
          </Link>

          <a
            href={`mailto:${siteConfig.email}?subject=Re: ${encodeURIComponent(post.title)}`}
            className="text-sm"
            style={{ color: 'var(--accent)' }}
          >
            Reply by email →
          </a>
        </div>
      </article>

      <Footer />
    </main>
  );
}
