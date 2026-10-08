'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function BackgroundAnimation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Git Branch Network Nodes (Autonomous, smooth, serene drift)
    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      isCommit: boolean;
      pulsePhase: number;
    }

    const colors = ['#00C2FF', '#2563EB', '#38BDF8', '#6366F1', '#10B981'];
    const nodeCount = Math.min(48, Math.floor((width * height) / 25000));
    const nodes: Node[] = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.38,
        vy: (Math.random() - 0.5) * 0.38,
        radius: Math.random() * 2.2 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        isCommit: Math.random() > 0.45,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    // Floating Code Cubes (Mini GitHub commit squares gently rising upwards)
    interface Cube {
      x: number;
      y: number;
      size: number;
      vy: number;
      color: string;
      opacity: number;
    }
    const cubeColors = ['#10B981', '#06B6D4', '#3B82F6', '#8B5CF6'];
    const cubes: Cube[] = [];
    for (let i = 0; i < 20; i++) {
      cubes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 6 + 4,
        vy: -(Math.random() * 0.25 + 0.12),
        color: cubeColors[Math.floor(Math.random() * cubeColors.length)],
        opacity: Math.random() * 0.28 + 0.08,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const isDark = document.documentElement.classList.contains('dark');

      // 1. Render Floating Code Cubes
      for (const cube of cubes) {
        cube.y += cube.vy;
        if (cube.y < -20) {
          cube.y = height + 20;
          cube.x = Math.random() * width;
        }

        ctx.save();
        ctx.fillStyle = cube.color;
        ctx.globalAlpha = isDark ? cube.opacity : cube.opacity * 0.65;
        ctx.shadowColor = cube.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.roundRect(cube.x, cube.y, cube.size, cube.size, 2);
        ctx.fill();
        ctx.restore();
      }

      // 2. Connect Git Branch Nodes with Laser Strands (Distance based, purely autonomous)
      const maxDistance = 140;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * (isDark ? 0.32 : 0.2);
            ctx.save();
            ctx.strokeStyle = isDark ? '#38BDF8' : '#2563EB';
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 1.1;

            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      // 3. Update and Render Nodes
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;

        // Wrap around boundaries smoothly
        if (node.x < 0) node.x = width;
        if (node.x > width) node.x = 0;
        if (node.y < 0) node.y = height;
        if (node.y > height) node.y = 0;

        node.pulsePhase += 0.025;
        const currentRadius = node.radius + Math.sin(node.pulsePhase) * 1.0;

        ctx.save();
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = node.isCommit ? 14 : 7;

        // Draw Node Core
        ctx.beginPath();
        ctx.arc(node.x, node.y, Math.max(1, currentRadius), 0, Math.PI * 2);
        ctx.fill();

        // Pulsating Git Commit Radar Ring
        if (node.isCommit) {
          ctx.strokeStyle = node.color;
          ctx.lineWidth = 1.1;
          ctx.globalAlpha = isDark ? 0.35 : 0.2;
          ctx.beginPath();
          ctx.arc(node.x, node.y, currentRadius + 4, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Run once on mount: Zero re-renders on mouse movement!

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* Vibrant Ambient Mesh Auroras (Calm, organic pulsing) */}
      <div className="absolute -top-28 left-[15%] w-[680px] h-[520px] rounded-full bg-gradient-to-tr from-blue-600/18 dark:from-blue-600/28 via-indigo-600/12 dark:via-indigo-600/18 to-transparent blur-[140px] animate-[pulse_10s_ease-in-out_infinite]" />
      <div className="absolute top-[32%] -right-20 w-[620px] h-[560px] rounded-full bg-gradient-to-bl from-cyan-400/20 dark:from-cyan-400/24 via-blue-600/12 to-transparent blur-[140px] animate-[pulse_12s_ease-in-out_infinite_2s]" />
      <div className="absolute -bottom-24 left-[22%] w-[580px] h-[480px] rounded-full bg-gradient-to-tr from-indigo-500/15 dark:from-purple-600/18 via-blue-600/10 to-transparent blur-[130px] animate-[pulse_14s_ease-in-out_infinite_4s]" />

      {/* Subtle High-Tech Cyber Grid */}
      <div className="absolute inset-0 cyber-grid opacity-35 dark:opacity-20" />

      {/* Interactive HTML5 Canvas: Pure Autonomous Live Git Graph Network */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Floating GitHub Animation Image: Top-Right Iconic Octocat Silhouette Watermark */}
      <motion.div
        animate={{
          y: [-16, 16, -16],
          rotate: [-2.5, 2.5, -2.5],
          scale: [0.98, 1.02, 0.98],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-[18%] -right-10 sm:right-6 md:right-12 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 opacity-[0.07] dark:opacity-[0.09] pointer-events-none z-0"
      >
        <svg
          viewBox="0 0 98 96"
          fill="none"
          className="w-full h-full drop-shadow-[0_0_40px_rgba(59,130,246,0.3)]"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="octocat-gradient-tr" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
          </defs>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            fill="url(#octocat-gradient-tr)"
            d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
          />
        </svg>
      </motion.div>

      {/* Floating GitHub Animation Image: Bottom-Left Balanced Secondary Silhouette */}
      <motion.div
        animate={{
          y: [14, -14, 14],
          rotate: [2, -2, 2],
          scale: [1.02, 0.98, 1.02],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        className="absolute bottom-[16%] -left-8 sm:left-4 md:left-8 w-52 sm:w-64 md:w-72 h-52 sm:h-64 md:h-72 opacity-[0.05] dark:opacity-[0.07] pointer-events-none z-0"
      >
        <svg
          viewBox="0 0 98 96"
          fill="none"
          className="w-full h-full drop-shadow-[0_0_35px_rgba(6,182,212,0.25)]"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="octocat-gradient-bl" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="60%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            fill="url(#octocat-gradient-bl)"
            d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
          />
        </svg>
      </motion.div>
    </div>
  );
}
