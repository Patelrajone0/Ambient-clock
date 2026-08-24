import React, { useEffect, useRef } from 'react';
import { useAmbient } from '../../context/AmbientContext';
import { ThemeId } from '../../types';

interface Particle {
  x: number;
  y: number;
  radius?: number;
  size?: number;
  length?: number;
  speed?: number;
  vx?: number;
  vy?: number;
  alpha?: number;
  twinkleSpeed?: number;
  layer?: number;
  angle?: number;
  spinSpeed?: number;
  color?: string;
}

interface BlobCircle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  color: string;
}

interface MatrixColumn {
  x: number;
  y: number;
  speed: number;
  chars: string;
}

export const CanvasBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { state } = useAmbient();
  const { theme, isNightstand } = state;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let animationId: number | null = null;
    let isPaused = false;

    let particles: Particle[] = [];
    let blobs: BlobCircle[] = [];
    let matrixCols: MatrixColumn[] = [];
    let synthwaveOffset = 0;
    let auroraTime = 0;

    const setupTheme = (themeId: ThemeId) => {
      particles = [];
      blobs = [];
      matrixCols = [];

      const isSolidTheme = themeId && (themeId.startsWith('solid-') || themeId === 'solid-black');
      if (isSolidTheme || isNightstand) {
        canvas.style.display = 'none';
        isPaused = true;
        return;
      }

      canvas.style.display = 'block';
      isPaused = false;

      if (themeId === 'starfield') {
        const numStars = Math.floor((width * height) / 3500);
        for (let i = 0; i < numStars; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.5 + 0.3,
            alpha: Math.random() * 0.8 + 0.2,
            twinkleSpeed: Math.random() * 0.02 + 0.005,
            layer: Math.random() < 0.2 ? 2 : 1,
          });
        }
      } else if (themeId === 'rain') {
        const numDrops = Math.floor(width / 4);
        for (let i = 0; i < numDrops; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            length: Math.random() * 25 + 10,
            speed: Math.random() * 10 + 12,
            alpha: Math.random() * 0.4 + 0.1,
          });
        }
        for (let i = 0; i < 8; i++) {
          blobs.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 100 + 50,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            color: i % 2 === 0 ? 'rgba(56, 189, 248, 0.05)' : 'rgba(251, 146, 60, 0.04)',
          });
        }
      } else if (themeId === 'matrix') {
        const colWidth = 20;
        const cols = Math.floor(width / colWidth);
        for (let i = 0; i < cols; i++) {
          matrixCols.push({
            x: i * colWidth,
            y: Math.random() * -height,
            speed: Math.random() * 5 + 3,
            chars: '0123456789ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ',
          });
        }
      } else if (themeId === 'light') {
        const blobColors = [
          'rgba(224, 122, 95, 0.12)',
          'rgba(242, 204, 143, 0.15)',
          'rgba(61, 64, 91, 0.08)',
          'rgba(129, 140, 248, 0.1)',
        ];
        for (let i = 0; i < 6; i++) {
          blobs.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 220 + 120,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            color: blobColors[i % blobColors.length],
          });
        }
      } else if (themeId === 'aurora') {
        for (let i = 0; i < 60; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2 + 0.5,
            alpha: Math.random() * 0.7 + 0.2,
            vy: -(Math.random() * 0.4 + 0.1),
          });
        }
      } else if (themeId === 'premium-sakura') {
        for (let i = 0; i < 45; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 8 + 6,
            vy: Math.random() * 1.2 + 0.8,
            vx: Math.random() * 0.8 - 0.2,
            angle: Math.random() * Math.PI * 2,
            spinSpeed: (Math.random() - 0.5) * 0.03,
            alpha: Math.random() * 0.6 + 0.3,
          });
        }
      } else if (themeId === 'premium-sunset') {
        for (let i = 0; i < 50; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 3 + 1,
            vy: -(Math.random() * 0.8 + 0.4),
            vx: (Math.random() - 0.5) * 0.4,
            alpha: Math.random() * 0.7 + 0.2,
            color: i % 2 === 0 ? 'rgba(251, 191, 36, ' : 'rgba(248, 113, 113, ',
          });
        }
      } else if (themeId === 'premium-mist') {
        for (let i = 0; i < 35; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 140 + 80,
            vx: Math.random() * 0.3 + 0.1,
            color: 'rgba(45, 212, 191, 0.05)',
          });
        }
      } else if (themeId === 'premium-nebula') {
        for (let i = 0; i < 70; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2 + 0.5,
            alpha: Math.random() * 0.8 + 0.2,
            twinkleSpeed: Math.random() * 0.02 + 0.005,
          });
        }
        for (let i = 0; i < 5; i++) {
          blobs.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 250 + 150,
            vx: (Math.random() - 0.5) * 0.2,
            vy: (Math.random() - 0.5) * 0.2,
            color: i % 2 === 0 ? 'rgba(192, 132, 252, 0.08)' : 'rgba(45, 212, 191, 0.06)',
          });
        }
      } else if (themeId === 'premium-bamboo') {
        for (let i = 0; i < 40; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 9 + 5,
            vy: Math.random() * 0.9 + 0.5,
            vx: Math.random() * 0.6 - 0.2,
            angle: Math.random() * Math.PI * 2,
            spinSpeed: (Math.random() - 0.5) * 0.025,
            alpha: Math.random() * 0.6 + 0.35,
          });
        }
      } else if (themeId === 'premium-lavender') {
        for (let i = 0; i < 50; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2.5 + 0.8,
            vy: -(Math.random() * 0.7 + 0.3),
            vx: (Math.random() - 0.5) * 0.3,
            alpha: Math.random() * 0.7 + 0.2,
          });
        }
        for (let i = 0; i < 6; i++) {
          blobs.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 180 + 90,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25,
            color: 'rgba(168, 85, 247, 0.06)',
          });
        }
      } else if (themeId === 'premium-cozy-fire') {
        for (let i = 0; i < 45; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 3 + 1,
            vy: -(Math.random() * 0.9 + 0.4),
            vx: (Math.random() - 0.5) * 0.5,
            alpha: Math.random() * 0.8 + 0.2,
          });
        }
      } else if (themeId === 'premium-starlight-cloud') {
        for (let i = 0; i < 60; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2 + 0.5,
            alpha: Math.random() * 0.8 + 0.2,
            twinkleSpeed: Math.random() * 0.02 + 0.005,
          });
        }
        for (let i = 0; i < 4; i++) {
          blobs.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 220 + 120,
            vx: (Math.random() - 0.5) * 0.2,
            vy: 0,
            color: 'rgba(56, 189, 248, 0.06)',
          });
        }
      } else if (themeId === 'premium-ocean-breeze') {
        for (let i = 0; i < 40; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2.5 + 0.8,
            vy: Math.random() * 0.8 + 0.4,
            alpha: Math.random() * 0.65 + 0.25,
          });
        }
      }
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      setupTheme(theme);
    };

    window.addEventListener('resize', handleResize);
    setupTheme(theme);

    const render = () => {
      if (isPaused) return;
      ctx.clearRect(0, 0, width, height);

      switch (theme) {
        case 'starfield': {
          for (const p of particles) {
            p.alpha = (p.alpha || 0.5) + (p.twinkleSpeed || 0.01);
            if (p.alpha > 0.95 || p.alpha < 0.15) p.twinkleSpeed = -(p.twinkleSpeed || 0.01);
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius || 1, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(249, 250, 251, ${p.alpha})`;
            ctx.shadowBlur = p.layer === 2 ? 8 : 0;
            ctx.shadowColor = '#a78bfa';
            ctx.fill();
          }
          break;
        }

        case 'rain': {
          for (const b of blobs) {
            b.x += b.vx;
            b.y += b.vy;
            if (b.x < -b.radius) b.x = width + b.radius;
            if (b.x > width + b.radius) b.x = -b.radius;
            if (b.y < -b.radius) b.y = height + b.radius;
            if (b.y > height + b.radius) b.y = -b.radius;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
            ctx.fillStyle = b.color;
            ctx.fill();
          }

          ctx.shadowBlur = 0;
          ctx.strokeStyle = 'rgba(186, 230, 253, 0.4)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          for (const p of particles) {
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x - 1, p.y + (p.length || 15));
            p.y += p.speed || 12;
            if (p.y > height) {
              p.y = -(p.length || 15);
              p.x = Math.random() * width;
            }
          }
          ctx.stroke();
          break;
        }

        case 'synthwave': {
          const horizonY = height * 0.6;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          for (let i = 0; i < 30; i++) {
            const sx = (Math.sin(i * 99) * 0.5 + 0.5) * width;
            const sy = (Math.cos(i * 33) * 0.5 + 0.5) * (horizonY - 20);
            ctx.fillRect(sx, sy, 1.5, 1.5);
          }

          const sunX = width / 2;
          const sunY = horizonY - 40;
          const sunRadius = Math.min(width, height) * 0.16;

          const sunGrad = ctx.createLinearGradient(sunX, sunY - sunRadius, sunX, sunY + sunRadius);
          sunGrad.addColorStop(0, '#ffe5ec');
          sunGrad.addColorStop(0.5, '#ff007f');
          sunGrad.addColorStop(1, '#7928ca');

          ctx.save();
          ctx.beginPath();
          ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
          ctx.fillStyle = sunGrad;
          ctx.shadowBlur = 40;
          ctx.shadowColor = '#ff007f';
          ctx.fill();

          ctx.fillStyle = '#130024';
          for (let i = 0; i < 6; i++) {
            const cutY = sunY + i * 12 - 10;
            const cutHeight = 2 + i * 1.5;
            if (cutY < sunY + sunRadius) {
              ctx.fillRect(sunX - sunRadius - 10, cutY, sunRadius * 2 + 20, cutHeight);
            }
          }
          ctx.restore();

          synthwaveOffset = (synthwaveOffset + 1.5) % 40;
          ctx.strokeStyle = 'rgba(0, 243, 255, 0.4)';
          ctx.lineWidth = 1.5;
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#00f3ff';

          const numVLines = 24;
          for (let i = -numVLines / 2; i <= numVLines / 2; i++) {
            const startX = sunX + i * 20;
            const endX = sunX + i * (width / 8);
            ctx.beginPath();
            ctx.moveTo(startX, horizonY);
            ctx.lineTo(endX, height);
            ctx.stroke();
          }

          for (let y = horizonY; y <= height; y += 15) {
            const progress = (y - horizonY) / (height - horizonY);
            const drawY = horizonY + Math.pow(progress, 2.2) * (height - horizonY) + synthwaveOffset * progress;
            if (drawY <= height) {
              ctx.beginPath();
              ctx.moveTo(0, drawY);
              ctx.lineTo(width, drawY);
              ctx.stroke();
            }
          }
          break;
        }

        case 'matrix': {
          ctx.fillStyle = 'rgba(0, 255, 102, 0.85)';
          ctx.font = '14px monospace';
          for (const col of matrixCols) {
            const char = col.chars[Math.floor(Math.random() * col.chars.length)];
            ctx.fillText(char, col.x, col.y);
            col.y += col.speed * 3;
            if (col.y > height && Math.random() > 0.95) {
              col.y = 0;
            }
          }
          break;
        }

        case 'light': {
          for (const b of blobs) {
            b.x += b.vx;
            b.y += b.vy;
            if (b.x < -b.radius) b.x = width + b.radius;
            if (b.x > width + b.radius) b.x = -b.radius;
            if (b.y < -b.radius) b.y = height + b.radius;
            if (b.y > height + b.radius) b.y = -b.radius;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
            ctx.fillStyle = b.color;
            ctx.fill();
          }
          break;
        }

        case 'aurora': {
          auroraTime += 0.008;
          const grad = ctx.createLinearGradient(0, 0, width, height);
          grad.addColorStop(0, 'rgba(16, 185, 129, 0.15)');
          grad.addColorStop(0.5, 'rgba(139, 92, 246, 0.18)');
          grad.addColorStop(1, 'rgba(56, 189, 248, 0.12)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(0, height * 0.4);

          for (let x = 0; x <= width; x += 30) {
            const y = Math.sin(x * 0.003 + auroraTime) * 80 + Math.cos(x * 0.005 - auroraTime * 0.8) * 50 + height * 0.35;
            ctx.lineTo(x, y);
          }
          ctx.lineTo(width, height);
          ctx.lineTo(0, height);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = 'rgba(16, 185, 129, 0.6)';
          for (const p of particles) {
            p.y += p.vy || -0.2;
            if (p.y < 0) {
              p.y = height;
              p.x = Math.random() * width;
            }
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius || 1, 0, Math.PI * 2);
            ctx.fill();
          }
          break;
        }

        case 'premium-sakura': {
          for (const p of particles) {
            p.y += p.vy || 1;
            p.x += (p.vx || 0) + Math.sin(p.y * 0.02) * 0.5;
            p.angle = (p.angle || 0) + (p.spinSpeed || 0.01);

            if (p.y > height) {
              p.y = -20;
              p.x = Math.random() * width;
            }

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle);
            ctx.fillStyle = `rgba(244, 114, 182, ${p.alpha || 0.5})`;
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size || 8, (p.size || 8) * 0.5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
          break;
        }

        case 'premium-sunset': {
          for (const p of particles) {
            p.y += p.vy || -0.5;
            p.x += p.vx || 0;
            if (p.y < 0) {
              p.y = height;
              p.x = Math.random() * width;
            }
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size || 2, 0, Math.PI * 2);
            ctx.fillStyle = `${p.color}${p.alpha})`;
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#fbbf24';
            ctx.fill();
          }
          break;
        }

        case 'premium-mist': {
          for (const b of particles) {
            b.x += b.vx || 0.2;
            if (b.x > width + (b.radius || 100)) b.x = -(b.radius || 100);
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.radius || 100, 0, Math.PI * 2);
            ctx.fillStyle = b.color || 'rgba(45, 212, 191, 0.05)';
            ctx.fill();
          }
          break;
        }

        case 'premium-nebula': {
          for (const b of blobs) {
            b.x += b.vx;
            b.y += b.vy;
            if (b.x < -b.radius) b.x = width + b.radius;
            if (b.x > width + b.radius) b.x = -b.radius;
            if (b.y < -b.radius) b.y = height + b.radius;
            if (b.y > height + b.radius) b.y = -b.radius;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
            ctx.fillStyle = b.color;
            ctx.fill();
          }
          for (const p of particles) {
            p.alpha = (p.alpha || 0.5) + (p.twinkleSpeed || 0.01);
            if (p.alpha > 0.95 || p.alpha < 0.15) p.twinkleSpeed = -(p.twinkleSpeed || 0.01);
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius || 1, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(250, 232, 255, ${p.alpha})`;
            ctx.fill();
          }
          break;
        }

        case 'premium-bamboo': {
          for (const p of particles) {
            p.y += p.vy || 0.7;
            p.x += (p.vx || 0) + Math.sin(p.y * 0.015) * 0.4;
            p.angle = (p.angle || 0) + (p.spinSpeed || 0.01);

            if (p.y > height) {
              p.y = -20;
              p.x = Math.random() * width;
            }

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle);
            ctx.fillStyle = `rgba(16, 185, 129, ${p.alpha || 0.5})`;
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size || 8, (p.size || 8) * 0.4, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
          break;
        }

        case 'premium-lavender': {
          for (const b of blobs) {
            b.x += b.vx;
            b.y += b.vy;
            if (b.x < -b.radius) b.x = width + b.radius;
            if (b.x > width + b.radius) b.x = -b.radius;
            if (b.y < -b.radius) b.y = height + b.radius;
            if (b.y > height + b.radius) b.y = -b.radius;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
            ctx.fillStyle = b.color;
            ctx.fill();
          }
          for (const p of particles) {
            p.y += p.vy || -0.5;
            p.x += p.vx || 0;
            if (p.y < 0) {
              p.y = height;
              p.x = Math.random() * width;
            }
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius || 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(168, 85, 247, ${p.alpha || 0.5})`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#a855f7';
            ctx.fill();
          }
          break;
        }

        case 'premium-cozy-fire': {
          for (const p of particles) {
            p.y += p.vy || -0.6;
            p.x += (p.vx || 0) + Math.sin(p.y * 0.03) * 0.6;
            p.alpha = Math.min(Math.max((p.alpha || 0.5) + (Math.random() - 0.5) * 0.05, 0.2), 0.9);

            if (p.y < 0) {
              p.y = height;
              p.x = Math.random() * width;
            }
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size || 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(249, 115, 22, ${p.alpha})`;
            ctx.shadowBlur = 12;
            ctx.shadowColor = '#f97316';
            ctx.fill();
          }
          break;
        }

        case 'premium-starlight-cloud': {
          for (const b of blobs) {
            b.x += b.vx;
            if (b.x > width + b.radius) b.x = -b.radius;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
            ctx.fillStyle = b.color;
            ctx.fill();
          }
          for (const p of particles) {
            p.alpha = (p.alpha || 0.5) + (p.twinkleSpeed || 0.01);
            if (p.alpha > 0.95 || p.alpha < 0.15) p.twinkleSpeed = -(p.twinkleSpeed || 0.01);
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius || 1, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(186, 230, 253, ${p.alpha})`;
            ctx.shadowBlur = 6;
            ctx.shadowColor = '#38bdf8';
            ctx.fill();
          }
          break;
        }

        case 'premium-ocean-breeze': {
          for (const p of particles) {
            p.y += p.vy || 0.5;
            p.x += Math.sin(p.y * 0.01) * 0.5;
            if (p.y > height) {
              p.y = -10;
              p.x = Math.random() * width;
            }
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius || 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(6, 182, 212, ${p.alpha || 0.5})`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#06b6d4';
            ctx.fill();
          }
          break;
        }
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme, isNightstand]);

  return (
    <>
      <canvas id="ambient-canvas" ref={canvasRef} />
      <div className="scanline-overlay" />
    </>
  );
};
