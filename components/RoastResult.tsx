'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, Heart, Share2, Sparkles, Check, CheckCheck, 
  X, FileText, Image as ImageIcon, ChevronDown, Copy,
  Settings, Zap, Shield, Star
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playClickSound, playUpvoteSound } from '@/lib/sound';
import GitHubVerifiedBadge from './GitHubVerifiedBadge';

interface RoastResultProps {
  roastData: {
    username: string;
    name: string;
    avatarUrl: string;
    vibeType: string;
    roastText: string;
    secretSuperpower: string;
    defenseLevel: number;
    spiceLevel?: string;
    likes?: number;
    stats: {
      overEngineeringScore: number;
      yapperIndex: number;
      bugsToFeaturesRatio: string;
      favoriteLanguage: string;
      coffeeToCodeRatio: string;
    };
  };
  onReset: () => void;
}

export default function RoastResult({ roastData, onReset }: RoastResultProps) {
  const [likes, setLikes] = useState(roastData.likes || 0);

  useEffect(() => {
    setLikes(roastData.likes || 0);
  }, [roastData.username, roastData.likes]);
  const [isLiking, setIsLiking] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);

    playUpvoteSound();

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#2563eb', '#06b6d4', '#6366f1', '#f43f5e', '#fbbf24'],
    });

    try {
      const res = await fetch('/api/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: roastData.username }),
      });
      if (res.ok) {
        const data = await res.json();
        setLikes(data.likes);
      }
    } catch (err) {
      console.error('[GitVibeAI] Failed to register upvote:', err);
    } finally {
      setIsLiking(false);
    }
  };

  /**
   * Generates the authentic 1200x700 Holographic Developer Dossier on an HTML5 Canvas.
   * Matches the exact layout, colors, 3D holographic Octocat chip, stats, and typography.
   */
  const generateDossierCanvas = async (): Promise<HTMLCanvasElement> => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 700;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas 2D context');

    // Pre-load official brand logo
    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    await new Promise<void>((resolve) => {
      logoImg.onload = () => resolve();
      logoImg.onerror = () => resolve();
      logoImg.src = '/logo-dark-transparent.png?v=trans1';
    });

    // 1. Deep Midnight Cyberpunk Background
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 700);
    bgGrad.addColorStop(0, '#060814');
    bgGrad.addColorStop(0.5, '#0a0e24');
    bgGrad.addColorStop(1, '#04050b');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 700);

    // 2. Ambient Cyberpunk Radial Glows
    // High-energy cyan/blue glow behind 3D holographic badge on the right
    const glowRight = ctx.createRadialGradient(880, 290, 30, 880, 290, 480);
    glowRight.addColorStop(0, 'rgba(0, 180, 255, 0.42)');
    glowRight.addColorStop(0.5, 'rgba(37, 99, 235, 0.22)');
    glowRight.addColorStop(1, 'transparent');
    ctx.fillStyle = glowRight;
    ctx.fillRect(0, 0, 1200, 700);

    // Subtle violet glow on bottom-left
    const glowLeft = ctx.createRadialGradient(180, 480, 20, 180, 480, 400);
    glowLeft.addColorStop(0, 'rgba(124, 58, 237, 0.25)');
    glowLeft.addColorStop(1, 'transparent');
    ctx.fillStyle = glowLeft;
    ctx.fillRect(0, 0, 1200, 700);

    // 3. Futuristic Chamfered Cyber-Bracket Outer Border
    const pad = 36;
    const cut = 28;
    const x1 = pad, y1 = pad;
    const x2 = 1200 - pad, y2 = 700 - pad;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x1 + cut, y1);
    ctx.lineTo(x2 - cut, y1);
    ctx.lineTo(x2, y1 + cut);
    ctx.lineTo(x2, y2 - cut);
    ctx.lineTo(x2 - cut, y2);
    ctx.lineTo(x1 + cut, y2);
    ctx.lineTo(x1, y2 - cut);
    ctx.lineTo(x1, y1 + cut);
    ctx.closePath();

    const borderGrad = ctx.createLinearGradient(x1, y1, x2, y2);
    borderGrad.addColorStop(0, '#00C2FF');
    borderGrad.addColorStop(0.5, '#6366F1');
    borderGrad.addColorStop(1, '#A855F7');
    ctx.strokeStyle = borderGrad;
    ctx.lineWidth = 2.5;
    ctx.shadowColor = 'rgba(0, 194, 255, 0.5)';
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.restore();

    // Top-left cyber notch tick marks "//"
    ctx.save();
    ctx.strokeStyle = '#00C2FF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x1 + 6, y1 + 18);
    ctx.lineTo(x1 + 16, y1 + 8);
    ctx.moveTo(x1 + 14, y1 + 18);
    ctx.lineTo(x1 + 24, y1 + 8);
    ctx.stroke();
    ctx.restore();

    // 4. Header: GitVibeAI Logo & // HOLOGRAPHIC DEVELOPER DOSSIER
    let logoW = 150;
    const logoH = 46;
    if (logoImg.complete && logoImg.naturalWidth > 0) {
      logoW = Math.round((logoImg.naturalWidth / logoImg.naturalHeight) * logoH);
      ctx.save();
      ctx.shadowColor = 'rgba(0, 194, 255, 0.4)';
      ctx.shadowBlur = 14;
      ctx.drawImage(logoImg, 65, 55, logoW, logoH);
      ctx.restore();
    }

    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('// HOLOGRAPHIC DEVELOPER DOSSIER', 65 + logoW + 18, 83);

    // Top Right: PROFILE ANALYSIS & Cyan Slashes ///////
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('PROFILE ANALYSIS', 1135, 70);

    // 7 Cyan Diagonal Bars
    ctx.fillStyle = '#00C2FF';
    for (let i = 0; i < 7; i++) {
      ctx.fillRect(1065 + i * 10, 78, 6, 10);
    }
    ctx.textAlign = 'left';

    // 5. Left Column: Developer Profile Info
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('DEVELOPER PROFILE', 65, 138);

    // Developer Full Name
    const devName = roastData.name || roastData.username;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 38px sans-serif';
    ctx.fillText(devName, 65, 180);
    const devNameWidth = ctx.measureText(devName).width;

    // Verified Blue Badge Circle
    const badgeX = 65 + devNameWidth + 18;
    const badgeY = 168;
    const badgeR = 13;

    ctx.save();
    const badgeGrad = ctx.createLinearGradient(badgeX - 13, badgeY - 13, badgeX + 13, badgeY + 13);
    badgeGrad.addColorStop(0, '#00C2FF');
    badgeGrad.addColorStop(1, '#0066FF');
    ctx.fillStyle = badgeGrad;
    ctx.shadowColor = 'rgba(0, 102, 255, 0.6)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(badgeX, badgeY, badgeR, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Sharp White Checkmark
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(badgeX - 4.5, badgeY);
    ctx.lineTo(badgeX - 1, badgeY + 3.5);
    ctx.lineTo(badgeX + 5, badgeY - 4);
    ctx.stroke();
    ctx.restore();

    // Username & Cyan VERIFIED Box
    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px monospace';
    ctx.fillText(`@${roastData.username}`, 65, 215);
    const handleW = ctx.measureText(`@${roastData.username}`).width;

    const vBoxX = 65 + handleW + 14;
    const vBoxY = 200;
    ctx.save();
    ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
    ctx.fillRect(vBoxX, vBoxY, 78, 20);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
    ctx.lineWidth = 1;
    ctx.strokeRect(vBoxX, vBoxY, 78, 20);
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('VERIFIED', vBoxX + 14, vBoxY + 14);
    ctx.restore();

    // 6. Archetype Banner (Amber/Gold with Crown & Hatch Lines)
    const archBoxX = 65, archBoxY = 238, archBoxW = 490, archBoxH = 46;
    ctx.save();
    ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
    ctx.fillRect(archBoxX, archBoxY, archBoxW, archBoxH);
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.65)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(archBoxX, archBoxY, archBoxW, archBoxH);

    // Crown Icon
    ctx.fillStyle = '#f59e0b';
    ctx.font = '18px sans-serif';
    ctx.fillText('👑', archBoxX + 14, archBoxY + 30);

    // Archetype Text
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 17px sans-serif';
    ctx.fillText(`ARCHETYPE: ${roastData.vibeType}`, archBoxX + 44, archBoxY + 29);

    // Orange diagonal hatch bars on the right of banner
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
    ctx.lineWidth = 2.5;
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(archBoxX + archBoxW - 60 + i * 8, archBoxY + 12);
      ctx.lineTo(archBoxX + archBoxW - 66 + i * 8, archBoxY + archBoxH - 12);
      ctx.stroke();
    }
    ctx.restore();

    // 7. Roast Excerpt (Cyan Quote Mark + Italic Excerpt)
    ctx.save();
    ctx.fillStyle = '#00C2FF';
    ctx.font = 'bold 36px serif';
    ctx.fillText('“', 65, 328);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'italic 16px sans-serif';
    const cleanExcerpt = roastData.roastText.replace(/\n+/g, ' ');
    const maxLineLen = 64;
    const l1 = cleanExcerpt.slice(0, maxLineLen);
    const l2 = cleanExcerpt.slice(maxLineLen, maxLineLen * 2);
    const l3 = cleanExcerpt.slice(maxLineLen * 2, maxLineLen * 3) + '..."';

    ctx.fillText(`"${l1}`, 92, 320);
    ctx.fillText(l2, 92, 346);
    ctx.fillText(l3, 92, 372);
    ctx.restore();

    // 8. Right Column: 3D Holographic Floating Octocat Glass Plaque
    const plaqueX = 720;
    const plaqueY = 150;
    const plaqueW = 340;
    const plaqueH = 310;
    const plaqueR = 36;

    ctx.save();
    // Plaque Outer Glow
    ctx.shadowColor = 'rgba(0, 194, 255, 0.65)';
    ctx.shadowBlur = 35;

    // Plaque Body
    ctx.beginPath();
    ctx.roundRect(plaqueX, plaqueY, plaqueW, plaqueH, plaqueR);
    const plaqueGrad = ctx.createLinearGradient(plaqueX, plaqueY, plaqueX + plaqueW, plaqueY + plaqueH);
    plaqueGrad.addColorStop(0, '#0c1630');
    plaqueGrad.addColorStop(1, '#050a16');
    ctx.fillStyle = plaqueGrad;
    ctx.fill();

    // Plaque Neon Cyan Edge Rim
    ctx.strokeStyle = '#00C2FF';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();

    // Plaque Top Specular Highlight
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(plaqueX, plaqueY, plaqueW, plaqueH, plaqueR);
    ctx.clip();
    const shineGrad = ctx.createLinearGradient(plaqueX, plaqueY, plaqueX + plaqueW * 0.7, plaqueY + plaqueH * 0.7);
    shineGrad.addColorStop(0, 'rgba(255, 255, 255, 0.22)');
    shineGrad.addColorStop(0.3, 'rgba(0, 194, 255, 0.08)');
    shineGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = shineGrad;
    ctx.fillRect(plaqueX, plaqueY, plaqueW, plaqueH);
    ctx.restore();

    // 3D Glowing Octocat Silhouette inside Plaque
    const octoCenter = { x: plaqueX + plaqueW / 2, y: plaqueY + plaqueH / 2 };
    ctx.save();
    ctx.shadowColor = '#00C2FF';
    ctx.shadowBlur = 30;

    // Outer Neon Glow Ring
    ctx.strokeStyle = 'rgba(0, 194, 255, 0.75)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(octoCenter.x, octoCenter.y, 82, 0, Math.PI * 2);
    ctx.stroke();

    // Draw Octocat Stylized Silhouette
    const octoPath = new Path2D(
      'M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z'
    );
    ctx.translate(octoCenter.x - 58, octoCenter.y - 58);
    ctx.scale(1.2, 1.2);
    ctx.fillStyle = '#020617';
    ctx.fill(octoPath);
    ctx.strokeStyle = '#00C2FF';
    ctx.lineWidth = 2.5;
    ctx.stroke(octoPath);
    ctx.restore();

    // 9. Bottom Glass Stats Container
    const statsBoxX = 65, statsBoxY = 490, statsBoxW = 1070, statsBoxH = 115;
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(statsBoxX, statsBoxY, statsBoxW, statsBoxH, 20);
    ctx.fillStyle = 'rgba(8, 12, 24, 0.88)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    // Column 1: Over-Engineering
    drawStatCol(
      ctx,
      statsBoxX + 30,
      statsBoxY + 24,
      '⚙️',
      'OVER-ENGINEERING',
      `${roastData.stats.overEngineeringScore}%`,
      roastData.stats.overEngineeringScore,
      200
    );

    // Column 2: Yapper Index
    drawStatCol(
      ctx,
      statsBoxX + 295,
      statsBoxY + 24,
      '⚡',
      'YAPPER INDEX',
      `${roastData.stats.yapperIndex}%`,
      roastData.stats.yapperIndex,
      200
    );

    // Column 3: Defense Shield
    drawStatCol(
      ctx,
      statsBoxX + 560,
      statsBoxY + 24,
      '🛡️',
      'DEFENSE SHIELD',
      `${roastData.defenseLevel}%`,
      roastData.defenseLevel,
      200
    );

    // Column 4: Secret Superpower
    drawSuperpowerCol(
      ctx,
      statsBoxX + 825,
      statsBoxY + 24,
      '⭐',
      'SECRET SUPERPOWER',
      roastData.secretSuperpower
    );

    // 10. Watermark Footer: Sound Equalizer & Produced by GitVibe AI Engine
    ctx.save();
    // Sound wave icon
    ctx.fillStyle = '#00C2FF';
    ctx.fillRect(65, 638, 3, 14);
    ctx.fillRect(72, 634, 3, 22);
    ctx.fillRect(79, 640, 3, 10);
    ctx.fillRect(86, 636, 3, 18);

    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('PRODUCED BY GITVIBE AI ENGINE', 100, 648);

    // Right side: Slashes & 2026
    ctx.fillStyle = '#00C2FF';
    for (let i = 0; i < 6; i++) {
      ctx.fillRect(1040 + i * 8, 642, 4, 8);
    }
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('2026', 1100, 648);
    ctx.restore();

    return canvas;
  };

  /**
   * Helper to draw a stat column with circular icon badge and glowing progress bar
   */
  function drawStatCol(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    icon: string,
    label: string,
    val: string,
    percentage: number,
    barW: number
  ) {
    // Circular Blue Icon Badge
    ctx.save();
    ctx.beginPath();
    ctx.arc(x + 18, y + 18, 18, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 102, 255, 0.2)';
    ctx.fill();
    ctx.strokeStyle = '#0066FF';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '16px sans-serif';
    ctx.fillText(icon, x + 9, y + 23);

    // Label
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 10px monospace';
    ctx.fillText(label, x + 44, y + 14);

    // Value
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText(val, x + 44, y + 42);

    // Glowing Progress Bar
    const trackY = y + 54;
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(x, trackY, barW, 6, 3);
    ctx.fill();

    const fillW = Math.max(8, (percentage / 100) * barW);
    const progGrad = ctx.createLinearGradient(x, trackY, x + fillW, trackY);
    progGrad.addColorStop(0, '#f59e0b');
    progGrad.addColorStop(1, '#ff6b00');
    ctx.fillStyle = progGrad;
    ctx.shadowColor = '#ff6b00';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.roundRect(x, trackY, fillW, 6, 3);
    ctx.fill();
    ctx.restore();
  }

  function drawSuperpowerCol(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    icon: string,
    label: string,
    power: string
  ) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x + 18, y + 18, 18, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 102, 255, 0.2)';
    ctx.fill();
    ctx.strokeStyle = '#0066FF';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '16px sans-serif';
    ctx.fillText(icon, x + 9, y + 23);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 10px monospace';
    ctx.fillText(label, x + 44, y + 14);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 13px sans-serif';
    const cleanPower = power.length > 25 ? power.slice(0, 24) + '...' : power;
    ctx.fillText(cleanPower, x + 44, y + 36);
    ctx.restore();
  }

  /**
   * PDF Generator: Creates a valid PDF 1.4 document containing the full high-res landscape card.
   */
  const canvasToPdfBlob = (canvas: HTMLCanvasElement): Blob => {
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    const base64Data = dataUrl.split(',')[1];
    const binaryString = atob(base64Data);
    const jpegBytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      jpegBytes[i] = binaryString.charCodeAt(i);
    }

    const w = canvas.width;
    const h = canvas.height;

    const header = `%PDF-1.4\n`;
    const obj1 = `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`;
    const obj2 = `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n`;
    const obj3 = `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${w} ${h}] /Resources << /XObject << /Im1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`;
    const obj4Header = `4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${w} /Height ${h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`;
    const obj4Footer = `\nendstream\nendobj\n`;
    const contentStream = `q\n${w} 0 0 ${h} 0 0 cm\n/Im1 Do\nQ\n`;
    const obj5 = `5 0 obj\n<< /Length ${contentStream.length} >>\nstream\n${contentStream}endstream\nendobj\n`;

    const enc = new TextEncoder();
    const headerBytes = enc.encode(header);
    const obj1Bytes = enc.encode(obj1);
    const obj2Bytes = enc.encode(obj2);
    const obj3Bytes = enc.encode(obj3);
    const obj4HBytes = enc.encode(obj4Header);
    const obj4FBytes = enc.encode(obj4Footer);
    const obj5Bytes = enc.encode(obj5);

    const offset1 = headerBytes.length;
    const offset2 = offset1 + obj1Bytes.length;
    const offset3 = offset2 + obj2Bytes.length;
    const offset4 = offset3 + obj3Bytes.length;
    const offset5 = offset4 + obj4HBytes.length + jpegBytes.length + obj4FBytes.length;
    const xrefOffset = offset5 + obj5Bytes.length;

    const pad10 = (n: number) => n.toString().padStart(10, '0');
    const xref = `xref\n0 6\n0000000000 65535 f \n${pad10(offset1)} 00000 n \n${pad10(offset2)} 00000 n \n${pad10(offset3)} 00000 n \n${pad10(offset4)} 00000 n \n${pad10(offset5)} 00000 n \ntrailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
    const xrefBytes = enc.encode(xref);

    return new Blob([
      headerBytes,
      obj1Bytes,
      obj2Bytes,
      obj3Bytes,
      obj4HBytes,
      jpegBytes,
      obj4FBytes,
      obj5Bytes,
      xrefBytes
    ], { type: 'application/pdf' });
  };

  // --- Export Actions ---

  const handleDownload = async (format: 'png' | 'jpg' | 'pdf') => {
    playClickSound();
    setIsExporting(format);
    setShowDownloadMenu(false);

    try {
      const canvas = await generateDossierCanvas();
      const safeUsername = roastData.username.toLowerCase().replace(/[^a-z0-9_-]/g, '');

      if (format === 'png') {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `gitvibe-${safeUsername}-dossier.png`;
        link.click();
      } else if (format === 'jpg') {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/jpeg', 0.95);
        link.download = `gitvibe-${safeUsername}-dossier.jpg`;
        link.click();
      } else if (format === 'pdf') {
        const pdfBlob = canvasToPdfBlob(canvas);
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `gitvibe-${safeUsername}-certificate.pdf`;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 5000);
      }
    } catch (err) {
      console.error('[GitVibeAI] Failed to export card:', err);
    } finally {
      setIsExporting(null);
    }
  };

  // --- Social Media Share Actions ---

  const getShareUrl = () => {
    if (typeof window !== 'undefined' && window.location.origin) {
      return `${window.location.origin}/?user=${encodeURIComponent(roastData.username)}`;
    }
    return `https://gitvibeai.com/?user=${encodeURIComponent(roastData.username)}`;
  };

  const getShareText = () => {
    const targetUrl = getShareUrl();
    return `🔥 My GitHub profile was just roasted by GitVibeAI!
💀 Archetype: ${roastData.vibeType}
⚡ Over-Engineering: ${roastData.stats.overEngineeringScore}% | Yapper Index: ${roastData.stats.yapperIndex}%
🎯 Diagnosis: "${roastData.roastText.slice(0, 110)}..."

View my official Developer Dossier: ${targetUrl}
Created by @iprceations #GitVibeAI #GitHubRoast #DevHumor`;
  };

  const shareToTwitter = () => {
    playClickSound();
    const targetUrl = getShareUrl();
    const text = `🌶️ Just got my GitHub roasted by GitVibeAI!

Diagnosed as: "${roastData.vibeType}"
Over-Engineering: ${roastData.stats.overEngineeringScore}% | Yapper Index: ${roastData.stats.yapperIndex}%

Roast yours here:`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(targetUrl)}&hashtags=GitVibeAI,GitHubRoast,DevHumor`;
    window.open(url, '_blank');
  };

  const shareToLinkedIn = () => {
    playClickSound();
    const targetUrl = getShareUrl();
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(targetUrl)}`;
    window.open(url, '_blank');
  };

  const shareToWhatsApp = () => {
    playClickSound();
    const text = `${getShareText()}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const shareNativeOrImage = async () => {
    playClickSound();
    try {
      const canvas = await generateDossierCanvas();
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `gitvibe-${roastData.username}-dossier.png`, { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `GitVibeAI Developer Dossier: ${roastData.name || roastData.username}`,
            text: getShareText(),
            files: [file]
          });
        } else if (navigator.share) {
          await navigator.share({
            title: `GitVibeAI Developer Dossier: ${roastData.name || roastData.username}`,
            text: getShareText(),
            url: window.location.origin
          });
        } else {
          copyImageToClipboard();
        }
      }, 'image/png');
    } catch (err) {
      console.log('Native share canceled or unsupported', err);
    }
  };

  const copyImageToClipboard = async () => {
    playClickSound();
    try {
      const canvas = await generateDossierCanvas();
      canvas.toBlob(async (blob) => {
        if (blob && navigator.clipboard && window.ClipboardItem) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          setCopiedImage(true);
          setTimeout(() => setCopiedImage(false), 2500);
        }
      }, 'image/png');
    } catch (err) {
      console.warn('Direct image clipboard copy failed, copying text instead:', err);
      copyTextToClipboard();
    }
  };

  const copyTextToClipboard = () => {
    playClickSound();
    navigator.clipboard.writeText(getShareText());
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handleCutCard = () => {
    playClickSound();
    onReset();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 px-4">
      {/* Top Bar with Holographic Title & Cut Button */}
      <div className="flex items-center justify-between gap-4 bg-white/70 dark:bg-zinc-950/70 border border-slate-200/80 dark:border-white/10 px-5 py-3 rounded-2xl backdrop-blur-xl shadow-sm">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-700 dark:text-cyan-400">
          <Sparkles className="w-4 h-4 text-cyan-500 animate-pulse" />
          <span>CYBERNETIC DOSSIER CERTIFICATE GENERATED</span>
        </div>

        <button
          onClick={handleCutCard}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/25 transition-all cursor-pointer text-xs font-bold active:scale-95 shadow-sm"
          title="Close Card"
        >
          <X className="w-3.5 h-3.5" />
          <span>Close Dossier</span>
        </button>
      </div>

      {/* --- Live Holographic Dossier Card --- */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="relative rounded-3xl p-[2px] bg-gradient-to-br from-cyan-400 via-indigo-500 to-purple-600 shadow-[0_12px_48px_rgba(0,194,255,0.22)] dark:shadow-[0_12px_48px_rgba(0,0,0,0.85)] overflow-hidden"
      >
        <div className="relative rounded-[22px] bg-[#070914] text-white p-6 sm:p-8 md:p-10 overflow-hidden">
          {/* Ambient Cyber Glow Backlights */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

          {/* Chamfer Notches on Top Left */}
          <div className="absolute top-3 left-4 flex gap-1 pointer-events-none text-cyan-400/60 font-mono text-xs select-none">
            <span>//</span>
          </div>

          {/* Header Row */}
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <img
                src="/logo-dark-transparent.png?v=trans1"
                alt="GitVibe AI"
                className="h-9 sm:h-11 w-auto object-contain drop-shadow-[0_0_15px_rgba(0,194,255,0.4)]"
              />
              <span className="text-[11px] font-mono text-slate-400 hidden sm:inline tracking-wider">
                // HOLOGRAPHIC DEVELOPER DOSSIER
              </span>
            </div>

            <div className="text-right flex items-center sm:flex-col sm:items-end gap-2 sm:gap-1">
              <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider">
                PROFILE ANALYSIS
              </span>
              <div className="flex gap-1 text-cyan-400 text-xs font-mono font-black select-none">
                <span>///////</span>
              </div>
            </div>
          </div>

          {/* Main Body: Left Info + Right 3D Octocat Plaque */}
          <div className="relative z-10 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content (8 cols on lg) */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase block mb-1">
                  DEVELOPER PROFILE
                </span>

                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                    {roastData.name || roastData.username}
                  </h2>
                  {/* GitHub Verified Mixed Badge */}
                  <GitHubVerifiedBadge size="lg" className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>

                <div className="flex items-center gap-2 mt-1 font-mono text-xs text-slate-400">
                  <span>@{roastData.username}</span>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold">
                    VERIFIED
                  </span>
                </div>
              </div>

              {/* Archetype Banner Box */}
              <div className="relative rounded-xl border border-amber-500/50 bg-amber-500/10 p-3 flex items-center justify-between gap-3 overflow-hidden shadow-[0_0_20px_rgba(245,158,11,0.12)]">
                <div className="flex items-center gap-2 font-bold text-amber-400 text-sm sm:text-base">
                  <span className="text-lg">👑</span>
                  <span>ARCHETYPE: {roastData.vibeType}</span>
                </div>
                <div className="hidden sm:flex text-amber-500/40 font-mono text-xs select-none">
                  <span>//////</span>
                </div>
              </div>

              {/* Roast Excerpt Quote */}
              <div className="flex items-start gap-3 pt-2">
                <span className="text-3xl text-cyan-400 font-serif leading-none select-none">“</span>
                <p className="text-slate-300 text-xs sm:text-sm italic leading-relaxed whitespace-pre-line">
                  {roastData.roastText}
                </p>
              </div>
            </div>

            {/* Right 3D Holographic Octocat Plaque (5 cols on lg) */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-[32px] p-1 bg-gradient-to-br from-cyan-400/80 via-blue-600/40 to-indigo-900/80 shadow-[0_0_40px_rgba(0,194,255,0.35)] flex items-center justify-center">
                <div className="w-full h-full rounded-[30px] bg-gradient-to-br from-[#0c1630] to-[#050a16] relative overflow-hidden flex items-center justify-center border border-cyan-400/40">
                  {/* Glowing Specular Shine */}
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/15 via-transparent to-transparent pointer-events-none" />

                  {/* Neon Cyan Ambient Glow Behind Silhouette */}
                  <div className="absolute w-40 h-40 bg-cyan-400/30 rounded-full blur-2xl pointer-events-none" />

                  {/* Octocat 3D Silhouette */}
                  <svg
                    className="w-36 h-36 relative z-10 text-black drop-shadow-[0_0_20px_rgba(0,194,255,0.8)] filter"
                    viewBox="0 0 98 96"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Stats Container */}
          <div className="relative z-10 mt-6 bg-[#090d1a]/90 border border-white/10 rounded-2xl p-4 sm:p-5 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 backdrop-blur-md">
            {/* Stat 1: Over-Engineering */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center flex-shrink-0">
                  <Settings className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  OVER-ENGINEERING
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-amber-400">
                {roastData.stats.overEngineeringScore}%
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                  style={{ width: `${roastData.stats.overEngineeringScore}%` }}
                />
              </div>
            </div>

            {/* Stat 2: Yapper Index */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  YAPPER INDEX
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-amber-400">
                {roastData.stats.yapperIndex}%
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                  style={{ width: `${roastData.stats.yapperIndex}%` }}
                />
              </div>
            </div>

            {/* Stat 3: Defense Shield */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  DEFENSE SHIELD
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-amber-400">
                {roastData.defenseLevel}%
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                  style={{ width: `${roastData.defenseLevel}%` }}
                />
              </div>
            </div>

            {/* Stat 4: Secret Superpower */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center flex-shrink-0">
                  <Star className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  SECRET SUPERPOWER
                </span>
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-200 truncate pt-1" title={roastData.secretSuperpower}>
                {roastData.secretSuperpower}
              </div>
            </div>
          </div>

          {/* Card Footer Watermark */}
          <div className="relative z-10 mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5 items-end h-3 text-cyan-400">
                <span className="w-0.5 h-2 bg-cyan-400" />
                <span className="w-0.5 h-3 bg-cyan-400" />
                <span className="w-0.5 h-1.5 bg-cyan-400" />
                <span className="w-0.5 h-2.5 bg-cyan-400" />
              </div>
              <span>PRODUCED BY GITVIBE AI ENGINE</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-cyan-400">//////</span>
              <span>2026</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* --- Action Buttons: Download PDF/JPG/PNG + Social Sharing --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
        {/* 1. Download Options Dropdown / Group */}
        <div className="relative">
          <button
            onClick={() => { playClickSound(); setShowDownloadMenu(!showDownloadMenu); setShowShareMenu(false); }}
            disabled={isExporting !== null}
            className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black px-4 py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_24px_rgba(37,99,235,0.35)] active:scale-95 text-xs sm:text-sm disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? `Exporting ${isExporting.toUpperCase()}...` : 'Download Dossier'}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-80" />
          </button>

          <AnimatePresence>
            {showDownloadMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute left-0 bottom-full mb-2 w-full min-w-[200px] bg-white dark:bg-zinc-950 border border-slate-200 dark:border-white/10 rounded-2xl p-1.5 shadow-2xl backdrop-blur-2xl z-40 space-y-1"
              >
                <button
                  onClick={() => handleDownload('png')}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-800 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer text-left"
                >
                  <ImageIcon className="w-4 h-4 text-cyan-500" />
                  <div>
                    <div className="font-black">PNG Image</div>
                    <div className="text-[10px] text-slate-400 font-mono">Lossless High-Definition</div>
                  </div>
                </button>

                <button
                  onClick={() => handleDownload('jpg')}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-800 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer text-left"
                >
                  <ImageIcon className="w-4 h-4 text-blue-500" />
                  <div>
                    <div className="font-black">JPG Image</div>
                    <div className="text-[10px] text-slate-400 font-mono">Lightweight Photo Quality</div>
                  </div>
                </button>

                <button
                  onClick={() => handleDownload('pdf')}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-800 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer text-left"
                >
                  <FileText className="w-4 h-4 text-rose-500" />
                  <div>
                    <div className="font-black">PDF Certificate</div>
                    <div className="text-[10px] text-slate-400 font-mono">Printable Dossier Doc</div>
                  </div>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 2. Direct Social Share Dropdown */}
        <div className="relative">
          <button
            onClick={() => { playClickSound(); setShowShareMenu(!showShareMenu); setShowDownloadMenu(false); }}
            className="w-full bg-slate-900 dark:bg-white/10 hover:bg-slate-800 dark:hover:bg-white/15 text-white font-black px-4 py-3.5 rounded-2xl transition-all border border-slate-700 dark:border-white/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-xs sm:text-sm shadow-md"
          >
            <Share2 className="w-4 h-4 text-cyan-400" />
            <span>Share on Social</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-80" />
          </button>

          <AnimatePresence>
            {showShareMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute left-0 bottom-full mb-2 w-full min-w-[210px] bg-white dark:bg-zinc-950 border border-slate-200 dark:border-white/10 rounded-2xl p-1.5 shadow-2xl backdrop-blur-2xl z-40 space-y-1"
              >
                {/* 𝕏 Twitter / X */}
                <button
                  onClick={shareToTwitter}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-800 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <span className="w-4 h-4 font-black flex items-center justify-center">𝕏</span>
                  <span>Share to X (Twitter)</span>
                </button>

                {/* LinkedIn */}
                <button
                  onClick={shareToLinkedIn}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-800 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 fill-[#0A66C2]" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.3a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26z" />
                  </svg>
                  <span>Share to LinkedIn</span>
                </button>

                {/* WhatsApp */}
                <button
                  onClick={shareToWhatsApp}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-800 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 fill-[#25D366]" viewBox="0 0 24 24">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.28-2.42 5.83a8.19 8.19 0 0 1-5.82 2.41c-1.46 0-2.9-.39-4.16-1.13l-.3-.18-3.1.81.83-3.02-.2-.31c-.81-1.3-1.24-2.82-1.24-4.41 0-4.54 3.7-8.24 8.24-8.24m4.54 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.08 0 1.22.89 2.41 1.02 2.58.12.17 1.76 2.68 4.26 3.76.6.26 1.06.41 1.42.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.29z" />
                  </svg>
                  <span>Share to WhatsApp</span>
                </button>

                {/* Native Direct Share */}
                <button
                  onClick={shareNativeOrImage}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-800 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer border-t border-slate-200/60 dark:border-white/10 pt-2"
                >
                  <Share2 className="w-3.5 h-3.5 text-blue-500" />
                  <span>Send Image File</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3. Copy Image to Clipboard */}
        <button
          onClick={copyImageToClipboard}
          className="bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-800 dark:text-white border border-slate-200/90 dark:border-white/10 font-bold px-4 py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-xs sm:text-sm shadow-sm"
          title="Copy Dossier Image to Clipboard for pasting anywhere"
        >
          {copiedImage ? <CheckCheck className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
          <span>{copiedImage ? 'Image Copied!' : 'Copy Image'}</span>
        </button>

        {/* 4. Upvote Roast Heart Button */}
        <button
          onClick={handleLike}
          disabled={isLiking}
          className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-bold px-4 py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-xs sm:text-sm shadow-sm"
        >
          <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
          <span>Upvote ({likes})</span>
        </button>
      </div>
    </div>
  );
}
