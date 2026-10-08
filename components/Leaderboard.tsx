'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  Heart,
  History,
  Search,
  X,
  Trophy,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Cpu,
  Radar,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playClickSound, playUpvoteSound, playRadarBeep } from '@/lib/sound';
import GitHubVerifiedBadge from './GitHubVerifiedBadge';

interface LeaderboardProps {
  onSelectUser: (username: string) => void;
  triggerRefresh: boolean;
}

export default function Leaderboard({ onSelectUser, triggerRefresh }: LeaderboardProps) {
  const [tab, setTab] = useState<'leaderboard' | 'recent'>('leaderboard');
  const [roasts, setRoasts] = useState<any[]>([]);
  
  // Search States
  const [searchInput, setSearchInput] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanPercent, setScanPercent] = useState(0);

  // Pagination States for Recent Victims (grows dynamically up to 100 pages)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(12);
  const [jumpPageInput, setJumpPageInput] = useState('');

  // UI States
  const [isLoading, setIsLoading] = useState(true);
  const [votedIds, setVotedIds] = useState<Record<string, boolean>>({});

  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch data
  const fetchRoasts = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      if (tab === 'leaderboard') {
        const res = await fetch('/api/leaderboard');
        if (res.ok) {
          const data = await res.json();
          let list = data.roasts || [];
          if (submittedQuery.trim()) {
            const q = submittedQuery.trim().toLowerCase();
            list = list.filter((r: any) =>
              (r.username || '').toLowerCase().includes(q) ||
              (r.name || '').toLowerCase().includes(q) ||
              (r.vibeType || '').toLowerCase().includes(q)
            );
          }
          setRoasts(list);
        }
      } else {
        // Recent Victims (Paginated with 100 pages)
        const queryParams = new URLSearchParams({
          page: currentPage.toString(),
          limit: '12',
          search: submittedQuery.trim()
        });
        const res = await fetch(`/api/recent?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setRoasts(data.roasts || []);
          if (typeof data.totalPages === 'number') setTotalPages(data.totalPages);
          if (typeof data.total === 'number') setTotalEntries(data.total);
          if (typeof data.page === 'number') setCurrentPage(data.page);
        }
      }
    } catch (err) {
      console.error('[GitVibeAI] Failed to fetch leaderboard or recent roasts:', err);
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, [tab, currentPage, submittedQuery]);

  // Initial and trigger-based fetch
  useEffect(() => {
    fetchRoasts();
  }, [fetchRoasts, triggerRefresh]);

  // Auto-refresh interval (every 10s) to keep dynamic changes in sync
  useEffect(() => {
    const autoRefreshTimer = setInterval(() => {
      // Silently refresh without showing loading spinner
      fetchRoasts(true);
    }, 10000);

    return () => clearInterval(autoRefreshTimer);
  }, [fetchRoasts]);

  // Handle Search Execution with Scanning % Progress Animation
  const handleExecuteSearch = (queryToSearch: string) => {
    const clean = queryToSearch.trim();
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);

    if (!clean) {
      setSubmittedQuery('');
      setIsScanning(false);
      setScanPercent(0);
      return;
    }

    setIsScanning(true);
    setScanPercent(0);
    playRadarBeep();

    let cur = 0;
    scanIntervalRef.current = setInterval(() => {
      cur += Math.floor(Math.random() * 22) + 14;
      if (cur >= 100) {
        cur = 100;
        setScanPercent(100);
        if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
        
        setTimeout(() => {
          setSubmittedQuery(clean);
          setCurrentPage(1); // Reset to page 1 on new search
          setIsScanning(false);
        }, 180);
      } else {
        setScanPercent(cur);
      }
    }, 45);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSubmittedQuery('');
    setIsScanning(false);
    setScanPercent(0);
    playClickSound();
  };

  // Upvote Handler
  const handleVote = async (username: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (votedIds[username]) return;

    playUpvoteSound();
    setVotedIds((prev) => ({ ...prev, [username]: true }));

    const rect = e.currentTarget.getBoundingClientRect();
    confetti({
      particleCount: 28,
      spread: 45,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: rect.top / window.innerHeight,
      },
      colors: ['#2563eb', '#06b6d4', '#6366f1', '#f43f5e', '#fbbf24'],
    });

    // Optimistic UI update + instant dynamic rank resort if in leaderboard tab
    setRoasts((prev) => {
      const updated = prev.map((r) =>
        r.username === username ? { ...r, likes: (r.likes || 0) + 1 } : r
      );
      if (tab === 'leaderboard') {
        return [...updated].sort((a, b) => (b.likes || 0) - (a.likes || 0));
      }
      return updated;
    });

    try {
      await fetch('/api/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
    } catch (err) {
      console.error('[GitVibeAI] Failed to upvote:', err);
    }
  };

  // Active roasts
  const filteredRoasts = roasts;

  // Pagination navigation helper
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    playClickSound();
    setCurrentPage(newPage);
    const arenaEl = document.getElementById('humiliation-hub');
    if (arenaEl) {
      arenaEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  // Direct Page Jump
  const handleJumpPage = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(jumpPageInput.trim(), 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= totalPages) {
      handlePageChange(parsed);
      setJumpPageInput('');
    }
  };

  // Generate pagination numbers (window of pages)
  const getVisiblePages = () => {
    const delta = 2;
    const range: (number | string)[] = [];
    const left = Math.max(1, currentPage - delta);
    const right = Math.min(totalPages, currentPage + delta);

    if (left > 1) {
      range.push(1);
      if (left > 2) range.push('...');
    }

    for (let i = left; i <= right; i++) {
      range.push(i);
    }

    if (right < totalPages) {
      if (right < totalPages - 1) range.push('...');
      range.push(totalPages);
    }

    return range;
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 px-4" id="humiliation-hub">
      {/* Top Header Controls: Switcher & Live Search (Symmetrically Matched) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        {/* Tab Switcher */}
        <div className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border border-slate-200/90 dark:border-white/10 p-1.5 rounded-2xl flex gap-1 shadow-sm dark:shadow-md">
          <button
            onClick={() => {
              playClickSound();
              setTab('leaderboard');
              setCurrentPage(1);
            }}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all duration-300 cursor-pointer flex items-center gap-2 ${
              tab === 'leaderboard'
                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-[0_4px_20px_rgba(37,99,235,0.35)]'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-white/5'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
            <span>Top Humiliations</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setTab('recent');
            }}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all duration-300 cursor-pointer flex items-center gap-2 ${
              tab === 'recent'
                ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white shadow-[0_4px_20px_rgba(99,102,241,0.35)]'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-white/5'
            }`}
          >
            <History className="w-4 h-4 text-cyan-200 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
            <span>Recent Victims</span>
          </button>
        </div>

        {/* Live Search Bar (Matching Left Tab Switcher in Size, Height, Border-Radius & Icon Dimensions) */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleExecuteSearch(searchInput);
          }}
          className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border border-slate-200/90 dark:border-white/10 p-1.5 rounded-2xl shadow-sm dark:shadow-md flex items-center gap-1.5 w-full sm:w-72 md:w-80 transition-all focus-within:border-blue-500/60 dark:focus-within:border-cyan-400/60 focus-within:ring-2 focus-within:ring-blue-500/20"
        >
          <div className="relative flex-1 flex items-center pl-3">
            <Search className="w-4 h-4 text-blue-500 dark:text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)] shrink-0 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by username..."
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                if (!e.target.value) {
                  handleClearSearch();
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleExecuteSearch(searchInput);
                }
              }}
              className="w-full bg-transparent pl-2.5 pr-2 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none font-mono"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer mr-1"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="submit"
            className="px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white font-mono text-xs sm:text-sm font-black uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-[0_2px_12px_rgba(37,99,235,0.35)] cursor-pointer flex-shrink-0 flex items-center gap-1.5"
          >
            <span>Scan</span>
          </button>
        </form>
      </div>

      {/* High-Tech Animated % Scanning Progress HUD */}
      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full overflow-hidden"
          >
            <div className="bg-blue-500/10 dark:bg-cyan-500/10 border border-blue-500/30 dark:border-cyan-500/30 rounded-2xl p-3.5 backdrop-blur-xl shadow-lg">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-blue-600 dark:text-cyan-400 mb-2">
                <div className="flex items-center gap-2">
                  <Radar className="w-4 h-4 animate-spin text-blue-500 dark:text-cyan-400" />
                  <span>SCANNING REGISTRY FOR @{searchInput}...</span>
                </div>
                <div className="flex items-center gap-1.5 font-black text-sm">
                  <span>{scanPercent}%</span>
                  <span className="text-[10px] text-slate-400 uppercase">PROCESSED</span>
                </div>
              </div>
              {/* Animated Glowing Progress Bar */}
              <div className="w-full h-2 rounded-full bg-blue-900/20 dark:bg-zinc-800 overflow-hidden relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.8)]"
                  style={{ width: `${scanPercent}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cyber Glassmorphic Humiliation Arena Container */}
      <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-b from-blue-500/30 via-indigo-500/15 to-cyan-500/25 shadow-[0_12px_48px_rgba(37,99,235,0.08)] dark:shadow-[0_12px_48px_rgba(0,0,0,0.6)] backdrop-blur-3xl">
        <div className="bg-white/75 dark:bg-[#090b14]/80 backdrop-blur-2xl border border-white/80 dark:border-white/10 rounded-[23px] p-4 sm:p-6 min-h-[380px] relative overflow-hidden shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]">
          {/* Subtle Ambient Backlights */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 cyber-grid opacity-15 pointer-events-none" />

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4 relative z-10">
              <div className="w-10 h-10 border-3 border-blue-500 border-t-cyan-400 rounded-full animate-spin shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
              <p className="text-blue-600 dark:text-cyan-400 font-mono text-xs tracking-wider font-semibold">
                RETRIEVING HUMILIATION ARCHIVES...
              </p>
            </div>
          ) : filteredRoasts.length === 0 ? (
            /* ANIMATED NOT FOUND STATE WITH SICK RADAR PULSE + INSTANT ROAST ACTION */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center py-16 sm:py-20 text-center space-y-6 relative z-10"
            >
              {/* Rotating Cyber Radar Scanner Graphic */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
                {/* Outer pulsing ring */}
                <div className="absolute inset-0 rounded-full border border-rose-500/30 dark:border-rose-400/20 animate-ping opacity-40" />
                {/* Middle dashed radar boundary */}
                <div className="absolute inset-2 rounded-full border border-dashed border-cyan-500/40 dark:border-cyan-400/30 animate-[spin_10s_linear_infinite]" />
                {/* Inner radar crosshair ring */}
                <div className="absolute inset-5 rounded-full border border-blue-500/40 dark:border-blue-400/30" />
                {/* Sweeping radar scanner needle */}
                <div className="absolute inset-0 rounded-full overflow-hidden flex items-center justify-center">
                  <div className="w-1/2 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-rose-500 origin-left animate-[spin_2.5s_linear_infinite] shadow-[0_0_12px_rgba(244,63,94,0.8)]" />
                </div>
                {/* Center target lock badge */}
                <div className="relative z-10 w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center text-white shadow-[0_0_24px_rgba(244,63,94,0.5)]">
                  <Flame className="w-6 h-6 animate-pulse" />
                </div>
              </div>

              {/* Text Info */}
              <div className="space-y-2 max-w-md mx-auto">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span>TARGET UNROASTED • ZERO SINS RECORDED</span>
                </div>
                <h3 className="text-slate-900 dark:text-white font-black text-xl sm:text-2xl tracking-tight">
                  {submittedQuery ? (
                    <>
                      <span className="text-rose-500">@{submittedQuery}</span> Has Escaped Judgment!
                    </>
                  ) : (
                    'No Developers Found in Filter'
                  )}
                </h3>
                <p className="text-slate-500 dark:text-zinc-400 text-xs sm:text-sm font-mono leading-relaxed">
                  {submittedQuery
                    ? `This developer's ego is completely intact and their 0-star repos haven't faced AI reality check yet. Be the hero who breaks the silence!`
                    : 'Try clearing your category filter or searching by another GitHub username.'}
                </p>
              </div>

              {/* Direct CTA Button: Roast Them Right Now! */}
              {submittedQuery && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    playClickSound();
                    onSelectUser(submittedQuery);
                  }}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 via-rose-500 to-red-600 text-white font-extrabold text-sm flex items-center gap-2.5 shadow-[0_8px_30px_rgba(244,63,94,0.4)] hover:shadow-[0_12px_40px_rgba(244,63,94,0.6)] cursor-pointer transition-all border border-white/20"
                >
                  <Flame className="w-4 h-4 fill-white" />
                  <span>Roast @{submittedQuery} Live Now 🔥</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              )}
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                {filteredRoasts.map((roast, index) => {
                  const isLeader = tab === 'leaderboard';
                  const isRank1 = isLeader && index === 0;
                  const isRank2 = isLeader && index === 1;
                  const isRank3 = isLeader && index === 2;

                  // Compute display rank:
                  // For leaderboard: #1 to #12
                  // For recent: index + 1 + (currentPage - 1) * 12
                  const displayRankNumber = isLeader
                    ? index + 1
                    : (currentPage - 1) * 12 + index + 1;

                  return (
                    <motion.div
                      key={roast.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onClick={() => { playClickSound(); onSelectUser(roast.username); }}
                      className={`relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer group flex items-center justify-between gap-3 sm:gap-4 overflow-hidden backdrop-blur-xl ${
                        isRank1
                          ? 'bg-gradient-to-r from-amber-500/10 via-blue-500/5 to-cyan-500/5 dark:from-amber-500/15 dark:via-blue-950/40 dark:to-cyan-950/30 border-amber-400/60 dark:border-amber-400/40 shadow-[0_4px_24px_rgba(245,158,11,0.15)] hover:shadow-[0_8px_32px_rgba(59,130,246,0.22)] hover:border-amber-400'
                          : isRank2
                          ? 'bg-gradient-to-r from-cyan-500/10 via-white/50 to-blue-500/5 dark:from-cyan-500/15 dark:via-zinc-900/60 dark:to-blue-950/40 border-cyan-400/50 dark:border-cyan-400/30 shadow-[0_4px_20px_rgba(6,182,212,0.12)] hover:shadow-[0_8px_28px_rgba(6,182,212,0.2)] hover:border-cyan-400'
                          : isRank3
                          ? 'bg-gradient-to-r from-indigo-500/10 via-white/50 to-purple-500/5 dark:from-indigo-500/15 dark:via-zinc-900/60 dark:to-purple-950/40 border-indigo-400/50 dark:border-indigo-400/30 shadow-[0_4px_20px_rgba(99,102,241,0.12)] hover:shadow-[0_8px_28px_rgba(99,102,241,0.2)] hover:border-indigo-400'
                          : 'bg-white/65 dark:bg-zinc-900/40 border-slate-200/85 dark:border-white/10 hover:bg-white/95 dark:hover:bg-zinc-900/80 hover:border-blue-500/40 hover:shadow-[0_8px_24px_rgba(37,99,235,0.12)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]'
                      }`}
                    >
                      {/* Left Side: Rank Number + Avatar + Details */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {/* Consistent Rank Number (#1, #2, #3, #4, #5, #6...) */}
                        <div className="flex-shrink-0 flex items-center justify-center w-7 sm:w-8">
                          <span
                            className={`font-mono font-black text-sm sm:text-base ${
                              isRank1
                                ? 'text-amber-500 dark:text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                                : isRank2
                                ? 'text-cyan-600 dark:text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]'
                                : isRank3
                                ? 'text-indigo-600 dark:text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]'
                                : 'text-slate-400 dark:text-zinc-500'
                            }`}
                          >
                            #{displayRankNumber}
                          </span>
                        </div>

                        {/* Avatar with cyber glow */}
                        <div className="relative flex-shrink-0">
                          <img
                            src={roastDataFallback(roast.avatarUrl, roast.username)}
                            alt={roast.username}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = `https://github.com/${roast.username}.png`;
                            }}
                            className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl border border-white/80 dark:border-white/10 bg-slate-100 dark:bg-zinc-950 object-cover group-hover:border-blue-500/60 dark:group-hover:border-cyan-400/60 group-hover:shadow-[0_0_12px_rgba(59,130,246,0.3)] transition-all"
                          />
                        </div>

                        {/* Text Info: Full Name + Verified on Row 1, Handle + Archetype on Row 2 */}
                        <div className="min-w-0 flex-1">
                          {/* Row 1: Full Developer Name + Verified Checkmark Badge */}
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span
                              className="font-black text-slate-900 dark:text-white text-sm sm:text-base group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors truncate"
                              title={roast.name || roast.username}
                            >
                              {roast.name || roast.username}
                            </span>
                            
                            {/* GitHub Verified Mixed Icon (GitHub Icon + Checkmark in One) */}
                            <GitHubVerifiedBadge size="sm" className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                          </div>

                          {/* Row 2: @handle + Archetype Title Glass Badge */}
                          <div className="flex items-center gap-2 mt-1 min-w-0 flex-wrap sm:flex-nowrap">
                            <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-mono flex-shrink-0">
                              @{roast.username}
                            </span>
                            <span
                              className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold bg-blue-500/10 dark:bg-cyan-500/10 border border-blue-500/20 dark:border-cyan-500/20 text-blue-600 dark:text-cyan-400 tracking-tight truncate max-w-[190px]"
                              title={roast.vibeType}
                            >
                              {roast.vibeType}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Side: Complexity Meter & Upvote Heart Button */}
                      <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
                        {/* Overengineering Complexity Meter */}
                        <div className="text-right hidden sm:flex flex-col items-end flex-shrink-0">
                          <span className="text-[9px] text-slate-400 dark:text-zinc-500 font-extrabold uppercase tracking-wider font-mono">
                            Complexity
                          </span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-xs font-mono font-black text-slate-800 dark:text-slate-200">
                              {roast.stats?.overEngineeringScore || 0}%
                            </span>
                            <div className="w-8 sm:w-10 h-1.5 rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                                style={{ width: `${Math.min(100, Math.max(8, roast.stats?.overEngineeringScore || 0))}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Upvote Heart Button */}
                        <button
                          onClick={(e) => handleVote(roast.username, e)}
                          disabled={votedIds[roast.username]}
                          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border font-bold text-xs cursor-pointer active:scale-95 transition-all shadow-sm ${
                            votedIds[roast.username]
                              ? 'bg-rose-500/15 border-rose-500/40 text-rose-500 dark:text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.25)]'
                              : 'bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md border-slate-200/90 dark:border-white/10 hover:border-rose-500/40 text-slate-600 dark:text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400 hover:shadow-sm'
                          }`}
                        >
                          <Heart
                            className={`w-3.5 h-3.5 transition-transform group-hover:scale-110 ${
                              votedIds[roast.username]
                                ? 'fill-rose-500 text-rose-500'
                                : 'text-slate-400 dark:text-zinc-500'
                            }`}
                          />
                          <span className="font-mono font-bold">{roast.likes || 0}</span>
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </AnimatePresence>
          )}

          {/* DYNAMIC PAGINATION CONTROLS (Only in Recent Victims tab, grows dynamically up to 100 pages) */}
          {tab === 'recent' && !isLoading && filteredRoasts.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
              {/* Left: Info stats badge */}
              <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-zinc-400">
                <span className="inline-block w-2 h-2 rounded-full bg-cyan-500" />
                <span>
                  {totalPages > 1 ? (
                    <>
                      Showing victims{' '}
                      <strong className="text-slate-900 dark:text-white">
                        {(currentPage - 1) * 12 + 1} - {Math.min(currentPage * 12, totalEntries)}
                      </strong>{' '}
                      of <strong className="text-slate-900 dark:text-white">{totalEntries}</strong> (Page{' '}
                      <span className="text-blue-600 dark:text-cyan-400 font-bold">{currentPage}</span> of{' '}
                      {totalPages})
                    </>
                  ) : (
                    <>
                      Showing{' '}
                      <strong className="text-slate-900 dark:text-white">{filteredRoasts.length}</strong>{' '}
                      recently roasted developer{filteredRoasts.length === 1 ? '' : 's'} (Page 1 of 1)
                    </>
                  )}
                </span>
              </div>

              {/* Center / Right: Navigation buttons & Direct jump (rendered when more than 1 page) */}
              {totalPages > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {/* First Page */}
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-zinc-900/60 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer text-slate-700 dark:text-zinc-300"
                    title="First Page (Page 1)"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </button>

                  {/* Prev Page */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-zinc-900/60 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer text-slate-700 dark:text-zinc-300"
                    title="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Visible Page Numbers */}
                  <div className="flex items-center gap-1">
                    {getVisiblePages().map((p, idx) => {
                      if (p === '...') {
                        return (
                          <span key={`dots-${idx}`} className="px-2 text-xs font-mono text-slate-400">
                            ...
                          </span>
                        );
                      }
                      const num = p as number;
                      const isActive = num === currentPage;
                      return (
                        <button
                          key={num}
                          onClick={() => handlePageChange(num)}
                          className={`w-8 h-8 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                            isActive
                              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_2px_12px_rgba(37,99,235,0.4)]'
                              : 'bg-white/70 dark:bg-zinc-900/60 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-white/10'
                          }`}
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>

                  {/* Next Page */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-zinc-900/60 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer text-slate-700 dark:text-zinc-300"
                    title="Next Page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* Last Page */}
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-zinc-900/60 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer text-slate-700 dark:text-zinc-300"
                    title={`Last Page (Page ${totalPages})`}
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </button>

                  {/* Direct Page Jump Form */}
                  <form onSubmit={handleJumpPage} className="flex items-center gap-1.5 ml-2">
                    <span className="text-[11px] font-mono text-slate-400">Jump:</span>
                    <input
                      type="number"
                      min={1}
                      max={totalPages}
                      value={jumpPageInput}
                      onChange={(e) => setJumpPageInput(e.target.value)}
                      placeholder={`1-${totalPages}`}
                      className="w-14 px-2 py-1 text-xs font-mono rounded-lg border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-zinc-900 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      className="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors cursor-pointer font-mono"
                    >
                      Go
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function roastDataFallback(url: string | null, username: string) {
  if (url) return url;
  if (username) return `https://github.com/${username}.png`;
  return `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80`;
}
