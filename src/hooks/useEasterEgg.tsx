import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

const TRIGGERS = ['aryan', 'prabhudesai', 'prabs','claude'];

export function useEasterEgg() {
  const bufferRef = useRef('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Only care about single printable characters
      if (e.key.length !== 1) return;

      bufferRef.current = (bufferRef.current + e.key.toLowerCase()).slice(-20);

      const matched = TRIGGERS.some(trigger => bufferRef.current.endsWith(trigger));
      if (!matched) return;

      bufferRef.current = '';

      // Big burst from the bottom
      confetti({
        particleCount: 180,
        spread: 100,
        origin: { x: 0.5, y: 0.9 },
        colors: ['#ffffff', '#aaaaaa', '#555555', '#F0A050', '#7850DC'],
        startVelocity: 55,
        ticks: 200,
      });

      // Two side cannons with a slight delay
      setTimeout(() => {
        confetti({ particleCount: 80, angle: 60,  spread: 55, origin: { x: 0, y: 0.7 } });
        confetti({ particleCount: 80, angle: 120, spread: 55, origin: { x: 1, y: 0.7 } });
      }, 150);
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
}