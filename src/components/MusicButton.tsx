'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music2, X } from 'lucide-react';
import { musicPlaylist } from '@/content';

declare global {
  interface Window { YT: any; onYouTubeIframeAPIReady: () => void; }
}

function extractVideoId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.searchParams.has('v')) return parsed.searchParams.get('v');
    if (parsed.hostname === 'youtu.be') return parsed.pathname.slice(1).split('?')[0];
    const m = parsed.pathname.match(/\/embed\/([^/?]+)/);
    if (m) return m[1];
  } catch {
    const m = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (m) return m[1];
  }
  return null;
}

const fmt = (s: number) => {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

export default function MusicButton() {
  const [open, setOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [muted, setMuted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // Store the actual player instance directly
  const playerRef = useRef<any>(null);
  const playerReady = useRef(false);

  const song = musicPlaylist[currentIndex];
  const videoId = song ? extractVideoId(song.url) : null;

  const getPlayer = () => playerRef.current;

  const startProgress = useCallback(() => {
    if (progressInterval.current) clearInterval(progressInterval.current);
    progressInterval.current = setInterval(() => {
      const p = getPlayer();
      if (!p || typeof p.getCurrentTime !== 'function') return;
      const t = p.getCurrentTime() ?? 0;
      const d = p.getDuration() ?? 0;
      if (d > 0) { setProgress(t / d); setDuration(d); }
    }, 500);
  }, []);

  const stopProgress = useCallback(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex(i => (i + 1) % musicPlaylist.length);
  }, []);

  // Create player once on mount
  useEffect(() => {
    const initPlayer = () => {
      if (!containerRef.current || playerRef.current) return;
      
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: videoId ?? '',
        playerVars: {
          autoplay: 0,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          enablejsapi: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (e: any) => {
            playerReady.current = true;
            e.target.setVolume(80);
          },
          onStateChange: (e: any) => {
            if (e.data === window.YT.PlayerState.PLAYING) { setIsPlaying(true); startProgress(); }
            else if (e.data === window.YT.PlayerState.PAUSED) { setIsPlaying(false); stopProgress(); }
            else if (e.data === window.YT.PlayerState.ENDED) { setIsPlaying(false); stopProgress(); goNext(); }
          },
          onError: (e: any) => {
            console.error("YouTube Player Error Code:", e.data);
            if (e.data === 101 || e.data === 150) {
              console.warn(`The video "${song?.title}" restricts embedded playback. Please use a non-copyrighted track.`);
              setIsPlaying(false);
              stopProgress();
            }
          }
        },
      });
    };

    if (window.YT?.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const s = document.createElement('script');
        s.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(s);
      }
    }

    return () => {
      stopProgress();
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
        playerRef.current = null;
        playerReady.current = false;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load new video when song changes
  useEffect(() => {
    const p = getPlayer();
    if (!p || !videoId || !playerReady.current) return;
    
    if (typeof p.loadVideoById === 'function') {
      p.loadVideoById(videoId);
      setProgress(0);
      setDuration(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, videoId]);

  const togglePlay = () => {
    const p = getPlayer();
    if (!p || !playerReady.current || typeof p.playVideo !== 'function') return;
    if (isPlaying) p.pauseVideo();
    else p.playVideo();
  };

  const goPrev = () => setCurrentIndex(i => (i - 1 + musicPlaylist.length) % musicPlaylist.length);

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const p = getPlayer();
    if (!p || !playerReady.current || duration === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (typeof p.seekTo === 'function') {
      p.seekTo(ratio * duration, true);
      setProgress(ratio);
    }
  };

  const changeVolume = (e: React.MouseEvent<HTMLDivElement>) => {
    const p = getPlayer();
    const rect = e.currentTarget.getBoundingClientRect();
    const v = Math.round(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * 100);
    setVolume(v);
    setMuted(false);
    if (p && playerReady.current && typeof p.unMute === 'function') { p.unMute(); p.setVolume(v); }
  };

  const toggleMute = () => {
    const p = getPlayer();
    if (!p || !playerReady.current) return;
    if (muted) { p.unMute(); p.setVolume(volume); }
    else p.mute();
    setMuted(!muted);
  };

  const elapsed = progress * duration;

  return (
    <>
      {/* Hidden YT player */}
      <div
        aria-hidden="true"
        style={{ position: 'fixed', width: 1, height: 1, opacity: 0, pointerEvents: 'none', bottom: 0, left: 0, zIndex: -1 }}
      >
        <div ref={containerRef} />
      </div>

      {/* Fullscreen overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex flex-col"
            style={{ background: 'var(--bg)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-center px-6 pt-6 pb-4">
              <span
                className="text-xs tracking-widest uppercase"
                style={{ color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)' }}
              >
                Aryan&apos;s Playlist
              </span>
            </div>

            {/* Main content */}
            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">

              {/* Left — now playing */}
              <div className="flex flex-col items-center justify-center gap-8 px-8 py-6 md:w-[55%]">
                {/* Art */}
                <motion.div
                  key={currentIndex}
                  initial={{ scale: 0.88, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="w-56 h-56 md:w-72 md:h-72 rounded-3xl flex items-center justify-center overflow-hidden"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    boxShadow: isPlaying ? '0 0 80px rgba(255,255,255,0.07)' : 'none',
                    transition: 'box-shadow 0.5s ease',
                  }}
                >
                  {song?.thumbnail
                    ? <img src={song.thumbnail} alt={song.title} className="w-full h-full object-cover rounded-3xl" />
                    : <Music2 size={64} style={{ color: 'var(--text-subtle)' }} />
                  }
                </motion.div>

                {/* Song info */}
                <motion.div
                  key={`info-${currentIndex}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-syne)', color: 'var(--text)' }}>
                    {song?.title ?? 'No song'}
                  </h2>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{song?.artist ?? ''}</p>
                </motion.div>

                {/* Progress bar */}
                <div className="w-full max-w-sm flex flex-col gap-2">
                  <div
                    className="w-full h-1.5 rounded-full cursor-pointer group relative"
                    style={{ background: 'var(--bg-surface)' }}
                    onClick={seek}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${progress * 100}%`, background: 'var(--accent)', transition: 'width 0.3s linear' }}
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ left: `calc(${progress * 100}% - 6px)`, background: 'var(--accent)' }}
                    />
                  </div>
                  <div className="flex justify-between text-xs" style={{ color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)' }}>
                    <span>{fmt(elapsed)}</span>
                    <span>{fmt(duration)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-8">
                  <button onClick={goPrev} className="transition-opacity hover:opacity-60" style={{ color: 'var(--text-muted)' }}>
                    <SkipBack size={22} />
                  </button>
                  <button
                    onClick={togglePlay}
                    className="w-14 h-14 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
                    style={{ background: 'var(--text)', color: 'var(--bg)' }}
                  >
                    {isPlaying ? <Pause size={22} /> : <Play size={22} style={{ marginLeft: 2 }} />}
                  </button>
                  <button onClick={goNext} className="transition-opacity hover:opacity-60" style={{ color: 'var(--text-muted)' }}>
                    <SkipForward size={22} />
                  </button>
                </div>

                {/* Volume */}
                <div className="flex items-center gap-3 w-full max-w-sm">
                  <button onClick={toggleMute} style={{ color: 'var(--text-subtle)' }}>
                    {muted || volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
                  </button>
                  <div
                    className="flex-1 h-1 rounded-full cursor-pointer"
                    style={{ background: 'var(--bg-surface)' }}
                    onClick={changeVolume}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${muted ? 0 : volume}%`, background: 'var(--text-subtle)' }}
                    />
                  </div>
                </div>
              </div>

              {/* Right — queue */}
              <div className="md:w-[45%] flex flex-col overflow-hidden" style={{ borderLeft: '1px solid var(--border)' }}>
                <p
                  className="px-6 py-4 text-xs tracking-widest uppercase"
                  style={{ color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)', borderBottom: '1px solid var(--border)' }}
                >
                  Queue — {musicPlaylist.length} songs
                </p>
                <div className="overflow-y-auto flex-1">
                  {musicPlaylist.map((track, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className="w-full flex items-center gap-4 px-6 py-3.5 text-left transition-colors hover:bg-[var(--bg-surface)]"
                      style={{
                        background: i === currentIndex ? 'var(--bg-card)' : 'transparent',
                        borderBottom: '1px solid var(--border)',
                      }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
                        style={{
                          background: i === currentIndex ? 'var(--accent)' : 'var(--bg-surface)',
                          color: i === currentIndex ? 'var(--bg)' : 'var(--text-subtle)',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        {i === currentIndex && isPlaying ? '▶' : i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: i === currentIndex ? 'var(--accent)' : 'var(--text)' }}>
                          {track.title}
                        </p>
                        <p className="text-xs truncate" style={{ color: 'var(--text-subtle)' }}>{track.artist}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              className="fixed bottom-8 right-8 flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all hover:opacity-70"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
              }}
            >
              <X size={14} /> Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      {!open && (
        <motion.button
          onClick={() => setOpen(true)}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            backdropFilter: 'blur(12px)',
          }}
          aria-label="Open music player"
        >
          <span className="relative flex items-center justify-center w-4 h-4">
            {isPlaying && (
              <span
                className="absolute inline-flex w-full h-full rounded-full animate-ping opacity-40"
                style={{ background: 'var(--accent)' }}
              />
            )}
            {isPlaying
              ? <Pause size={14} style={{ color: 'var(--accent)' }} />
              : <Music2 size={14} style={{ color: 'var(--text-muted)' }} />
            }
          </span>
          <span style={{ color: isPlaying ? 'var(--accent)' : 'var(--text-muted)' }}>
            {isPlaying ? 'Playing' : 'Music'}
          </span>
        </motion.button>
      )}
    </>
  );
}