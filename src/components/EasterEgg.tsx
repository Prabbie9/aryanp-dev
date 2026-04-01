'use client';

import { useEasterEgg } from '@/hooks/useEasterEgg';

export default function EasterEgg() {
  useEasterEgg();
  return null; // renders nothing, just runs the hook
}