"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, memo, useCallback } from "react";
import Lenis from "lenis";
import { ParticleField, NeuralBackground } from "./backgrounds/AnimatedBackgrounds";

// Skill data organized by categories
const languages = ["C", "C++", "Python", "JavaScript", "TypeScript", "HTML", "CSS"];

const frameworks = [
  "FastAPI",
  "Flask",
  "Next.js",
  "React",
  "Scikit-learn",
  "Keras",
  "Pandas",
  "NumPy",
  "Matplotlib",
  "Chart.js",
];

const databases = ["MySQL", "MongoDB", "Elasticsearch", "PostgreSQL", "Redis"];

const tools = [
  "Docker",
  "Git",
  "VS Code",
  "Jupyter Notebook",
  "Prisma",
  "Clerk",
  "Figma",
];

const specializations = [
  "Machine Learning",
  "Cybersecurity",
  "DDoS Detection",
  "Real-Time Data Streaming",
  "Apache Kafka",
  "Grafana",
  "Feature Engineering",
  "Data Visualization",
];

// Type definitions
type ScrollDirection = "left" | "right";

interface SkillCategory {
  title: string;
  skills: string[];
  scrollDirection: ScrollDirection;
}

interface SkillCardProps {
  name: string;
  shouldReduceMotion: boolean | null;
  index: number;
}

interface SkillCategorySectionProps {
  category: SkillCategory;
  scrollX: any;
  isLast: boolean;
  shouldReduceMotion: boolean | null;
}

const skillCategories: SkillCategory[] = [
  {
    title: "Languages",
    skills: languages,
    scrollDirection: "left",
  },
  {
    title: "Frameworks & Libraries",
    skills: frameworks,
    scrollDirection: "right",
  },
  {
    title: "Databases & Tools",
    skills: [...databases, ...tools],
    scrollDirection: "left",
  },
  {
    title: "Specialization & Domains",
    skills: specializations,
    scrollDirection: "right",
  },
];

// Note: we use the shared ParticleField and NeuralBackground from AnimatedBackgrounds
// to match the moving background used in AdvancedHero.

