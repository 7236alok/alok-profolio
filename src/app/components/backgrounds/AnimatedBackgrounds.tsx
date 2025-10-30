"use client";

import React, { useEffect, useRef } from "react";

interface ParticleFieldProps {
  className?: string;
  particleCount?: number;
  speed?: number;
  sizeRange?: [number, number];
  opacityRange?: [number, number];
  hueRange?: [number, number];
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  hue: number;
  opacity: number;
  life: number;
  maxLife: number;
}

export const ParticleField: React.FC<ParticleFieldProps> = ({
  className = "",
  particleCount = 200,
  speed = 0.6,
  sizeRange = [1, 3],
  opacityRange = [0.2, 0.8],
  hueRange = [180, 220],
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  const [sizeMin, sizeMax] = sizeRange;
  const [opacityMin, opacityMax] = opacityRange;
  const [hueMin, hueMax] = hueRange;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    const dpr = window.devicePixelRatio || 1;

    const particles: Particle[] = [];

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const createParticle = (): Particle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      size: randomInRange(sizeMin, sizeMax),
      hue: randomInRange(hueMin, hueMax),
      opacity: randomInRange(opacityMin, opacityMax),
      life: 0,
      maxLife: randomInRange(800, 1400),
    });

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      width = rect?.width ?? window.innerWidth;
      height = rect?.height ?? window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
  window.addEventListener("resize", resize);

    particles.splice(0, particles.length);
    for (let i = 0; i < particleCount; i += 1) {
      particles.push(createParticle());
    }

    let lastTime = 0;

    const animate = (time: number) => {
      animationRef.current = requestAnimationFrame(animate);
      if (time - lastTime < 16) return;
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life += 16;

        if (particle.x < -50 || particle.x > width + 50 || particle.y < -50 || particle.y > height + 50 || particle.life > particle.maxLife) {
          particles[index] = createParticle();
          return;
        }

        const alpha = particle.opacity * (1 - particle.life / particle.maxLife);
        ctx.save();
        ctx.globalAlpha = Math.max(0, alpha);
        ctx.fillStyle = `hsl(${particle.hue}, 70%, 60%)`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
  if (animationRef.current) cancelAnimationFrame(animationRef.current);
  window.removeEventListener("resize", resize);
    };
  }, [hueMax, hueMin, opacityMax, opacityMin, particleCount, sizeMax, sizeMin, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
};

interface NeuralBackgroundProps {
  className?: string;
  nodeCount?: number;
  connectionDistance?: number;
  connectionOpacity?: number;
  nodeColor?: string;
  connectionColor?: string;
  pulseSpeed?: number;
  mousePosition?: { x: number; y: number };
}

interface NeuralNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export const NeuralBackground: React.FC<NeuralBackgroundProps> = ({
  className = "",
  nodeCount = 50,
  connectionDistance = 150,
  connectionOpacity = 0.3,
  nodeColor = "rgba(56, 178, 172, 0.6)",
  connectionColor = "rgba(56, 178, 172, 1)",
  pulseSpeed = 4000,
  mousePosition,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const nodesRef = useRef<NeuralNode[]>([]);
  const lastPulseRef = useRef<number>(0);
  const mouseRef = useRef(mousePosition);

  useEffect(() => {
    mouseRef.current = mousePosition;
  }, [mousePosition]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      width = rect?.width ?? window.innerWidth;
      height = rect?.height ?? window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
  window.addEventListener("resize", resize);

    nodesRef.current = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
    }));

    const animate = (time: number) => {
      animationRef.current = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, width, height);

  const currentMouse = mouseRef.current;
  const parallaxX = currentMouse ? (currentMouse.x / 100 - 0.5) * 10 : 0;
  const parallaxY = currentMouse ? (currentMouse.y / 100 - 0.5) * 10 : 0;

      ctx.save();
      ctx.translate(parallaxX, parallaxY);

      ctx.strokeStyle = connectionColor;
      ctx.lineWidth = 1;
      ctx.globalAlpha = connectionOpacity;

      nodesRef.current.forEach((node, i) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        for (let j = i + 1; j < nodesRef.current.length; j += 1) {
          const other = nodesRef.current[j];
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const distance = Math.hypot(dx, dy);

          if (distance < connectionDistance) {
            const alpha = connectionOpacity * (1 - distance / connectionDistance);
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }
      });

      ctx.restore();

      ctx.fillStyle = nodeColor;
      nodesRef.current.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x + parallaxX, node.y + parallaxY, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      if (time - lastPulseRef.current > pulseSpeed) {
        nodesRef.current.forEach((node) => {
          node.vx += (Math.random() - 0.5) * 0.2;
          node.vy += (Math.random() - 0.5) * 0.2;
        });
        lastPulseRef.current = time;
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
  if (animationRef.current) cancelAnimationFrame(animationRef.current);
  window.removeEventListener("resize", resize);
    };
  }, [connectionColor, connectionDistance, connectionOpacity, nodeColor, nodeCount, pulseSpeed]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
};

interface ParallaxOrbsProps {
  className?: string;
  orbCount?: number;
  speed?: number;
  radiusRange?: [number, number];
  depthRange?: [number, number];
  colors?: string[];
}

interface Orb {
  x: number;
  y: number;
  z: number;
  radius: number;
  color: string;
}

export const ParallaxOrbs: React.FC<ParallaxOrbsProps> = ({
  className = "",
  orbCount = 42,
  speed = 0.0006,
  radiusRange = [6, 18],
  depthRange = [0.3, 1],
  colors = [
    "rgba(168, 85, 247, 0.45)",
    "rgba(244, 114, 182, 0.38)",
    "rgba(59, 130, 246, 0.32)",
    "rgba(99, 102, 241, 0.4)"
  ],
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  const [radiusMin, radiusMax] = radiusRange;
  const [depthMin, depthMax] = depthRange;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    const dpr = window.devicePixelRatio || 1;

    const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;

    const createOrb = (): Orb => ({
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
      z: randomBetween(depthMin, depthMax),
      radius: randomBetween(radiusMin, radiusMax),
      color: colors[Math.floor(Math.random() * colors.length)],
    });

    const orbs: Orb[] = Array.from({ length: orbCount }, createOrb);

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      width = rect?.width ?? window.innerWidth;
      height = rect?.height ?? window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    let lastTime = performance.now();

    const animate = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      animationRef.current = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, width, height);

      ctx.save();
      ctx.globalCompositeOperation = "screen";

      const focalLength = Math.min(width, height) * 0.8;
      const centerX = width / 2;
      const centerY = height / 2;

      orbs.forEach((orb, index) => {
        orb.z -= speed * delta;
        if (orb.z < depthMin * 0.35) {
          orbs[index] = createOrb();
          orbs[index].z = depthMax;
        }

        const perspective = focalLength / (focalLength + orb.z * focalLength);
        const projectedX = orb.x * width * 0.35 * perspective + centerX;
        const projectedY = orb.y * height * 0.35 * perspective + centerY;
        const projectedRadius = Math.max(orb.radius * perspective, 1.5);

        const gradient = ctx.createRadialGradient(
          projectedX,
          projectedY,
          projectedRadius * 0.2,
          projectedX,
          projectedY,
          projectedRadius
        );
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(1, "rgba(17, 24, 39, 0.05)");

        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(projectedX, projectedY, projectedRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [colors, depthMax, depthMin, orbCount, radiusMax, radiusMin, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
};
