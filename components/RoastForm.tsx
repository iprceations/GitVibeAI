'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Flame, Sparkles, X, Volume2, VolumeX, Skull, Terminal, Cpu, ShieldAlert, Zap, Sprout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { playClickSound, playSizzleSound, toggleMute, getIsMuted } from '@/lib/sound';

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

export type SpiceLevel = 'mild' | 'spicy' | 'nuclear';

interface RoastFormProps {
  onRoastGenerated: (roastData: any) => void;
}

const loadingSteps = [
  "Stalking public repositories & pinned projects...",
  "Analyzing bio for senior engineer buzzword inflation...",
  "Calculating the exact ratio of bio-yapping to real commits...",
  "Checking for commit messages like 'fix', 'pls work', and 'final final'...",
  "Auditing 0-star ghost repositories with zero sympathy...",
  "Consulting the AI Developer Tribunal for maximum savage feedback...",
  "Synthesizing customized high-voltage roast... 🔥"
];

const PRESET_USERS = [
  { label: 'Shikhar Thakur', username: 'shikharthakur2404', role: 'Pipeline Overlord', avatar: 'https://avatars.githubusercontent.com/u/89398121?v=4' },
  { label: 'Linus Torvalds', username: 'torvalds', role: 'Kernel God', avatar: 'https://avatars.githubusercontent.com/u/1024025?v=4' },
  { label: 'Dan Abramov', username: 'gaearon', role: 'React/Redux', avatar: 'https://avatars.githubusercontent.com/u/810438?v=4' },
  { label: 'Evan You', username: 'yyx990803', role: 'Vue/Vite', avatar: 'https://avatars.githubusercontent.com/u/499550?v=4' },
  { label: 'shadcn', username: 'shadcn', role: 'UI Wizard', avatar: 'https://avatars.githubusercontent.com/u/124599?v=4' },
];

