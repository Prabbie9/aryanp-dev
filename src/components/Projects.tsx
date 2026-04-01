'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { projects } from '@/content';

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

const CATEGORIES = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('All');
  const visible = projects.filter((p) => p.visible);
  const filtered =
    activeCategory === 'All'
      ? visible
      : visible.filter((p) => p.category === activeCategory);

  const featured = filtered.filter((p) => p.featured);
  const rest     = filtered.filter((p) => !p.featured);

  return (
    <section id="projects" className="py-28 md:py-36">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <FadeUp>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="section-label mb-3">Work</p>
              <h2
                className="text-4xl md:text-5xl font-extrabold tracking-tight"
                style={{ fontFamily: 'var(--font-syne)', color: 'var(--text)' }}
              >
                Things I've built.
              </h2>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-sm"
              style={{ color: 'var(--accent)', fontFamily: 'var(--font-dm-sans)' }}
            >
              View all projects <ArrowUpRight size={14} />
            </Link>
          </div>
        </FadeUp>

        {/* Category Filter */}
        <FadeUp delay={0.1}>
          <div className="flex flex-wrap gap-2 mb-10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-4 py-1.5 rounded-full text-sm transition-all duration-200"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  background: activeCategory === cat ? 'var(--accent)' : 'var(--bg-surface)',
                  color: activeCategory === cat ? '#000' : 'var(--text-muted)',
                  border: `1px solid ${activeCategory === cat ? 'var(--accent)' : 'var(--border)'}`,
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </FadeUp>

        {/* Featured Projects — Large Cards */}
        {featured.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
            {featured.map((project, i) => (
              <FadeUp key={project.slug} delay={0.1 + i * 0.08}>
                <ProjectCard project={project} large />
              </FadeUp>
            ))}
          </div>
        )}

        {/* Rest */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.map((project, i) => (
              <FadeUp key={project.slug} delay={0.1 + i * 0.06}>
                <ProjectCard project={project} />
              </FadeUp>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>
            No projects in this category yet.
          </div>
        )}
      </div>
    </section>
  );
}

function ProjectCard({ project, large }: { project: typeof projects[number]; large?: boolean }) {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      animate={{ y: hovered ? -4 : 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="group flex flex-col rounded-2xl overflow-hidden h-full"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        boxShadow: hovered ? '0 16px 40px var(--shadow-strong)' : 'none',
        borderColor: hovered ? 'var(--border-strong)' : 'var(--border)',
        transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
      }}
    >
      {/* Thumbnail placeholder */}
      <div
        className="w-full relative overflow-hidden"
        style={{ height: large ? 140 : 100 }}
      >
        <div
          className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
          style={{
            background: `linear-gradient(135deg, var(--accent-dim), var(--bg-surface))`,
          }}
        />
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span
            className="text-xs px-2 py-1 rounded-md"
            style={{
              fontFamily: 'var(--font-mono)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
            }}
          >
            {project.category}
          </span>
        </div>
        {/* Featured star */}
        {project.featured && (
          <div className="absolute top-3 right-3">
            <span
              className="text-xs px-2 py-1 rounded-md"
              style={{
                fontFamily: 'var(--font-mono)',
                background: 'var(--accent-dim)',
                border: '1px solid var(--accent)',
                color: 'var(--accent)',
              }}
            >
              featured
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-5 flex-1">
        <h3
          className="text-base font-bold"
          style={{ fontFamily: 'var(--font-syne)', color: 'var(--text)' }}
        >
          {project.title}
        </h3>
        <div className="flex-1">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {expanded ? project.description : project.shortDesc}
          </p>
          {project.description && project.description !== project.shortDesc && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs mt-1 transition-opacity hover:opacity-70"
              style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
            >
              {expanded ? 'Read less -' : 'Read more +'}
            </button>
          )}
        </div>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 4).map((tech) => (
            <span key={tech} className="tech-pill">{tech}</span>
          ))}
          {project.techStack.length > 4 && (
            <span className="tech-pill">+{project.techStack.length - 4}</span>
          )}
        </div>

        {/* Links */}
        <div className="flex items-center gap-3 mt-1 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs transition-colors hover:opacity-80"
              style={{ color: 'var(--text-muted)' }}
            >
              <Github size={12} /> Source
            </a>
          )}
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs transition-colors hover:opacity-80"
              style={{ color: 'var(--accent)' }}
            >
              <ExternalLink size={12} /> Link
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
