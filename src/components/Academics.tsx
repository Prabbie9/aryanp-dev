'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ChevronDown, GraduationCap } from 'lucide-react';
import { academics } from '@/content';

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

const GRADE_COLORS: Record<string, string> = {
  // A-Levels & Standard Letters
  'A*': '#22c55e', 'A': '#14ab88', 'A-': '#a7f3d0',
  'B+': '#60a5fa', 'B': '#93c5fd', 'B-': '#bfdbfe',
  'C+': '#fcd34d', 'C': '#fde68a',

  // GCSEs (Number Grades)
  '9': '#22c55e', '8': '#14ab88', '7': '#86efac',
  '6': '#60a5fa', '5': '#93c5fd', '4': '#bfdbfe',

  // University & Competitions
  '1st': '#22c55e', '2:1': '#86efac', '2:2': '#fde68a',
  'Gold': '#fbbf24', 'Silver': '#94a3b8', 'Bronze': '#b45309',
  'Dist.': '#fbbf24', 'Merit': '#60a5fa'
};

function gradeColor(grade: string) {
  return GRADE_COLORS[grade] ?? 'var(--text-muted)';
}

export default function Academics() {
  const visible = academics.filter((a: any) => a.visible !== false);

  return (
    <section id="academics" className="py-28 md:py-36" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-6xl mx-auto px-6">

        <FadeUp>
          <div className="mb-16">
            <p className="section-label mb-3">Academic</p>
            <h2
              className="text-4xl md:text-5xl font-extrabold tracking-tight"
              style={{ fontFamily: 'var(--font-syne)', color: 'var(--text)' }}
            >
              What I studied.
            </h2>
          </div>
        </FadeUp>

        <div className="flex flex-col gap-8">
          {visible.map((institution: any, i: number) => (
            <FadeUp key={institution.name} delay={0.1 + i * 0.1}>
              <InstitutionCard institution={institution} />
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// We use 'any' here to stop TypeScript from complaining about varying data structures in content.ts
function InstitutionCard({ institution }: { institution: any }) {
  const visibleSemesters = institution.semesters.filter((s: any) => s.visible !== false);

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
    >
      {/* Institution Header */}
      <div className="p-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--accent-dim)' }}
          >
            <GraduationCap size={22} style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <h3
              className="text-xl font-bold mb-1"
              style={{ fontFamily: 'var(--font-syne)', color: 'var(--text)' }}
            >
              {institution.name}
            </h3>
            <p className="text-sm mb-0.5" style={{ color: 'var(--text-muted)' }}>
              {institution.degree} · {institution.field}
            </p>
            <p
              className="text-xs"
              style={{ color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)' }}
            >
              {institution.years}
            </p>
          </div>
        </div>

        {/* Grades Badge */}
        {institution.gpa && (
          <div
            className="flex flex-col items-center px-5 py-3 rounded-xl text-center"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
          >
            <span
              className="text-xl font-extrabold"
              style={{ fontFamily: 'var(--font-syne)', color: 'var(--accent)' }}
            >
              {institution.gpa}
            </span>
            <span
              className="text-xs uppercase tracking-wider mt-1"
              style={{ color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)' }}
            >
              Overall Grades
            </span>
          </div>
        )}
      </div>

      {/* Semesters */}
      <div className="flex flex-col" style={{ borderTop: '1px solid var(--border)' }}>
        {visibleSemesters.map((semester: any, i: number) => (
          <SemesterRow key={semester.name} semester={semester} defaultOpen={semester.defaultOpen ?? false} />
        ))}
      </div>
    </div>
  );
}

function SemesterRow({ semester, defaultOpen }: { semester: any; defaultOpen?: boolean; }) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  const visibleCourses = semester.courses.filter((c: any) => c.visible !== false);

  // Safely check if fields exist and convert to string so TypeScript doesn't crash
  const hasCode = visibleCourses.some((c: any) => c.code !== undefined && String(c.code).trim() !== '');
  const hasCats = visibleCourses.some((c: any) => c.CATS !== undefined && String(c.CATS).trim() !== '');

// Dynamically build the CSS grid columns with fixed widths for perfect alignment
  const gridTemplateColumns = `1fr ${hasCode ? '80px ' : ''}${hasCats ? '60px ' : ''}80px`;

  return (
    <div style={{ borderBottom: '1px solid var(--border)' }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 transition-colors hover:bg-[var(--bg-surface)] text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold" style={{ color: 'var(--text)', fontFamily: 'var(--font-syne)' }}>
            {semester.name}
          </span>
          {semester.gpa && (
            <span
              className="text-xs px-2 py-0.5 rounded-md"
              style={{
                background: 'var(--accent-dim)',
                color: 'var(--accent)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              Grades: {semester.gpa}
            </span>
          )}
          <span
            className="text-xs"
            style={{ color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)' }}
          >
            {visibleCourses.length} courses
          </span>
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ color: 'var(--text-subtle)' }}
        >
          <ChevronDown size={16} />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5">
              {/* Course table */}
              <div
                className="rounded-xl overflow-hidden"
                style={{ border: '1px solid var(--border)' }}
              >
                {/* Table Header */}
                <div
                  className="grid px-4 py-2.5 text-xs uppercase tracking-wider gap-6"
                  style={{
                    gridTemplateColumns,
                    background: 'var(--bg-surface)',
                    color: 'var(--text-subtle)',
                    fontFamily: 'var(--font-mono)',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <span>Course</span>
                  {hasCode && <span className="text-right">Code</span>}
                  {hasCats && <span className="text-right">CATS</span>}
                  <span className="text-right">Grade</span>
                </div>

                {/* Table Rows */}
                {visibleCourses.map((course: any, i: number) => (
                  <div
                    key={course.name}
                    className="grid px-4 py-3 items-center gap-6"
                    style={{
                      gridTemplateColumns,
                      borderBottom: i < visibleCourses.length - 1 ? '1px solid var(--border)' : 'none',
                      background: i % 2 === 0 ? 'transparent' : 'var(--bg-surface)',
                    }}
                  >
                    <span className="text-sm" style={{ color: 'var(--text)' }}>{course.name}</span>
                    
                    {hasCode && (
                      <span
                        className="text-xs text-right"
                        style={{ color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)' }}
                      >
                        {course.code || '—'}
                      </span>
                    )}
                    
                    {hasCats && (
                      <span
                        className="text-xs text-right"
                        style={{ color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)' }}
                      >
                        {course.CATS || '—'}
                      </span>
                    )}

                    <span
                      className="text-sm font-bold text-right min-w-[2rem]"
                      style={{
                        color: gradeColor(course.grade),
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {course.grade}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}