'use client';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { customPages } from '@/content';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function CustomPage() {
  const params = useParams();
  const page = customPages.find((p) => p.slug === params?.slug);

  if (!page) return (
    <main>
      <Navigation />
      <div className="max-w-3xl mx-auto px-6 pt-32">
        <h1 style={{ fontFamily: 'var(--font-syne)', color: 'var(--text)', fontSize: '2rem', fontWeight: 800 }}>
          Page not found
        </h1>
      </div>
      <Footer />
    </main>
  );

  return (
    <main>
      <Navigation />
      <div className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        <div className="prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{page.content}</ReactMarkdown>
        </div>
      </div>
      <Footer />
    </main>
  );
}
