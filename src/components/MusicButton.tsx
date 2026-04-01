'use client';

import { useRef, useState } from 'react';
import { Music2, Pause, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MusicPlayer from './MusicPlayer';

export default function MusicButton() {
  const [open, setOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playerReady, setPlayerReady] = useState(false);
  const playerRef = useRef<any>(null);
  const apiLoaded = useRef(false);

  return (
    <>
      <MusicPlayer
        open={open}
        onClose={() => setOpen(false)}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        playerReady={playerReady}
        setPlayerReady={setPlayerReady}
        playerRef={playerRef}
        apiLoaded={apiLoaded}
      />

      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(true)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          color: 'var(--text)',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          backdropFilter: 'blur(12px)',
        }}
        aria-label="Open music player"
      >
        {/* Pulsing dot when playing */}
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
    </>
  );
}