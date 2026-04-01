import Link from 'next/link';
import { ArrowLeft, Github, ExternalLink } from 'lucide-react';
import { projects, siteConfig } from '@/content';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Projects — ${siteConfig.name}`,
  description: `All projects and open source work by ${siteConfig.name}.`,
};

export default function ProjectsPage() {
  const visible = projects.filter((p) => p.visible);
  const categories = Array.from(new Set(visible.map((p) => p.category)));

  return (
    <main>
      <Navigation />

      <div className="max-w-6xl mx-auto px-6 pt-32 pb-24">

        {/* Header */}
        <div className="mb-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm mb-8 transition-opacity hover:opacity-60"
            style={{ color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)' }}
          >
            <ArrowLeft size={14} /> Home
          </Link>
          <p className="section-label mb-3">Work</p>
          <h1
            className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4"
            style={{ fontFamily: 'var(--font-syne)', color: 'var(--text)' }}
          >
            All projects.
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
            {visible.length} projects across {categories.length} categories.
          </p>
        </div>

        {/* Grouped by category */}
        {categories.map((category) => {
          const catProjects = visible.filter((p) => p.category === category);
          return (
            <div key={category} className="mb-16">
              <h2
                className="text-xs font-semibold mb-6 tracking-wider uppercase"
                style={{ color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)' }}
              >
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {catProjects.map((project) => (
                  <div
                    key={project.slug}
                    className="group flex flex-col gap-4 p-5 rounded-2xl transition-all duration-200 hover:-translate-y-1"
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <div>
                      {project.featured && (
                        <span
                          className="inline-block text-xs px-2 py-0.5 rounded-md mb-3"
                          style={{
                            background: 'var(--accent-dim)',
                            border: '1px solid var(--accent)',
                            color: 'var(--accent)',
                            fontFamily: 'var(--font-mono)',
                          }}
                        >
                          featured
                        </span>
                      )}
                      <h3
                        className="text-base font-bold mb-2"
                        style={{ fontFamily: 'var(--font-syne)', color: 'var(--text)' }}
                      >
                        {project.title}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        {project.shortDesc}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {project.techStack.slice(0, 5).map((tech) => (
                        <span key={tech} className="tech-pill">{tech}</span>
                      ))}
                    </div>

                    <div
                      className="flex items-center gap-4 pt-3"
                      style={{ borderTop: '1px solid var(--border)' }}
                    >
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs transition-opacity hover:opacity-60"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          <Github size={12} /> Source
                        </a>
                      )}
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs transition-opacity hover:opacity-60"
                          style={{ color: 'var(--accent)' }}
                        >
                          <ExternalLink size={12} /> Live demo
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <Footer />
    </main>
  );
}