export default function Skills() {
  const ref = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const shouldReduceMotion = useReducedMotion();
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Memoized scroll transforms to prevent unnecessary recalculations
  const xLeft = useTransform(
    scrollYProgress, 
    [0, 1], 
    shouldReduceMotion ? ["0%", "0%"] : ["-10%", "-50%"]
  );
  const xRight = useTransform(
    scrollYProgress, 
    [0, 1], 
    shouldReduceMotion ? ["0%", "0%"] : ["10%", "50%"]
  );

  // Lenis for smooth scrolling with proper cleanup
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let animationFrameId: number;
    
    const raf = (time: number) => {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    };
    
    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, []);

  // Mouse tracking for background parallax effect (throttled for performance)
  useEffect(() => {
    if (!ref.current) return;

    let rafId: number | null = null;
    let lastX = 0;
    let lastY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafId) return; // Throttle to one update per frame
      
      rafId = requestAnimationFrame(() => {
        const rect = ref.current?.getBoundingClientRect();
        if (rect) {
          lastX = ((e.clientX - rect.left) / rect.width) * 100;
          lastY = ((e.clientY - rect.top) / rect.height) * 100;
          setMousePosition({ x: lastX, y: lastY });
        }
        rafId = null;
      });
    };

    const container = ref.current;
    container.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      ref={ref}
      id="skills"
      aria-labelledby="skills-heading"
      className="relative min-h-screen py-20 flex flex-col items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden"
    >
      {/* Animated background (shared with AdvancedHero and Projects) - render immediately to prevent hydration issues */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: shouldReduceMotion ? 0 : 1 }}
      >
        <ParticleField
          particleCount={200}
          speed={0.9}
          opacityRange={[0.25, 0.85]}
          hueRange={[190, 220]}
          className="z-0"
        />
        <NeuralBackground
          nodeCount={50}
          connectionDistance={150}
          connectionOpacity={0.3}
          nodeColor="rgba(56, 178, 172, 0.6)"
          connectionColor="rgba(56, 178, 172, 1)"
          pulseSpeed={4000}
          mousePosition={shouldReduceMotion ? undefined : mousePosition}
          className="z-10"
        />
      </div>

      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-radial from-cyan-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="w-full text-center px-4 z-10">
        {/* SECTION TITLE with enhanced styling */}
        <motion.h2 
          id="skills-heading"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-12 md:mb-16 tracking-wide relative"
        >
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            My Technical Skills
          </span>
          <motion.div
            className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 blur-2xl -z-10"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.h2>

        {/* Screen reader description */}
        <div className="sr-only" role="region" aria-live="polite">
          This section contains {skillCategories.length} skill categories with horizontally scrolling cards. 
          Use arrow keys to navigate between skills and Enter to focus on individual skills.
        </div>

        {/* SKILL CATEGORIES */}
        <div role="list" aria-label="Skill categories">
          {skillCategories.map((category, index) => (
            <SkillCategorySection
              key={category.title}
              category={category}
              scrollX={category.scrollDirection === "left" ? xLeft : xRight}
              isLast={index === skillCategories.length - 1}
              shouldReduceMotion={shouldReduceMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Memoized Skill Category Section Component
const SkillCategorySection = memo(function SkillCategorySection({ 
  category, 
  scrollX, 
  isLast, 
  shouldReduceMotion 
}: SkillCategorySectionProps) {
  const categoryRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const cards = categoryRef.current?.querySelectorAll('[role="listitem"]');
    if (!cards) return;

    const currentIndex = Array.from(cards).indexOf(document.activeElement as Element);
    
    if (e.key === 'ArrowRight' && currentIndex < cards.length - 1) {
      e.preventDefault();
      (cards[currentIndex + 1] as HTMLElement).focus();
    } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
      e.preventDefault();
      (cards[currentIndex - 1] as HTMLElement).focus();
    }
  };

  return (
    <div 
      ref={categoryRef}
      className={`${isLast ? '' : 'mb-12 md:mb-16'}`}
      role="listitem"
      onKeyDown={handleKeyDown}
    >
      <motion.h3 
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-xl md:text-2xl text-cyan-400 mb-6 md:mb-8 font-semibold uppercase tracking-widest relative inline-block"
      >
        {category.title}
        <motion.span
          className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500"
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
      </motion.h3>
      <div className="overflow-hidden">
        <motion.div
          style={{ x: shouldReduceMotion ? "0%" : scrollX }}
          className="flex gap-4 md:gap-8 whitespace-nowrap"
          role="list"
          aria-label={`${category.title} skills`}
        >
          {/* Double the array for seamless looping with optimized rendering */}
          {category.skills.concat(category.skills).map((skill, i) => (
            <SkillCard 
              key={`${category.title}-${i}-${skill}`} 
              name={skill} 
              index={i}
              shouldReduceMotion={shouldReduceMotion}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
});

// Enhanced Skill Card Component with better memoization
const SkillCard = memo(function SkillCard({ 
  name, 
  index,
  shouldReduceMotion 
}: SkillCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 15,
        duration: 0.4,
        delay: Math.min(index * 0.05, 0.5),
        ease: "easeOut",
      }}
      whileHover={shouldReduceMotion ? {} : { 
        scale: 1.1, 
        rotate: 2,
        boxShadow: "0 0 25px rgba(6, 182, 212, 0.4)"
      }}
      whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
      whileFocus={shouldReduceMotion ? {} : { 
        scale: 1.05,
        boxShadow: "0 0 20px rgba(6, 182, 212, 0.5)"
      }}
      
      className="group relative px-4 py-3 md:px-6 md:py-4 lg:px-8 lg:py-4 text-white text-sm md:text-lg font-medium 
        bg-slate-800/70 rounded-xl shadow-md backdrop-blur-md 
        hover:shadow-cyan-500/40 hover:bg-slate-700/80 
        transition-all duration-300 cursor-default flex-shrink-0
        border border-slate-700/50 hover:border-cyan-500/30
        focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-2 focus:ring-offset-slate-950"
      role="listitem"
      tabIndex={0}
      aria-label={`${name} skill`}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
      
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-xl"
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
      
      <span className="relative z-10">{name}</span>
    </motion.div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for better memoization
  return prevProps.name === nextProps.name && 
         prevProps.shouldReduceMotion === nextProps.shouldReduceMotion &&
         prevProps.index === nextProps.index;
});