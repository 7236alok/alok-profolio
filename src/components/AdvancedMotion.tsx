'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  strength?: number;
  range?: number;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  onClick,
  strength = 0.3,
  range = 100
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { damping: 30, stiffness: 400, restDelta: 0.001 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      if (distance < range) {
        const forceX = (deltaX / distance) * strength * (range - distance);
        const forceY = (deltaY / distance) * strength * (range - distance);
        
        x.set(forceX);
        y.set(forceY);
      } else if (!isHovered) {
        x.set(0);
        y.set(0);
      }
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      x.set(0);
      y.set(0);
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    if (ref.current) {
      ref.current.addEventListener('mouseenter', handleMouseEnter);
      ref.current.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (ref.current) {
        ref.current.removeEventListener('mouseenter', handleMouseEnter);
        ref.current.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [x, y, strength, range, isHovered]);

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      className={`relative overflow-hidden transition-all duration-300 ${className}`}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
};

interface FluidCursorProps {
  size?: number;
  color?: string;
}

export const FluidCursor: React.FC<FluidCursorProps> = ({
  size = 20,
  color = 'rgba(79, 70, 229, 0.6)'
}) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const cursorX = useSpring(x, { damping: 30, stiffness: 400 });
  const cursorY = useSpring(y, { damping: 30, stiffness: 400 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [x, y]);

  return (
    <motion.div
      ref={cursorRef}
      className="fixed pointer-events-none z-50 mix-blend-difference"
      style={{
        x: cursorX,
        y: cursorY,
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: '50%',
        translateX: '-50%',
        translateY: '-50%',
      }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0,
      }}
      transition={{ duration: 0.3 }}
    />
  );
};

interface GlitchTextProps {
  text: string;
  intensity?: number;
  speed?: number;
  className?: string;
}

export const GlitchText: React.FC<GlitchTextProps> = ({
  text,
  intensity = 0.1,
  speed = 100,
  className = ''
}) => {
  const [glitchedText, setGlitchedText] = useState(text);
  const [isGlitching, setIsGlitching] = useState(false);

  const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  const glitch = () => {
    if (isGlitching) return;
    
    setIsGlitching(true);
    const duration = Math.random() * 500 + 200;
    
    const glitchInterval = setInterval(() => {
      const newText = text.split('').map((char, index) => {
        if (Math.random() < intensity) {
          return glitchChars[Math.floor(Math.random() * glitchChars.length)];
        }
        return char;
      }).join('');
      
      setGlitchedText(newText);
    }, speed);

    setTimeout(() => {
      clearInterval(glitchInterval);
      setGlitchedText(text);
      setIsGlitching(false);
    }, duration);
  };

  useEffect(() => {
    const triggerGlitch = () => {
      if (Math.random() < 0.3) {
        glitch();
      }
    };

    const interval = setInterval(triggerGlitch, 3000);
    return () => clearInterval(interval);
  }, [text, intensity, speed]);

  return (
    <span
      className={`inline-block ${className}`}
      style={{
        textShadow: isGlitching 
          ? '2px 0 #ff0000, -2px 0 #00ffff, 1px 0 #ffff00' 
          : 'none',
        animation: isGlitching ? 'glitch 0.1s infinite' : 'none',
      }}
    >
      {glitchedText}
    </span>
  );
};

interface QuantumFieldProps {
  particleCount?: number;
  fieldStrength?: number;
  className?: string;
}

export const QuantumField: React.FC<QuantumFieldProps> = ({
  particleCount = 50,
  fieldStrength = 1,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    hue: number;
  }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.5,
        hue: Math.random() * 60 + 200,
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx * fieldStrength;
        particle.y += particle.vy * fieldStrength;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Quantum behavior - occasional random jumps
        if (Math.random() < 0.01) {
          particle.x += (Math.random() - 0.5) * 50;
          particle.y += (Math.random() - 0.5) * 50;
        }

        // Draw particle
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = `hsl(${particle.hue}, 80%, 60%)`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Add glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsl(${particle.hue}, 80%, 60%)`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Connect nearby particles
        for (let j = index + 1; j < particlesRef.current.length; j++) {
          const other = particlesRef.current[j];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.save();
            ctx.globalAlpha = (100 - distance) / 100 * 0.2;
            ctx.strokeStyle = `hsl(${(particle.hue + other.hue) / 2}, 80%, 60%)`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
            ctx.restore();
          }
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particleCount, fieldStrength]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ background: 'transparent' }}
    />
  );
};

// Simple placeholder for MorphingContainer to avoid import errors
interface MorphingContainerProps {
  children: React.ReactNode;
  morphStates?: any[];
  duration?: number;
  className?: string;
}

export const MorphingContainer: React.FC<MorphingContainerProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};