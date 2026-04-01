import Link from 'next/link';
import { ArrowLeft, Clock, ArrowUpRight } from 'lucide-react';
import { blogPosts, siteConfig } from '@/content';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Writing — ${siteConfig.name}`,
  description: `Articles and thoughts by ${siteConfig.name} on software, systems, and the craft of building.`,
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export default function BlogPage() {
  const published = blogPosts
    .filter((p) => p.published)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const allTags = Array.from(new Set(published.flatMap((p) => p.tags)));

  return (
    <main>
      <Navigation />

      <div className="max-w-3xl mx-auto px-6 pt-32 pb-24">

        {/* Header */}
        <div className="mb-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm mb-8 transition-opacity hover:opacity-60"
            style={{ color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)' }}
          >
            <ArrowLeft size={14} /> Home
          </Link>
          <p className="section-label mb-3">Writing</p>
          <h1
            className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4"
            style={{ fontFamily: 'var(--font-syne)', color: 'var(--text)' }}
          >
            Things I've written.
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
            {published.length} post{published.length !== 1 ? 's' : ''} on software, systems, and the craft of building things.
          </p>
        </div>

        {/* Tags */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-12">
            {allTags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs"
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Posts */}
        {published.length === 0 ? (
          <div
            className="text-center py-20 rounded-2xl"
            style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
          >
            No posts yet. Check back soon.
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {published.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                <div
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-5 border-b transition-colors"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <div className="flex-1">
                    <h2
                      className="text-base font-semibold mb-1.5 group-hover:text-[var(--accent)] transition-colors"
                      style={{ fontFamily: 'var(--font-syne)', color: 'var(--text)' }}
                    >
                      {post.title}
                    </h2>
                    <p className="text-sm line-clamp-1" style={{ color: 'var(--text-muted)' }}>
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-start sm:items-end gap-3 sm:gap-1 flex-shrink-0">
                    <span
                      className="text-xs"
                      style={{ color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)' }}
                    >
                      {formatDate(post.publishedAt)}
                    </span>
                    <span
                      className="text-xs flex items-center gap-1"
                      style={{ color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)' }}
                    >
                      <Clock size={10} /> {post.readTime} min
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
