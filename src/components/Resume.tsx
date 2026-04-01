'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Download, ExternalLink } from 'lucide-react';
import { resumeData, skills, siteConfig } from '@/content';

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

// Safely extract categories
const skillCategories = Array.from(new Set(skills.map((s: any) => s.category)));

export default function Resume() {
  // Safely filter sections and skills so TypeScript doesn't crash on new data
  const visibleSections = resumeData.sections.filter((s: any) => s.visible !== false);
  const visibleSkills   = skills.filter((s: any) => s.visible !== false);

  return (
    <section id="resume" className="py-28 md:py-36" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-6xl mx-auto px-6">

        <FadeUp>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <p className="section-label mb-3">Experience</p>
              <h2
                className="text-4xl md:text-5xl font-extrabold tracking-tight"
                style={{ fontFamily: 'var(--font-syne)', color: 'var(--text)' }}
              >
                Experience
              </h2>
            </div>
            <a
              href={siteConfig.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              <Download size={14} /> Download CV
            </a>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12 lg:gap-16">

          {/* Left: Resume Sections (Timeline) */}
          <div className="flex flex-col gap-12">
            {visibleSections.map((section: any, si: number) => (
              <FadeUp key={section.title} delay={0.1 + si * 0.08}>
                <div>
                  <p
                    className="text-xs font-semibold mb-6 tracking-wider uppercase"
                    style={{ color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)' }}
                  >
                    {section.title}
                  </p>
                  <div className="flex flex-col gap-0">
                    {section.items
                      .filter((item: any) => item.visible !== false)
                      .map((item: any, ii: number, arr: any[]) => (
                        <div key={item.title} className="relative flex gap-5">
                          {/* Timeline */}
                          <div className="flex flex-col items-center">
                            <div
                              className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                              style={{ background: item.active ? 'var(--accent)' : 'var(--border-strong)' }}
                            />
                            {/* We added "!item.hideLine" to give you manual control! */}
                            {ii < arr.length - 1 && !item.hideLine && (
                              <div
                                className="w-px flex-1 mt-1"
                                style={{ background: 'var(--border)', minHeight: 24 }}
                              />
                            )}
                          </div>

                          {/* Content */}
                          <div className={ii < arr.length - 1 ? 'pb-8' : 'pb-0'}>
                            <div className="flex flex-wrap items-start gap-2 mb-1">
                              <h4
                                className="text-base font-semibold"
                                style={{ fontFamily: 'var(--font-syne)', color: 'var(--text)' }}
                              >
                                {item.title}
                              </h4>
                              {item.link && (
                                <a
                                  href={item.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ color: 'var(--text-subtle)' }}
                                >
                                  <ExternalLink size={12} />
                                </a>
                              )}
                            </div>

                            {item.organization && (
                              <p className="text-sm mb-1" style={{ color: 'var(--accent)' }}>
                                {item.organization}
                              </p>
                            )}

                            <div className="flex items-center gap-3 mb-2">
                              <span
                                className="text-xs"
                                style={{ color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)' }}
                              >
                                {item.startDate}{item.endDate ? ` – ${item.endDate}` : (item.startDate && item.startDate.length > 4 ? ' – Present' : '')}
                              </span>
                              {item.location && (
                                <>
                                  <span style={{ color: 'var(--border-strong)' }}>·</span>
                                  <span
                                    className="text-xs"
                                    style={{ color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)' }}
                                  >
                                    {item.location}
                                  </span>
                                </>
                              )}
                            </div>

                            {item.description && (
                              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>

          {/* Right: Skills (Pill Tags) */}
          <FadeUp delay={0.2}>
            <div className="flex flex-col gap-8">
              <p
                className="text-xs font-semibold tracking-wider uppercase"
                style={{ color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)' }}
              >
                Skills
              </p>

              <div className="flex flex-col gap-6">
                {skillCategories.map((category: any) => {
                  const catSkills = visibleSkills.filter((s: any) => s.category === category);
                  return (
                    <div key={category}>
                      <p
                        className="text-xs mb-3"
                        style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}
                      >
                        {category}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {catSkills.map((skill: any) => (
                          <span
                            key={skill.name}
                            className="px-3 py-1.5 rounded-lg text-sm transition-colors hover:text-[var(--accent)] hover:border-[var(--accent)]"
                            style={{
                              background: 'var(--bg-card)',
                              border: '1px solid var(--border)',
                              color: 'var(--text-muted)',
                            }}
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}