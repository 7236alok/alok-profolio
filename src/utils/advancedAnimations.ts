// Advanced animation utilities for professional-level effects
import { Variants, MotionValue, useTransform } from 'framer-motion';

// Stagger animations for complex sequences
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

// Advanced text animations
export const textReveal: Variants = {
  hidden: {
    opacity: 0,
    clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)",
  },
  visible: {
    opacity: 1,
    clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
    transition: {
      duration: 1.2,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export const typewriterEffect = (text: string, delay: number = 0) => ({
  hidden: { width: 0 },
  visible: {
    width: "auto",
    transition: {
      duration: text.length * 0.1,
      delay,
      ease: "easeInOut",
    },
  },
});

// Magnetic button effect
export const magneticButton = {
  scale: 1,
  rotateX: 0,
  rotateY: 0,
  transition: {
    type: "spring",
    stiffness: 300,
    damping: 20,
  },
};

// Particle-based animations
export const particleFloat: Variants = {
  animate: {
    y: [0, -20, 0],
    x: [0, 10, -10, 0],
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Holographic shimmer effect
export const holographicShimmer = {
  initial: { backgroundPosition: "-200% 0" },
  animate: {
    backgroundPosition: "200% 0",
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

// 3D card flip animation
export const cardFlip: Variants = {
  front: {
    rotateY: 0,
    transition: { duration: 0.6, ease: [0.23, 1, 0.320, 1] },
  },
  back: {
    rotateY: 180,
    transition: { duration: 0.6, ease: [0.23, 1, 0.320, 1] },
  },
};

// Liquid morphing animation
export const liquidMorph: Variants = {
  idle: {
    borderRadius: "60% 40% 30% 70%/60% 30% 70% 40%",
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  },
  hover: {
    borderRadius: "30% 60% 70% 40%/50% 60% 30% 60%",
    scale: 1.1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

// Glass morphism effect
export const glassMorphism = {
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
};

// Neural network pulse animation
export const neuralPulse: Variants = {
  pulse: {
    scale: [1, 1.2, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Advanced scroll-triggered animations
export const scrollFadeIn = (scrollYProgress: MotionValue<number>) => ({
  opacity: scrollYProgress,
  y: useTransform(scrollYProgress, [0, 1], [100, 0]),
});

// Matrix-like digital rain effect
export const digitalRain = {
  animate: {
    y: ["0vh", "100vh"],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

// Quantum particle effect
export const quantumParticle: Variants = {
  animate: {
    scale: [0, 1, 0],
    opacity: [0, 1, 0],
    rotate: [0, 180, 360],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Fractal geometry animation
export const fractalGeometry: Variants = {
  animate: {
    rotate: 360,
    scale: [1, 1.1, 1],
    transition: {
      rotate: {
        duration: 20,
        repeat: Infinity,
        ease: "linear",
      },
      scale: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  },
};

// AI-inspired loading animation
export const aiLoading: Variants = {
  loading: {
    rotate: [0, 360],
    scale: [1, 1.1, 1],
    borderRadius: ["20%", "50%", "20%"],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Cyberpunk glitch effect
export const cyberpunkGlitch: Variants = {
  glitch: {
    x: [0, -2, 2, 0],
    filter: [
      "hue-rotate(0deg)",
      "hue-rotate(90deg)",
      "hue-rotate(180deg)",
      "hue-rotate(0deg)",
    ],
    transition: {
      duration: 0.3,
      repeat: Infinity,
      repeatType: "mirror",
    },
  },
};

export const useAdvancedAnimations = () => {
  return {
    staggerContainer,
    staggerItem,
    textReveal,
    typewriterEffect,
    magneticButton,
    particleFloat,
    holographicShimmer,
    cardFlip,
    liquidMorph,
    glassMorphism,
    neuralPulse,
    digitalRain,
    quantumParticle,
    fractalGeometry,
    aiLoading,
    cyberpunkGlitch,
  };
};

// Additional exports for AdvancedHero component
export const fadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 60,
    scale: 0.95 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export const scaleOnHover: Variants = {
  rest: { 
    scale: 1,
    boxShadow: "0px 0px 0px rgba(0,0,0,0)" 
  },
  hover: { 
    scale: 1.05,
    boxShadow: "0px 10px 30px rgba(0,0,0,0.2)",
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
};

export const quantumFloat: Variants = {
  animate: {
    y: [0, -10, 0],
    x: [0, 5, -5, 0],
    rotate: [0, 1, -1, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};