'use client';

import { motion } from 'framer-motion';
import { ArrowDown, MapPin, Sparkles } from 'lucide-react';
import { siteConfig } from '@/content';

const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const scrollToWork = () => {
    document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
  };
  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const firstName = siteConfig.name.split(' ')[0];
  const lastName  = siteConfig.name.split(' ').slice(1).join(' ');

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

      {/* ── Animated Gradient Background ─────────────────────── */}
      <div className="absolute inset-0 -z-10" style={{ background: 'var(--bg)' }}>
        {/* Warm amber blob */}
        <div
          className="absolute rounded-full"
          style={{
            width: '55%',
            aspectRatio: '1',
            top: '10%',
            left: '-10%',
            background: 'radial-gradient(circle, rgba(240,160,80,0.13) 0%, transparent 70%)',
            filter: 'blur(80px)',
            animation: 'blobDrift 14s ease-in-out infinite alternate',
          }}
        />
        {/* Purple accent blob */}
        <div
          className="absolute rounded-full"
          style={{
            width: '45%',
            aspectRatio: '1',
            top: '30%',
            right: '-5%',
            background: 'radial-gradient(circle, rgba(120,80,220,0.08) 0%, transparent 70%)',
            filter: 'blur(100px)',
            animation: 'blobDriftSlow 20s ease-in-out infinite alternate',
          }}
        />
        {/* Bottom subtle blob */}
        <div
          className="absolute rounded-full"
          style={{
            width: '40%',
            aspectRatio: '1',
            bottom: '-5%',
            left: '30%',
            background: 'radial-gradient(circle, rgba(240,160,80,0.06) 0%, transparent 70%)',
            filter: 'blur(80px)',
            animation: 'blobDrift 18s ease-in-out infinite alternate-reverse',
          }}
        />
      </div>

      {/* ── Content ───────────────────────────────────────────── */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
        <div className="flex flex-col items-start">

          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="mb-8"
          >
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs"
              style={{
                borderColor: 'var(--accent-dim)',
                background: 'var(--accent-dim)',
                color: 'var(--accent)',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.12em',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: 'var(--accent)' }}
              />
              {siteConfig.availabilityText.toUpperCase()}
            </span>
          </motion.div>

          {/* Name — the signature element */}
          <div className="mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease }}
              className="text-[clamp(3.5rem,10vw,9rem)] leading-[0.92] tracking-tight mb-1"
              style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, color: 'var(--text)' }}
            >
              {firstName}
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.32, ease }}
              className="text-[clamp(3.5rem,10vw,9rem)] leading-[0.92] tracking-tight text-outline"
              style={{ fontFamily: 'var(--font-syne)', fontWeight: 800 }}
            >
              {lastName}
            </motion.h1>
          </div>

          {/* Tagline & Details row */}
          <div className="flex flex-col md:flex-row md:items-end gap-8 w-full">
            <div className="flex-1">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.48, ease }}
                className="text-lg md:text-xl max-w-xl leading-relaxed mb-6"
                style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-dm-sans)' }}
              >
                {siteConfig.subTagline}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6, ease }}
                className="flex flex-wrap gap-3"
              >
                <button onClick={scrollToWork} className="btn-primary">
                  View my work
                  <ArrowDown size={14} />
                </button>
                <button onClick={scrollToContact} className="btn-ghost">
                  Say hello
                </button>
              </motion.div>
            </div>

            {/* Side info card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.7, ease }}
              className="flex flex-col gap-3 min-w-[200px]"
            >
              <div className="flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                <MapPin size={13} style={{ color: 'var(--accent)' }} />
                <span className="text-sm">{siteConfig.location}</span>
              </div>
              <div className="flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                <Sparkles size={13} style={{ color: 'var(--accent)' }} />
                <span className="text-sm">Maths Student</span>
              </div>
              {/* Decorative line */}
              <div
                className="mt-2 h-px w-24"
                style={{ background: 'linear-gradient(90deg, var(--accent), transparent)' }}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Scroll Indicator ───────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span
          className="text-[10px] tracking-[0.2em] uppercase"
          style={{ color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)' }}
        >
          scroll
        </span>
        <div
          className="w-px h-10"
          style={{
            background: 'linear-gradient(to bottom, var(--text-subtle), transparent)',
            animation: 'scrollBounce 2s ease-in-out infinite',
          }}
        />
      </motion.div>
    </section>
  );
}
