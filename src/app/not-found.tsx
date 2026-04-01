'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

const CELL = 20;
const COLS = 20;
const ROWS = 20;
const TICK = 120;

type Point = { x: number; y: number };
type Dir = { x: number; y: number };

const rand = (n: number) => Math.floor(Math.random() * n);
const newFood = (snake: Point[]): Point => {
  let f: Point;
  do { f = { x: rand(COLS), y: rand(ROWS) }; }
  while (snake.some(s => s.x === f.x && s.y === f.y));
  return f;
};

export default function NotFound() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    snake: [{ x: 10, y: 10 }],
    dir: { x: 1, y: 0 } as Dir,
    nextDir: { x: 1, y: 0 } as Dir,
    food: { x: 15, y: 10 } as Point,
    score: 0,
    dead: false,
    started: false,
  });
  const [score, setScore] = useState(0);
  const [dead, setDead] = useState(false);
  const [started, setStarted] = useState(false);
  const tickRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const s = stateRef.current;

    // Background
    ctx.fillStyle = getComputedStyle(document.documentElement)
      .getPropertyValue('--bg').trim() || '#080808';
    ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);

    // Grid dots
    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    for (let x = 0; x < COLS; x++)
      for (let y = 0; y < ROWS; y++)
        ctx.fillRect(x * CELL + CELL / 2 - 1, y * CELL + CELL / 2 - 1, 2, 2);

    // Food
    const accent = getComputedStyle(document.documentElement)
      .getPropertyValue('--accent').trim() || '#F0F0F0';
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.roundRect(
      s.food.x * CELL + 4, s.food.y * CELL + 4,
      CELL - 8, CELL - 8, 3
    );
    ctx.fill();

    // Snake
    s.snake.forEach((seg, i) => {
      const alpha = i === 0 ? 1 : Math.max(0.25, 1 - i / s.snake.length);
      ctx.fillStyle = i === 0 ? accent : `rgba(255,255,255,${alpha * 0.5})`;
      ctx.beginPath();
      ctx.roundRect(
        seg.x * CELL + 2, seg.y * CELL + 2,
        CELL - 4, CELL - 4,
        i === 0 ? 5 : 3
      );
      ctx.fill();
    });
  }, []);

  const tick = useCallback(() => {
    const s = stateRef.current;
    if (s.dead || !s.started) return;

    s.dir = s.nextDir;
    const head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y };

    // Wall collision
    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
      s.dead = true; setDead(true); return;
    }
    // Self collision
    if (s.snake.some(seg => seg.x === head.x && seg.y === head.y)) {
      s.dead = true; setDead(true); return;
    }

    s.snake.unshift(head);
    if (head.x === s.food.x && head.y === s.food.y) {
      s.score++;
      setScore(s.score);
      s.food = newFood(s.snake);
    } else {
      s.snake.pop();
    }

    draw();
    tickRef.current = setTimeout(tick, TICK);
  }, [draw]);

  const start = useCallback(() => {
    const s = stateRef.current;
    s.snake = [{ x: 10, y: 10 }];
    s.dir = { x: 1, y: 0 };
    s.nextDir = { x: 1, y: 0 };
    s.food = { x: 15, y: 10 };
    s.score = 0;
    s.dead = false;
    s.started = true;
    setScore(0);
    setDead(false);
    setStarted(true);
    if (tickRef.current) clearTimeout(tickRef.current);
    tickRef.current = setTimeout(tick, TICK);
  }, [tick]);

  useEffect(() => {
    draw();
    const onKey = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (!s.started || s.dead) { if (e.key === 'Enter' || e.key === ' ') start(); return; }
      const map: Record<string, Dir> = {
        ArrowUp: { x: 0, y: -1 }, w: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 }, s: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 }, a: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 }, d: { x: 1, y: 0 },
      };
      const nd = map[e.key];
      if (!nd) return;
      // Prevent reversing
      if (nd.x !== -s.dir.x || nd.y !== -s.dir.y) s.nextDir = nd;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      if (tickRef.current) clearTimeout(tickRef.current);
    };
  }, [draw, start]);

  // Mobile swipe
  const touchStart = useRef<Point | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    const s = stateRef.current;
    if (!s.started || s.dead) { start(); return; }
    if (Math.abs(dx) > Math.abs(dy)) {
      const nd = dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 };
      if (nd.x !== -s.dir.x) s.nextDir = nd;
    } else {
      const nd = dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 };
      if (nd.y !== -s.dir.y) s.nextDir = nd;
    }
  };

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center gap-8 px-6"
      style={{ background: 'var(--bg)', fontFamily: 'var(--font-mono)' }}
    >
      {/* Header */}
      <div className="text-center">
        <p
          className="text-[11px] tracking-[0.2em] uppercase mb-3"
          style={{ color: 'var(--text-subtle)' }}
        >
          404 — Page not found
        </p>
        <h1
          className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2"
          style={{ fontFamily: 'var(--font-syne)', color: 'var(--text)' }}
        >
          Lost? Play Snake.
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Score: <span style={{ color: 'var(--accent)' }}>{score}</span>
        </p>
      </div>

      {/* Canvas */}
      <div className="relative" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <canvas
          ref={canvasRef}
          width={COLS * CELL}
          height={ROWS * CELL}
          className="rounded-2xl"
          style={{ border: '1px solid var(--border)', display: 'block' }}
        />

        {/* Overlay — start / game over */}
        {(!started || dead) && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl gap-3"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
          >
            {dead && (
              <p className="text-2xl font-bold" style={{ color: 'var(--text)', fontFamily: 'var(--font-syne)' }}>
                Score: {score}
              </p>
            )}
            <button
              onClick={start}
              className="btn-primary"
            >
              {dead ? 'Play again' : 'Start game'}
            </button>
            <p className="text-xs" style={{ color: 'var(--text-subtle)' }}>
              Arrow keys / WASD · Swipe on mobile
            </p>
          </div>
        )}
      </div>

      {/* Back home */}
      <a
        href="/"
        className="text-sm transition-opacity hover:opacity-60"
        style={{ color: 'var(--text-subtle)' }}
      >
        ← Back to home
      </a>
    </main>
  );
}