export default function RoastForm({ onRoastGenerated }: RoastFormProps) {
  const [username, setUsername] = useState('');
  const [spiceLevel, setSpiceLevel] = useState<SpiceLevel>('spicy');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % loadingSteps.length);
      }, 2000);
    } else {
      setCurrentStep(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSelectPreset = (uname: string) => {
    playClickSound();
    setUsername(uname);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent, overrideUsername?: string) => {
    e.preventDefault();
    const targetUsername = (overrideUsername || username).trim();
    if (!targetUsername) return;

    playClickSound();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/roast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username: targetUsername,
          spiceLevel 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to roast profile. Try again!');
      }

      playSizzleSound();
      onRoastGenerated(data);
    } catch (err: any) {
      console.error('[GitVibeAI] Roast creation failed:', err);
      setError(err.message || 'Something went wrong. Is your username correct?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <AnimatePresence mode="wait">
        {!isLoading ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Cyber Terminal Window Card with Pure Glassmorphism & Logo Colors */}
            <div className="relative rounded-[32px] p-[1.5px] bg-gradient-to-b from-blue-500/40 via-indigo-500/20 to-cyan-400/30 dark:from-blue-500/50 dark:via-indigo-500/30 dark:to-cyan-400/40 shadow-[0_20px_60px_-15px_rgba(59,130,246,0.18)] dark:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.9)] backdrop-blur-3xl">
              <div className="bg-white/75 dark:bg-[#090b14]/80 backdrop-blur-2xl border border-white/80 dark:border-white/10 rounded-[30px] p-5 sm:p-7 md:p-8 space-y-6 relative overflow-hidden shadow-[inset_0_1px_2px_rgba(255,255,255,0.9)] dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.08)]">
                {/* Decorative Cyber Grid Background & Ambient Sheen */}
                <div className="absolute inset-0 cyber-grid opacity-25 dark:opacity-20 pointer-events-none" />
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-36 bg-gradient-to-b from-blue-500/15 via-cyan-400/10 to-transparent blur-3xl pointer-events-none" />

                {/* HUD Header bar */}
                <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/70 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500 inline-block shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                    <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <div className="ml-2 flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-500/10 dark:bg-blue-950/60 border border-blue-500/25 dark:border-cyan-500/30 shadow-xs backdrop-blur-md">
                      <Terminal className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                      <span className="text-xs font-mono font-bold text-blue-700 dark:text-cyan-300">ROAST_SCANNER_v2.5</span>
                    </div>
                  </div>

                  {/* Spice Level Selector with Glassmorphic Pills */}
                  <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-200/50 dark:bg-zinc-950/70 border border-white/60 dark:border-white/10 backdrop-blur-xl shadow-inner">
                    {/* Mild Button */}
                    <button
                      type="button"
                      onClick={() => { playClickSound(); setSpiceLevel('mild'); }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        spiceLevel === 'mild'
                          ? 'bg-white dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-400/50 dark:border-emerald-500/50 shadow-md dark:shadow-[0_0_15px_rgba(16,185,129,0.25)] font-black'
                          : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                      }`}
                    >
                      <Sprout className={`w-3.5 h-3.5 ${spiceLevel === 'mild' ? 'text-emerald-500 fill-emerald-500/20' : 'text-slate-400'}`} />
                      <span>Mild</span>
                    </button>

                    {/* Spicy Button (Matches Logo Electric Blue Palette) */}
                    <button
                      type="button"
                      onClick={() => { playClickSound(); setSpiceLevel('spicy'); }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        spiceLevel === 'spicy'
                          ? 'bg-white dark:bg-blue-950/70 text-blue-600 dark:text-cyan-300 border border-blue-400/60 dark:border-blue-500/50 shadow-md dark:shadow-[0_0_15px_rgba(59,130,246,0.3)] font-black'
                          : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                      }`}
                    >
                      <Flame className={`w-3.5 h-3.5 ${spiceLevel === 'spicy' ? 'text-blue-500 dark:text-cyan-400 fill-blue-500/20' : 'text-slate-400'}`} />
                      <span>Spicy</span>
                    </button>

                    {/* Nuclear Button */}
                    <button
                      type="button"
                      onClick={() => { playClickSound(); setSpiceLevel('nuclear'); }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        spiceLevel === 'nuclear'
                          ? 'bg-white dark:bg-red-950/70 text-rose-600 dark:text-rose-300 border border-rose-400/50 dark:border-rose-500/50 shadow-md dark:shadow-[0_0_15px_rgba(239,68,68,0.3)] font-black'
                          : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                      }`}
                    >
                      <Skull className={`w-3.5 h-3.5 ${spiceLevel === 'nuclear' ? 'text-rose-500 fill-rose-500/20' : 'text-slate-400'}`} />
                      <span>Nuclear</span>
                    </button>
                  </div>
                </div>

                {/* Input Field Form with Logo-Matching Electric Aura & Frosted Glass */}
                <form onSubmit={handleSubmit} className="relative group">
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600/30 via-indigo-600/25 to-cyan-400/30 dark:from-blue-600/50 dark:via-indigo-600/40 dark:to-cyan-400/50 blur-xl opacity-75 group-hover:opacity-100 transition duration-500" />

                  <div className="relative bg-white/90 dark:bg-zinc-950/85 backdrop-blur-2xl border-2 border-blue-500/35 dark:border-blue-400/35 focus-within:border-blue-600 dark:focus-within:border-cyan-400 rounded-2xl p-2 sm:p-2.5 flex items-center gap-2.5 shadow-[0_10px_35px_rgba(37,99,235,0.14)] dark:shadow-[0_10px_35px_rgba(0,0,0,0.6)] transition-all duration-300">
                    <div className="pl-3 sm:pl-4 text-blue-600 dark:text-cyan-400">
                      <GithubIcon className="w-6 h-6 transition-transform group-focus-within:scale-110" />
                    </div>

                    <input
                      type="text"
                      placeholder="Enter any GitHub username... (e.g. torvalds)"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="flex-1 bg-transparent border-0 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-0 py-3 text-sm sm:text-base md:text-lg font-mono font-medium outline-none"
                      disabled={isLoading}
                      autoComplete="off"
                      autoCapitalize="none"
                      spellCheck="false"
                    />

                    {username && (
                      <button
                        type="button"
                        onClick={() => setUsername('')}
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                        title="Clear input"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}

                    {/* Roast Me Button (Styled with GitVibeAI Logo Gradient & High Contrast) */}
                    <button
                      type="submit"
                      disabled={!username.trim()}
                      className="relative group/btn overflow-hidden text-white font-black px-7 sm:px-9 py-3.5 rounded-xl transition-all duration-300 flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-sm sm:text-base shadow-[0_8px_25px_rgba(37,99,235,0.4)] hover:shadow-[0_12px_35px_rgba(37,99,235,0.55)] active:scale-95 flex-shrink-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-400 border border-white/25"
                    >
                      <span className="relative z-10 tracking-wide font-extrabold drop-shadow-sm">Roast Me</span>
                      <Flame className="w-4 h-4 text-amber-300 fill-amber-300 group-hover/btn:scale-110 transition-transform relative z-10" />
                      <div className="absolute inset-0 bg-white/15 opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none" />
                    </button>
                  </div>
                </form>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-red-950/60 border border-red-800/80 rounded-xl p-3.5 text-red-300 text-center text-sm font-medium shadow-md flex items-center justify-center gap-2"
                  >
                    <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                {/* Preset Developer Chips with Frosted Glass & Better Legibility */}
                <div className="pt-2 border-t border-slate-200/70 dark:border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-zinc-400">
                    <span className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-zinc-200">
                      <Zap className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400 fill-blue-500/20" />
                      <span>One-Click Test Targets:</span>
                    </span>
                    <span className="text-[10px] text-slate-400 hidden sm:inline">Click to autofill</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                    {PRESET_USERS.map((preset) => (
                      <button
                        key={preset.username}
                        type="button"
                        onClick={() => handleSelectPreset(preset.username)}
                        className={`group p-2.5 rounded-2xl border transition-all text-left flex items-center gap-2.5 cursor-pointer backdrop-blur-xl ${
                          username.toLowerCase() === preset.username.toLowerCase()
                            ? 'bg-blue-500/15 dark:bg-blue-500/25 border-blue-500/70 dark:border-cyan-400 text-blue-700 dark:text-cyan-300 shadow-[0_0_20px_rgba(59,130,246,0.2)]'
                            : 'bg-white/80 dark:bg-zinc-900/60 border-slate-200/90 dark:border-white/10 hover:border-blue-500/50 hover:bg-blue-50/70 dark:hover:bg-blue-950/30 shadow-xs hover:shadow-sm'
                        }`}
                      >
                        <img
                          src={preset.avatar}
                          alt={preset.label}
                          className="w-8 h-8 rounded-xl border border-slate-200 dark:border-zinc-700/60 bg-slate-100 dark:bg-zinc-800 object-cover flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors leading-snug">
                            {preset.label}
                          </p>
                          <p className="text-[10px] font-mono text-slate-500 dark:text-zinc-400 truncate leading-snug">
                            {preset.role}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Cyber Scanning Loading Screen (Logo Themed Blue/Cyan Laser) */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative rounded-[32px] p-[1.5px] bg-gradient-to-b from-blue-500/40 via-cyan-400/30 to-indigo-500/20 shadow-[0_0_60px_rgba(59,130,246,0.3)] backdrop-blur-3xl"
          >
            <div className="bg-white/90 dark:bg-[#090b14]/95 backdrop-blur-2xl border border-white/80 dark:border-white/10 rounded-[30px] p-8 md:p-12 text-center space-y-6 relative overflow-hidden">
              {/* Laser scanner line effect */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent scanner-beam opacity-90" />
              <div className="absolute inset-0 cyber-grid-dense opacity-20 pointer-events-none" />

              {/* Hologram Scanner Circle */}
              <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-2xl animate-pulse" />
                <div className="absolute inset-2 rounded-full border-2 border-dashed border-cyan-400/50 animate-spin" style={{ animationDuration: '8s' }} />
                
                <motion.div
                  animate={{ 
                    scale: [1, 1.15, 1],
                    rotate: [0, 6, -6, 0]
                  }}
                  transition={{ 
                    repeat: Infinity,
                    duration: 1.6,
                    ease: "easeInOut"
                  }}
                  className="relative z-10 text-blue-500 dark:text-cyan-400"
                >
                  <Flame className="w-16 h-16 filter drop-shadow-[0_0_25px_rgba(59,130,246,0.8)]" />
                </motion.div>
              </div>

              <div className="space-y-2 max-w-lg mx-auto">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-slate-900 dark:bg-zinc-900 border border-slate-700 dark:border-zinc-800 text-cyan-400">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>ANALYZING @{username.toUpperCase()} • HEAT: {spiceLevel.toUpperCase()}</span>
                </div>

                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-wide">
                  Processing Developer Dossier
                </h3>

                <p className="text-slate-600 dark:text-zinc-400 text-sm font-mono min-h-[44px] transition-all duration-300">
                  {loadingSteps[currentStep]}
                </p>
              </div>

              {/* Progress HUD Bar */}
              <div className="w-full max-w-sm mx-auto space-y-1.5">
                <div className="flex justify-between text-[10px] font-mono text-slate-500 dark:text-zinc-400">
                  <span>NEURAL ROAST ENGINE</span>
                  <span>{Math.round(((currentStep + 1) / loadingSteps.length) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-zinc-950 rounded-full h-2 overflow-hidden border border-slate-300 dark:border-zinc-800">
                  <motion.div
                    initial={{ width: "5%" }}
                    animate={{ width: `${((currentStep + 1) / loadingSteps.length) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-400 rounded-full shadow-[0_0_12px_rgba(37,99,235,0.5)]"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
