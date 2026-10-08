'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon, Volume2, VolumeX } from 'lucide-react';
import { playClickSound, toggleMute, getIsMuted } from '@/lib/sound';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.55 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

interface NavbarProps {
  onHomeClick?: () => void;
}

export default function Navbar({ onHomeClick }: NavbarProps) {
  const [isDark, setIsDark] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Initialize Theme
    const storedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    if (storedTheme === 'light') {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
    setIsMuted(getIsMuted());
  }, []);

  const handleToggleAudio = () => {
    const nextMuted = toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      playClickSound();
    }
  };

  const handleToggleTheme = () => {
    playClickSound();
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const handleHome = () => {
    playClickSound();
    if (onHomeClick) onHomeClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-3 sm:top-4 z-50 w-full max-w-6xl mx-auto px-4 sm:px-6 pointer-events-none">
      <nav className="flex items-center justify-between w-full py-1">
        {/* Left Side: GitHub Star Icon Button */}
        <div className="flex items-center justify-start pointer-events-auto">
          <a
            href="https://github.com/iprceations/GitVibeAI"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl border border-white/80 dark:border-white/10 hover:border-blue-500/60 dark:hover:border-cyan-400/60 hover:bg-white dark:hover:bg-zinc-850 text-slate-800 dark:text-zinc-200 shadow-[0_4px_20px_rgba(59,130,246,0.1)] dark:shadow-[0_4px_25px_rgba(0,0,0,0.6)] hover:shadow-[0_6px_25px_rgba(59,130,246,0.25)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
            title="Star on GitHub ★"
            aria-label="Star GitVibeAI on GitHub"
          >
            <GithubIcon className="w-5 h-5 text-slate-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[10px] text-zinc-950 font-black shadow-sm leading-none ring-2 ring-white dark:ring-zinc-900">
              ★
            </span>
          </a>
        </div>

        {/* Right Side: Sound FX Toggle & Day / Night Mode Switcher */}
        <div className="flex items-center justify-end gap-2.5 pointer-events-auto">
          {/* Audio Mute/Unmute */}
          <button
            onClick={handleToggleAudio}
            className="group inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl border border-white/80 dark:border-white/10 hover:border-blue-500/60 dark:hover:border-cyan-400/60 hover:bg-white dark:hover:bg-zinc-850 text-slate-800 dark:text-zinc-200 shadow-[0_4px_20px_rgba(59,130,246,0.1)] dark:shadow-[0_4px_25px_rgba(0,0,0,0.6)] hover:shadow-[0_6px_25px_rgba(59,130,246,0.25)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
            title={isMuted ? "Unmute Sound Effects" : "Mute Sound Effects"}
            aria-label="Toggle Sound Effects"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-slate-400 dark:text-zinc-500 group-hover:text-rose-500 transition-colors" />
            ) : (
              <Volume2 className="w-5 h-5 text-blue-600 dark:text-cyan-400 group-hover:scale-110 transition-transform" />
            )}
          </button>

          {/* Theme Switcher */}
          <button
            onClick={handleToggleTheme}
            className="group inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl border border-white/80 dark:border-white/10 hover:border-blue-500/60 dark:hover:border-cyan-400/60 hover:bg-white dark:hover:bg-zinc-850 text-slate-800 dark:text-zinc-200 shadow-[0_4px_20px_rgba(59,130,246,0.1)] dark:shadow-[0_4px_25px_rgba(0,0,0,0.6)] hover:shadow-[0_6px_25px_rgba(59,130,246,0.25)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
            title={isDark ? "Switch to Day Mode (Light)" : "Switch to Night Mode (Dark)"}
            aria-label="Toggle Theme"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
            ) : (
              <Moon className="w-5 h-5 text-blue-600 group-hover:-rotate-12 transition-transform duration-300" />
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}
