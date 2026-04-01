'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Github, Linkedin, Twitter, Mail, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { siteConfig, socialLinks } from '@/content';

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

// Keep your existing ICON_MAP and useInView import (assuming you have it from framer-motion)
import { useInView } from 'framer-motion';

const ICON_MAP: Record<string, React.ReactNode> = {
  github:   <Github size={18} />,
  linkedin: <Linkedin size={18} />,
  twitter:  <Twitter size={18} />,
  mail:     <Mail size={18} />,
};

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    // Replace 'your-form-id' with your actual Formspree ID
    const response = await fetch('https://formspree.io/f/mnjozppb', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } else {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const inputClass = `w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 focus:border-[var(--accent)] border`;
  const inputStyle = {
    background: 'var(--bg-card)',
    borderColor: 'var(--border)',
    color: 'var(--text)',
    fontFamily: 'var(--font-dm-sans)',
  };

  return (
    <section id="contact" className="py-28 md:py-36">
      <div className="max-w-6xl mx-auto px-6">
        
        <FadeUp>
          <div className="mb-16">
            <p className="section-label mb-3">Contact</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-syne)', color: 'var(--text)' }}>
              Let's talk.
            </h2>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20">
          
          {/* Left: Info */}
          <FadeUp delay={0.1}>
            <div className="flex flex-col gap-8">
              <p className="text-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Whether you want to collaborate, have a question, or just want to say hi — my inbox is always open.
              </p>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Mail size={15} style={{ color: 'var(--accent)' }} />
                  <a href={`mailto:${siteConfig.email}`} className="text-sm link-accent font-mono">{siteConfig.email}</a>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={15} style={{ color: 'var(--accent)' }} />
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{siteConfig.location}</span>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl w-fit border border-[var(--border)] bg-[var(--bg-card)]">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-sm" style={{ color: 'var(--text)' }}>{siteConfig.availabilityText}</span>
              </div>

              <div>
                <p className="text-xs mb-4 tracking-wider uppercase font-mono text-[var(--text-subtle)]">Find me on</p>
                <div className="flex gap-3">
                  {socialLinks.map((link) => (
                    <a key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110 border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-muted)]">
                      {ICON_MAP[link.icon] ?? <Mail size={18} />}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </FadeUp>

          {/* Right: Form */}
          <FadeUp delay={0.2}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs mb-1.5 font-mono text-[var(--text-subtle)]">Your name</label>
                  <input name="name" value={form.name} onChange={handleChange} required placeholder="Name" className={inputClass} style={inputStyle} />
                </div>
                <div>
                  <label className="block text-xs mb-1.5 font-mono text-[var(--text-subtle)]">Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="name@example.com" className={inputClass} style={inputStyle} />
                </div>
              </div>

              <div>
                <label className="block text-xs mb-1.5 font-mono text-[var(--text-subtle)]">Subject</label>
                <input name="subject" value={form.subject} onChange={handleChange} placeholder="Let's work together" className={inputClass} style={inputStyle} />
              </div>

              <div>
                <label className="block text-xs mb-1.5 font-mono text-[var(--text-subtle)]">Message</label>
                <textarea name="message" value={form.message} onChange={handleChange} required rows={5} placeholder="Hi Aryan, I'd love to chat about..." className={`${inputClass} resize-none`} style={inputStyle} />
              </div>

              <button 
                type="submit" 
                disabled={status === 'loading'}
                className={`btn-primary self-start min-w-[160px] flex items-center justify-center gap-2 transition-all ${status === 'loading' ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {status === 'loading' && <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />}
                {status === 'idle' && <><Send size={14} /> Send message</>}
                {status === 'success' && <><CheckCircle size={14} /> Message Sent!</>}
                {status === 'error' && <><AlertCircle size={14} /> Failed. Try again?</>}
              </button>

              <AnimatePresence>
                {status === 'success' && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xs text-green-400">
                    Thanks! Your message has been sent successfully.
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}