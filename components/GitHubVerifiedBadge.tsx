'use client';

interface GitHubVerifiedBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  title?: string;
}

export default function GitHubVerifiedBadge({
  className = '',
  size = 'md',
  title = 'GitHub Verified Developer'
}: GitHubVerifiedBadgeProps) {
  // Dimension presets
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-4.5 h-4.5 sm:w-5 sm:h-5',
    lg: 'w-6 h-6 sm:w-7 sm:h-7'
  };

  const finalClass = className || sizeClasses[size] || sizeClasses.md;

  return (
    <span
      className="inline-flex items-center justify-center flex-shrink-0 relative select-none group/ghbadge"
      title={title}
      aria-label={title}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${finalClass} transition-transform duration-200 group-hover/ghbadge:scale-110 drop-shadow-[0_1px_4px_rgba(37,99,235,0.35)]`}
      >
        <defs>
          {/* Subtle Glow Filter for Cyber / High-Tech Vibe */}
          <filter id="ghVerifiedGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="0.8" floodColor="#2563eb" floodOpacity="0.5" />
          </filter>
          {/* Radial Gradient for the verified tick badge */}
          <linearGradient id="tickBadgeGrad" x1="12" y1="12" x2="23" y2="23" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00C2FF" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
        </defs>

        {/* 1. Official GitHub Octocat Invertocat Silhouette */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.8 1.5C5.39 1.5 1 5.89 1 11.3c0 4.33 2.81 8 6.7 9.3.49.09.67-.21.67-.47 0-.23-.01-.85-.01-1.67-2.72.59-3.3-1.31-3.3-1.31-.44-1.13-1.09-1.43-1.09-1.43-.89-.61.07-.6.07-.6.98.07 1.5 1.01 1.5 1.01.87 1.5 2.29 1.06 2.85.81.09-.63.34-1.06.62-1.31-2.17-.25-4.46-1.09-4.46-4.84 0-1.07.38-1.94 1-2.63-.1-.25-.43-1.24.1-2.59 0 0 .82-.26 2.69 1a9.35 9.35 0 012.45-.33c.83.01 1.67.11 2.45.33 1.87-1.26 2.69-1 2.69-1 .53 1.35.2 2.34.1 2.59.63.69 1 1.56 1 2.63 0 3.76-2.29 4.59-4.47 4.83.35.3.66.9.66 1.81 0 1.31-.01 2.37-.01 2.69 0 .26.18.57.67.47A10.84 10.84 0 0020.6 11.3C20.6 5.89 16.21 1.5 10.8 1.5z"
          className="fill-slate-900 dark:fill-white transition-colors"
        />

        {/* 2. Embedded Verified Checkmark Shield / Disc (Bottom-Right) */}
        <circle
          cx="17.2"
          cy="17.2"
          r="5.8"
          fill="url(#tickBadgeGrad)"
          className="stroke-white dark:stroke-[#090b14]"
          strokeWidth="1.8"
          filter="url(#ghVerifiedGlow)"
        />

        {/* 3. High-Contrast Verification Checkmark */}
        <path
          d="M14.9 17.2L16.5 18.8L19.5 15.5"
          stroke="#FFFFFF"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
