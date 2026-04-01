'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { Terminal } from 'lucide-react';

const GRID_SIZE = 20;
const TILE_SIZE = 20; // 20x20 grid = 400x400 canvas
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 }; // Start moving up

export default function NotFound() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 15, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Generate random food position
  const spawnFood = useCallback((currentSnake: { x: number, y: number }[]) => {
    // THE FIX: Explicitly typing the object so Vercel's strict build passes
    let newFood: { x: number; y: number }; 
    
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Make sure food doesn't spawn on the snake
      const onSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    setFood(newFood);
  }, []);

  // Main Game Loop
  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake;
        const newHead = { x: head.x + direction.x, y: head.y + direction.y };

        // 1. Check Collisions (Walls)
        if (
          newHead.x < 0 || 
          newHead.x >= GRID_SIZE || 
          newHead.y < 0 || 
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // 2. Check Collisions (Self)
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // 3. Check Food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          spawnFood(newSnake);
          // Don't pop the tail so it grows
        } else {
          newSnake.pop(); // Remove tail if no food eaten
        }

        return newSnake;
      });
    };

    const gameInterval = setInterval(moveSnake, 100); // Speed of the snake
    return () => clearInterval(gameInterval);
  }, [direction, food, gameOver, isPaused, spawnFood]);

  // Keyboard Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling when using arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (gameOver && e.key === 'Enter') {
        resetGame();
        return;
      }

      setDirection((prev) => {
        switch (e.key) {
          case 'ArrowUp':
          case 'w':
            return prev.y === 1 ? prev : { x: 0, y: -1 };
          case 'ArrowDown':
          case 's':
            return prev.y === -1 ? prev : { x: 0, y: 1 };
          case 'ArrowLeft':
          case 'a':
            return prev.x === 1 ? prev : { x: -1, y: 0 };
          case 'ArrowRight':
          case 'd':
            return prev.x === -1 ? prev : { x: 1, y: 0 };
          case ' ':
            setIsPaused(p => !p);
            return prev;
          default:
            return prev;
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  // High Score Tracker
  useEffect(() => {
    if (gameOver && score > highScore) {
      setHighScore(score);
    }
  }, [gameOver, score, highScore]);

  // Render to Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'; // Matches dark mode cards
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid (Optional, makes it look more technical)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    for (let i = 0; i <= canvas.width; i += TILE_SIZE) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
    }

    // Draw Food
    ctx.fillStyle = 'var(--accent)'; // Uses your site's accent color
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'var(--accent)';
    ctx.fillRect(food.x * TILE_SIZE + 2, food.y * TILE_SIZE + 2, TILE_SIZE - 4, TILE_SIZE - 4);
    ctx.shadowBlur = 0; // Reset shadow

    // Draw Snake
    snake.forEach((segment, index) => {
      // Head is white, body is gray
      ctx.fillStyle = index === 0 ? '#ffffff' : '#a1a1aa';
      ctx.fillRect(segment.x * TILE_SIZE + 1, segment.y * TILE_SIZE + 1, TILE_SIZE - 2, TILE_SIZE - 2);
    });

  }, [snake, food]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    spawnFood(INITIAL_SNAKE);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-8">
        <p className="text-[var(--accent)] font-mono text-sm tracking-widest uppercase mb-4 flex items-center justify-center gap-2">
          <Terminal size={16} /> Error 404
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4" style={{ fontFamily: 'var(--font-syne)' }}>
          Page not found.
        </h1>
        <p className="text-[var(--text-muted)] max-w-md mx-auto">
          You've ventured into the void. While you're here, you might as well play a round of Snake before heading back.
        </p>
      </div>

      {/* The Game Console */}
      <div className="relative bg-[var(--bg-card)] border border-[var(--border)] p-4 rounded-3xl shadow-2xl">
        <div className="flex justify-between items-center mb-4 px-2 font-mono text-xs text-[var(--text-subtle)] uppercase tracking-wider">
          <span>Score: <span className="text-white font-bold">{score}</span></span>
          <span>High Score: <span className="text-[var(--accent)] font-bold">{highScore}</span></span>
        </div>

        <div className="relative rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          <canvas 
            ref={canvasRef} 
            width={GRID_SIZE * TILE_SIZE} 
            height={GRID_SIZE * TILE_SIZE}
            className="block cursor-crosshair"
          />

          {/* Game Over / Paused Overlays */}
          {(gameOver || isPaused) && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
              <h3 className="text-2xl font-bold text-white mb-2 font-mono">
                {gameOver ? 'GAME OVER' : 'PAUSED'}
              </h3>
              {gameOver && (
                <button 
                  onClick={resetGame}
                  className="px-6 py-2 mt-2 bg-[var(--accent)] text-black font-bold text-sm uppercase tracking-widest rounded-full hover:scale-105 transition-transform"
                >
                  Play Again
                </button>
              )}
            </div>
          )}
        </div>

        <p className="text-[10px] text-[var(--text-subtle)] font-mono text-center mt-4">
          Use W A S D or Arrow Keys to move. Space to pause.
        </p>
      </div>

      <div className="mt-12">
        <Link 
          href="/" 
          className="text-sm font-semibold text-[var(--text-muted)] hover:text-white transition-colors border-b border-transparent hover:border-white pb-1"
        >
          ← Back to Reality
        </Link>
      </div>
    </div>
  );
}