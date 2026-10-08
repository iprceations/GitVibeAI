'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, ShieldAlert, Sparkles, Terminal, Cpu, Zap, Code2, Bug, Coffee } from 'lucide-react';
import BackgroundAnimation from '@/components/BackgroundAnimation';
import Navbar from '@/components/Navbar';
import RoastForm from '@/components/RoastForm';
import RoastResult from '@/components/RoastResult';
import Leaderboard from '@/components/Leaderboard';
import { playClickSound } from '@/lib/sound';

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

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export default function Home() {
  const [roastData, setRoastData] = useState<any | null>(null);
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null);
  const [triggerLeaderboardRefresh, setTriggerRefresh] = useState(false);

  // Auto-fetch dossier if ?user=username is provided in URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const urlUser = searchParams.get('user') || searchParams.get('username');
      if (urlUser && urlUser.trim()) {
        handleSelectUserFromBoard(urlUser.trim());
      }
    }
  }, []);

  const handleRoastGenerated = (data: any) => {
    setRoastData(data);
    setTriggerRefresh((prev) => !prev);
  };

  const handleResetToHome = () => {
    setRoastData(null);
    setSelectedUsername(null);
  };

  const handleSelectUserFromBoard = async (username: string) => {
    setSelectedUsername(username);
    playClickSound();

    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });

      const res = await fetch('/api/roast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
      if (res.ok) {
        const data = await res.json();
        setRoastData(data);
        setTriggerRefresh((prev) => !prev);
      }
    } catch (err) {
      console.error('[GitVibeAI] Failed to fetch pre-existing roast:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#050508] text-slate-900 dark:text-zinc-100 flex flex-col font-sans selection:bg-blue-500/30 selection:text-white relative overflow-x-hidden transition-colors duration-300">
      {/* Living Cyber Background: Git Branch Graphs, Heatmap Pipeline, Particles & Floating Dev Badges */}
      <BackgroundAnimation />

      {/* Floating Glassmorphic Navbar with Home & Day/Night switcher */}
      <Navbar onHomeClick={handleResetToHome} />

      {/* Main Container */}
      <main className="flex-1 pt-1 sm:pt-2 md:pt-4 pb-12 md:pb-16 relative z-10 flex flex-col items-center justify-start space-y-8 md:space-y-12 max-w-7xl mx-auto w-full px-4">
        {/* Hero Header Section */}
        <div className="text-center space-y-5 sm:space-y-6 max-w-3xl mx-auto pt-0 -mt-2 sm:-mt-5 flex flex-col items-center">
          {/* Official Logo Feature for Day and Night */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="cursor-pointer group relative py-1 flex items-center justify-center"
            onClick={handleResetToHome}
            title="GitVibe AI — Reality Check Engine"
          >
            <img
              src="/logo-dark-transparent.png?v=trans1"
              alt="GitVibe AI"
              className="hidden dark:block h-16 sm:h-20 md:h-24 lg:h-28 w-auto max-w-[90vw] object-contain filter brightness-115 contrast-105 drop-shadow-[0_0_35px_rgba(59,130,246,0.45)] drop-shadow-[0_0_60px_rgba(99,102,241,0.25)] group-hover:scale-105 transition-transform duration-300"
            />
            <img
              src="/logo-light-transparent.png?v=trans1"
              alt="GitVibe AI"
              className="block dark:hidden h-16 sm:h-20 md:h-24 lg:h-28 w-auto max-w-[90vw] object-contain filter brightness-105 contrast-110 drop-shadow-[0_6px_24px_rgba(37,99,235,0.14)] group-hover:scale-105 transition-transform duration-300"
            />
          </motion.div>

          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border border-blue-500/30 px-4 py-1.5 rounded-full text-xs font-mono font-bold text-blue-600 dark:text-cyan-400 shadow-[0_4px_20px_rgba(59,130,246,0.15)]"
          >
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
            <span>AI ROAST ENGINE v2.5 • ZERO SUGARCOATING</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-zinc-900 dark:text-white leading-[1.1]"
          >
            Your Code Has Secrets.{' '}
            <span className="block mt-1 bg-gradient-to-r from-blue-500 via-indigo-400 to-cyan-400 bg-clip-text text-transparent filter drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]">
              We Expose Them.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto"
          >
            Get your GitHub profile and repositories savagely roasted by AI with zero sugarcoating.
            Let our neural engine evaluate your 0-star repos, overengineering, and questionable commit habits! 🌶️
          </motion.p>

          {/* Floating Tech Badges */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-2 pt-1"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-white/90 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 shadow-sm">
              <Code2 className="w-3.5 h-3.5 text-orange-500" />
              <span>Bio Lie-Detector</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-white/90 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 shadow-sm">
              <Bug className="w-3.5 h-3.5 text-amber-500" />
              <span>Bugs vs Features</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-white/90 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 shadow-sm">
              <Coffee className="w-3.5 h-3.5 text-red-500" />
              <span>Coffee-to-Code Ratio</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-white/90 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 shadow-sm">
              <Zap className="w-3.5 h-3.5 text-cyan-500" />
              <span>Yapper Index</span>
            </span>
          </motion.div>
        </div>

        {/* Dynamic Display: Interactive Form or Holographic Result Card */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            {!roastData ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <RoastForm onRoastGenerated={handleRoastGenerated} />
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <RoastResult
                  roastData={roastData}
                  onReset={handleResetToHome}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Social Leaderboard / Community Humiliation Hub */}
        <div className="w-full pt-10 md:pt-16 border-t border-zinc-200 dark:border-white/5 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-500/10 dark:bg-cyan-500/10 border border-blue-500/25 dark:border-cyan-500/25 text-blue-600 dark:text-cyan-400 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
              <span>COMMUNITY ARENA</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Humiliation Hub
            </h2>
            <p className="text-slate-600 dark:text-zinc-400 text-sm max-w-md mx-auto">
              Browse, upvote, and explore the most overengineered developers roasted by our AI engine.
            </p>
          </div>

          <Leaderboard
            onSelectUser={handleSelectUserFromBoard}
            triggerRefresh={triggerLeaderboardRefresh}
          />
        </div>
      </main>

      {/* Transparent Minimalist Footer */}
      <footer className="relative z-20 border-t border-slate-200/60 dark:border-white/5 bg-transparent py-10 px-4 mt-16 transition-colors">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 items-center gap-6 relative z-20">
          {/* Left: Brand Logo (Aligned to Left) */}
          <div className="flex items-center justify-center md:justify-start">
            <div
              className="cursor-pointer transition-transform hover:scale-105 active:scale-95 flex items-center"
              onClick={handleResetToHome}
              title="GitVibe AI — Return to Top"
            >
              <img
                src="/logo-dark-transparent.png?v=trans1"
                alt="GitVibe AI"
                className="hidden dark:block h-8 sm:h-9 w-auto object-contain drop-shadow-[0_0_12px_rgba(59,130,246,0.25)]"
              />
              <img
                src="/logo-light-transparent.png?v=trans1"
                alt="GitVibe AI"
                className="block dark:hidden h-8 sm:h-9 w-auto object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
              />
            </div>
          </div>

          {/* Middle: Developer Credit with Hidden Social Links */}
          <div className="flex items-center justify-center">
            <div className="inline-flex items-center gap-2.5 sm:gap-3 bg-white/75 dark:bg-zinc-900/70 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 hover:border-blue-500/40 px-4 py-2 rounded-full transition-all duration-300 text-xs font-mono text-slate-800 dark:text-zinc-300 shadow-sm hover:shadow-md">
              <span>
                Engineered by <strong className="text-slate-900 dark:text-white font-bold">Pushkar Sharma</strong>
              </span>

              <span className="text-slate-300 dark:text-zinc-700 select-none">|</span>

              <div className="flex items-center gap-2">
                {/* GitHub */}
                <a
                  href="https://github.com/iprceations"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-cyan-400 hover:scale-120 active:scale-95 transition-all p-0.5 flex items-center justify-center"
                  title="GitHub: @iprceations"
                  aria-label="GitHub Profile"
                >
                  <GithubIcon className="w-4 h-4" />
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com/iprcreations"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 dark:text-zinc-400 hover:text-pink-500 dark:hover:text-pink-400 hover:scale-120 active:scale-95 transition-all p-0.5 flex items-center justify-center"
                  title="Instagram: @iprcreations"
                  aria-label="Instagram Profile"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>

                {/* Facebook */}
                <a
                  href="https://facebook.com/iprcreations"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 dark:text-zinc-400 hover:text-[#1877F2] hover:scale-120 active:scale-95 transition-all p-0.5 flex items-center justify-center"
                  title="Facebook: @iprcreations"
                  aria-label="Facebook Profile"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Right: License & Tagline (Aligned to Right) */}
          <div className="flex items-center justify-center md:justify-end text-center md:text-right text-slate-500 dark:text-zinc-400 text-xs font-mono">
            <span>MIT Licensed • Built for developer laughs & reality checks</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
