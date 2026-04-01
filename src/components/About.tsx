'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { BookOpen, Headphones, Code2, Sparkles, Play, Pause } from 'lucide-react';
import { aboutContent, siteConfig } from '@/content';

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

const currentlyIcons: Record<string, React.ReactNode> = {
  building:  <Code2  size={14} />,
  learning:  <BookOpen size={14} />,
  reading:   <BookOpen size={14} />,
  listening: <Headphones size={14} />,
};

// Extract the plain video ID from any YouTube URL format
function extractVideoId(url: string): string | null {
  try {
    const parsed = new URL(url);
    // Standard watch URL: youtube.com/watch?v=VIDEO_ID
    if (parsed.searchParams.has('v')) {
      return parsed.searchParams.get('v');
    }
    // Short URL: youtu.be/VIDEO_ID
    if (parsed.hostname === 'youtu.be') {
      return parsed.pathname.slice(1).split('?')[0];
    }
    // Embed URL: youtube.com/embed/VIDEO_ID
    const embedMatch = parsed.pathname.match(/\/embed\/([^/?]+)/);
    if (embedMatch) return embedMatch[1];
  } catch {
    // Not a valid URL — try a simple regex fallback
    const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (match) return match[1];
  }
  return null;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function About() {
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<any>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const apiReadyRef = useRef(false);

  const videoId = aboutContent.currently.videoUrl
    ? extractVideoId(String(aboutContent.currently.videoUrl))
    : null;

  // Load the YouTube IFrame API once and create the player
  useEffect(() => {
    if (!videoId) return;

    const initPlayer = () => {
      if (!playerContainerRef.current) return;

      playerRef.current = new window.YT.Player(playerContainerRef.current, {
        videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          // 'origin' helps avoid the "blocked by CORS" issue in some browsers
          origin: window.location.origin,
        },
        events: {
          onStateChange: (event: any) => {
            // YT.PlayerState.ENDED = 0
            if (event.data === 0) setIsPlaying(false);
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      // API already loaded (e.g. hot reload)
      initPlayer();
      apiReadyRef.current = true;
    } else {
      // Set the global callback YouTube calls when the API is ready
      window.onYouTubeIframeAPIReady = () => {
        apiReadyRef.current = true;
        initPlayer();
      };

      // Inject the script tag if it's not already there
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(script);
      }
    }

    return () => {
      // Clean up the player on unmount
      if (playerRef.current?.destroy) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [videoId]);

  const toggleSong = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    } else {
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  };

  return (
    <section id="about" className="py-28 md:py-36">
      {/* Hidden YouTube player — visually invisible but audio plays fine */}
      {videoId && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            // Keep it on-screen but invisible: size 1px, opacity 0, pointer-events none.
            // YouTube blocks truly off-screen / display:none iframes.
            width: '1px',
            height: '1px',
            opacity: 0,
            pointerEvents: 'none',
            bottom: 0,
            left: 0,
          }}
        >
          <div ref={playerContainerRef} />
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6">
        <FadeUp>
          <div className="mb-16">
            <p className="section-label mb-3">About</p>
            <h2
              className="text-4xl md:text-5xl font-extrabold tracking-tight"
              style={{ fontFamily: 'var(--font-syne)', color: 'var(--text)' }}
            >
              A bit about me.
            </h2>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-12 lg:gap-20">
          {/* Left Side: Image and Currently Section */}
          <div className="flex flex-col gap-8">
            <FadeUp delay={0.1}>
              <div
                className="w-48 h-48 md:w-56 md:h-56 rounded-3xl overflow-hidden shadow-2xl relative"
                style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}
              >
                <img
                  src={siteConfig.profileImage}
                  alt={siteConfig.name}
                  className="w-full h-full object-cover grayscale-[15%] hover:grayscale-0 transition-all duration-700"
                />
                <div
                  className="absolute bottom-3 left-3 right-3 flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest backdrop-blur-md bg-black/40 border border-white/10"
                  style={{ color: '#fff', fontFamily: 'var(--font-mono)' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  {siteConfig.availabilityText}
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={0.2}>
              <div
                className="rounded-2xl p-6"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
              >
                <p
                  className="text-xs font-semibold mb-5 tracking-wider uppercase flex items-center gap-2"
                  style={{ color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)' }}
                >
                  <Sparkles size={12} className="text-[var(--accent)]" />
                  Currently
                </p>
                <div className="flex flex-col gap-4">
                  {Object.entries(aboutContent.currently).map(([key, value]) => {
                    if (key === 'videoUrl') return null;

                    const isListening = key.toLowerCase() === 'listening';

                    return (
                      <div
                        key={key}
                        onClick={isListening ? toggleSong : undefined}
                        className={`flex items-start gap-3 p-2 -ml-2 rounded-xl transition-all duration-300 ${
                          isListening ? 'cursor-pointer hover:bg-[var(--accent-dim)] group/music' : ''
                        }`}
                      >
                        <div className="mt-0.5 flex-shrink-0" style={{ color: 'var(--accent)' }}>
                          {isListening && isPlaying ? (
                            <Pause size={14} className="animate-pulse" />
                          ) : isListening ? (
                            <Play size={14} className="group-hover/music:scale-110 transition-transform" />
                          ) : (
                            currentlyIcons[key] ?? <Code2 size={14} />
                          )}
                        </div>

                        <div>
                          <span
                            className="text-[10px] uppercase tracking-widest block mb-1 font-bold"
                            style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
                          >
                            {key}
                            {isListening && (
                              <span className="ml-2 opacity-40 font-normal italic text-[8px]">
                                {isPlaying ? '(Streaming...)' : '(Click to play)'}
                              </span>
                            )}
                          </span>
                          <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                            {value}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </FadeUp>
          </div>

          {/* Right Side: Bio and Timeline */}
          <div className="flex flex-col gap-10">
            <FadeUp delay={0.15}>
              <div className="flex flex-col gap-5">
                {aboutContent.bio.map((para, i) => (
                  <p key={i} className="text-base md:text-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {para}
                  </p>
                ))}
              </div>
            </FadeUp>

            <FadeUp delay={0.25}>
              <div>
                <p
                  className="text-xs font-semibold mb-6 tracking-wider uppercase"
                  style={{ color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)' }}
                >
                  Timeline
                </p>
                <div className="relative flex flex-col gap-0">
                  <div className="absolute left-[46px] top-3 bottom-3 w-px" style={{ background: 'var(--border)' }} />
                  {aboutContent.milestones.map((m, i) => (
                    <div key={i} className="flex items-start gap-5 pb-8 relative group">
                      <div
                        className="flex-shrink-0 w-[40px] text-right text-[10px] font-bold relative z-10"
                        style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', paddingTop: '4px' }}
                      >
                        {m.year}
                      </div>
                      <div
                        className="flex-shrink-0 w-2.5 h-2.5 rounded-full mt-1.5 relative z-10 transition-transform group-hover:scale-125"
                        style={{
                          background: i === 0 ? 'var(--accent)' : 'var(--border-strong)',
                          border: '2px solid var(--bg)',
                        }}
                      />
                      <p className="text-sm md:text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        {m.event}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}