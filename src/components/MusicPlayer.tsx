'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music2, ChevronDown } from 'lucide-react';
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

interface MusicPlayerProps {
  open: boolean;
  onClose: () => void;
  isPlaying: boolean;
  setIsPlaying: (v: boolean) => void;
  currentIndex: number;
  setCurrentIndex: (i: number) => void;
  playerReady: boolean;
  setPlayerReady: (v: boolean) => void;
  playerRef: React.MutableRefObject<any>;
  apiLoaded: React.MutableRefObject<boolean>;
}

export default function MusicPlayer({
  open, onClose,
  isPlaying, setIsPlaying,
  currentIndex, setCurrentIndex,
  playerReady, setPlayerReady,
  playerRef, apiLoaded,
}: MusicPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [muted, setMuted] = useState(false);
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const song = musicPlaylist[currentIndex];
  const videoId = song ? extractVideoId(song.url) : null;

  // Load YT API once
  useEffect(() => {
    if (apiLoaded.current) return;
    const existing = document.querySelector('script[src*="youtube.com/iframe_api"]');
    if (!existing) {
      const s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(s);
    }
    apiLoaded.current = true;
  }, [apiLoaded]);

  // Init player
  useEffect(() => {
    if (!containerRef.current) return;

    const init = () => {
      if (playerRef.current?.destroy) playerRef.current.destroy();
      playerRef.current = new window.YT.Player(containerRef.current!, {
        videoId: videoId ?? '',
        playerVars: { autoplay: 0, controls: 0, modestbranding: 1, rel: 0, origin: window.location.origin },
        events: {
          onReady: () => {
            setPlayerReady(true);
            playerRef.current.setVolume(volume);
          },
          onStateChange: (e: any) => {
            // 1 = playing, 2 = paused, 0 = ended
            if (e.data === 1) {
              setIsPlaying(true);
              setDuration(playerRef.current.getDuration());
              startProgress();
            } else if (e.data === 2) {
              setIsPlaying(false);
              stopProgress();
            } else if (e.data === 0) {
              // Auto advance
              goNext();
            }
          },
        },
      });
    };

    if (window.YT?.Player) {
      init();
    } else {
      window.onYouTubeIframeAPIReady = init;
    }

    return () => stopProgress();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When song changes, load new video
  useEffect(() => {
    if (!playerReady || !playerRef.current || !videoId) return;
    playerRef.current.loadVideoById(videoId);
    setProgress(0);
  }, [currentIndex, videoId, playerReady, playerRef]);

  const startProgress = () => {
    stopProgress();
    progressInterval.current = setInterval(() => {
      if (!playerRef.current) return;
      const t = playerRef.current.getCurrentTime?.() ?? 0;
      const d = playerRef.current.getDuration?.() ?? 0;
      setProgress(d > 0 ? t / d : 0);
      setDuration(d);
    }, 500);
  };

  const stopProgress = () => {
    if (progressInterval.current) clearInterval(progressInterval.current);
  };

  const togglePlay = () => {
    if (!playerReady) return;
    if (isPlaying) playerRef.current.pauseVideo();
    else playerRef.current.playVideo();
  };

  const goPrev = () => setCurrentIndex((currentIndex - 1 + musicPlaylist.length) % musicPlaylist.length);
  const goNext = useCallback(() => setCurrentIndex((currentIndex + 1) % musicPlaylist.length), [currentIndex, setCurrentIndex]);

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!playerReady) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    playerRef.current.seekTo(ratio * duration, true);
    setProgress(ratio);
  };

  const changeVolume = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const v = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    setVolume(v);
    setMuted(false);
    if (playerReady) playerRef.current.setVolume(v);
  };

  const toggleMute = () => {
    if (!playerReady) return;
    if (muted) { playerRef.current.unMute(); playerRef.current.setVolume(volume); }
    else playerRef.current.mute();
    setMuted(!muted);
  };

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const elapsed = progress * duration;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[200] flex flex-col"
          style={{ background: 'var(--bg)' }}
        >
          {/* Hidden YT iframe */}
          <div
            aria-hidden="true"
            style={{ position: 'fixed', width: 1, height: 1, opacity: 0, pointerEvents: 'none', bottom: 0, left: 0 }}
          >
            <div ref={containerRef} />
          </div>

          {/* Top bar */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-sm transition-opacity hover:opacity-60"
              style={{ color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)' }}
            >
              <ChevronDown size={16} /> Close
            </button>
            <span
              className="text-xs tracking-widest uppercase"
              style={{ color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)' }}
            >
              Aryan's Playlist
            </span>
            <div style={{ width: 60 }} />
          </div>

          {/* Main content */}
          <div className="flex flex-col md:flex-row flex-1 overflow-hidden gap-0">

            {/* Left — now playing */}
            <div className="flex flex-col items-center justify-center gap-8 px-8 py-6 md:w-[55%]">

              {/* Album art placeholder */}
              <motion.div
                key={currentIndex}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-56 h-56 md:w-72 md:h-72 rounded-3xl flex items-center justify-center shadow-2xl"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  boxShadow: isPlaying ? '0 0 80px rgba(255,255,255,0.07)' : 'none',
                  transition: 'box-shadow 0.5s ease',
                }}
              >
                {song?.thumbnail ? (
                  <img src={song.thumbnail} alt={song.title} className="w-full h-full object-cover rounded-3xl" />
                ) : (
                  <Music2 size={64} style={{ color: 'var(--text-subtle)' }} />
                )}
              </motion.div>

              {/* Song info */}
              <motion.div
                key={`info-${currentIndex}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <h2
                  className="text-2xl font-bold mb-1"
                  style={{ fontFamily: 'var(--font-syne)', color: 'var(--text)' }}
                >
                  {song?.title ?? 'No song selected'}
                </h2>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  {song?.artist ?? ''}
                </p>
              </motion.div>

              {/* Progress bar */}
              <div className="w-full max-w-sm flex flex-col gap-2">
                <div
                  className="w-full h-1.5 rounded-full cursor-pointer group relative"
                  style={{ background: 'var(--bg-surface)' }}
                  onClick={seek}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${progress * 100}%`, background: 'var(--accent)' }}
                  />
                  {/* Scrubber dot */}
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
                  className="flex-1 h-1 rounded-full cursor-pointer group relative"
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
            <div
              className="md:w-[45%] flex flex-col overflow-hidden"
              style={{ borderLeft: '1px solid var(--border)' }}
            >
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
                      <p
                        className="text-sm font-medium truncate"
                        style={{ color: i === currentIndex ? 'var(--accent)' : 'var(--text)' }}
                      >
                        {track.title}
                      </p>
                      <p className="text-xs truncate" style={{ color: 'var(--text-subtle)' }}>
                        {track.artist}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}