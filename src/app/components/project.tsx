
"use client";

import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown, ExternalLink, Github as GithubIcon, Award, Calendar, Code } from "lucide-react";
import { projects, type Project } from "@/data/projectsData";
import { ParticleField, NeuralBackground } from "./backgrounds/AnimatedBackgrounds";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ProjectsTimeline: React.FC = () => {
  const [selected, setSelected] = useState<Project | null>(null);
  const [activeProject, setActiveProject] = useState<number>(0);
  const [isMobile, setIsMobile] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  const containerRef = useRef<HTMLDivElement | null>(null);
  const projectsContainerRef = useRef<HTMLDivElement | null>(null);
  const activeProjectRef = useRef<number>(0);
  const gsapCtx = useRef<gsap.Context | null>(null);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Mouse tracking for background parallax effect (throttled for performance)
  useEffect(() => {
    if (!containerRef.current) return;

    let rafId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafId) return; // Throttle to one update per frame
      
      rafId = requestAnimationFrame(() => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          setMousePosition({ x, y });
        }
        rafId = null;
      });
    };

    const container = containerRef.current;
    container.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Check for mobile device and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      checkMobile();
      // Debounce ScrollTrigger refresh for better performance
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 300);
    };

    checkMobile();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  // Performance optimizations - Strategic will-change usage
  useEffect(() => {
    let rafId: number;
    
    const optimizeAnimations = () => {
      // Use will-change strategically
      document.querySelectorAll('[data-project]').forEach(el => {
        (el as HTMLElement).style.willChange = 'transform, opacity';
      });
    };

    rafId = requestAnimationFrame(optimizeAnimations);
    
    return () => {
      cancelAnimationFrame(rafId);
      // Clean up will-change
      document.querySelectorAll('[data-project]').forEach(el => {
        (el as HTMLElement).style.willChange = 'auto';
      });
    };
  }, []);

  // Configure GSAP ScrollTrigger
  useEffect(() => {
    ScrollTrigger.config({
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
      ignoreMobileResize: true,
      limitCallbacks: true,
      syncInterval: 150, // Better performance
    });

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  // Add mouse wheel sensitivity control for smoother scrolling
  useEffect(() => {
    if (isMobile || prefersReducedMotion) return;

    const handleWheel = (e: WheelEvent) => {
      const projectsSection = containerRef.current;
      if (!projectsSection) return;

      const rect = projectsSection.getBoundingClientRect();
      const isInView = rect.top <= 0 && rect.bottom >= window.innerHeight;

      if (isInView && Math.abs(e.deltaY) > 0) {
        e.preventDefault();
        
        // Reduce scroll sensitivity for more control (60% of original speed)
        const scrollAmount = e.deltaY * 0.6;
        window.scrollBy({ top: scrollAmount, behavior: 'auto' });
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [isMobile, prefersReducedMotion]);

  useLayoutEffect(() => {
    if (!projectsContainerRef.current || isMobile || prefersReducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      const projectsSection = document.querySelector('[data-projects-section]') as HTMLElement | null;
      if (!projectsSection) return;

      // Clear any existing triggers
      ScrollTrigger.getAll().forEach(st => st.kill());

      const totalScrollDistance = projects.length * window.innerHeight * 2;

      // Main pin trigger
      ScrollTrigger.create({
        trigger: projectsSection,
        start: "top top",
        end: () => `+=${totalScrollDistance}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const rawIndex = progress * projects.length;
          const projectIndex = Math.floor(rawIndex);
          
          if (projectIndex !== activeProjectRef.current) {
            activeProjectRef.current = projectIndex;
            setActiveProject(projectIndex);
          }
        },
      });

      // Project animations with better timing
      projects.forEach((_, index) => {
        const direction = index % 2 === 0 ? -1 : 1;
        const projectElement = document.querySelector(`[data-project="${index}"]`) as HTMLElement | null;
        if (!projectElement) return;

        // Set initial states more carefully
        gsap.set(projectElement, {
          x: index === 0 ? 0 : direction * 100,
          opacity: index === 0 ? 1 : 0,
          scale: index === 0 ? 1 : 0.9,
          zIndex: index === 0 ? 20 : 0,
        });

        ScrollTrigger.create({
          trigger: projectsSection,
          start: "top top",
          end: () => `+=${totalScrollDistance}`,
          scrub: 2.0, // Smoother scrubbing
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const totalProgress = self.progress;
            const segmentSize = 1 / projects.length;
            const segmentStart = index * segmentSize;
            const segmentEnd = (index + 1) * segmentSize;
            
            let x = direction * 100;
            let opacity = 0;
            let scale = 0.9;
            let zIndex = 0;

            if (totalProgress >= segmentStart && totalProgress <= segmentEnd) {
              const segmentProgress = (totalProgress - segmentStart) / segmentSize;
              
              if (segmentProgress < 0.25) {
                // Entering - 25% of the time
                const enterProgress = segmentProgress / 0.25;
                x = direction * 100 * (1 - enterProgress);
                opacity = enterProgress;
                scale = 0.9 + 0.1 * enterProgress;
                zIndex = 20;
              } else if (segmentProgress > 0.75) {
                // Exiting - 25% of the time
                const exitProgress = (segmentProgress - 0.75) / 0.25;
                x = -direction * 100 * exitProgress;
                opacity = 1 - exitProgress;
                scale = 1 - 0.1 * exitProgress;
                zIndex = 10;
              } else {
                // Fully visible - 50% of the time
                x = 0;
                opacity = 1;
                scale = 1;
                zIndex = 20;
              }
            }

            gsap.set(projectElement, {
              x: `${x}%`,
              opacity,
              scale,
              zIndex,
            });
          },
        });
      });

      // Force refresh after setup
      setTimeout(() => ScrollTrigger.refresh(), 100);
    });

    gsapCtx.current = ctx;

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [isMobile, prefersReducedMotion, projects.length]);

  // Close modal with Esc
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSelected(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section 
      id="projects"
      ref={containerRef} 
      className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black relative py-20"
    >
      {/* Animated background (shared with AdvancedHero and Skills) */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: prefersReducedMotion ? 0 : 1 }}
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
          mousePosition={prefersReducedMotion ? undefined : mousePosition}
          className="z-10"
        />
      </div>

      {/* Header removed per user request */}

      {/* Main Projects Section - Alternating Slide Layout */}
      <div className="relative" data-projects-section>
        {/* Desktop: Split Layout with GSAP */}
        <div className="hidden lg:flex relative min-h-screen">
          {/* Project Showcase - Full Width */}
          <div 
            ref={projectsContainerRef}
            className="w-full min-h-screen relative overflow-hidden projects-container"
          >
            <div className="relative w-full h-screen">
              {/* Project Cards - Positioned Absolutely for GSAP */}
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  data-project={index}
                  className="absolute inset-0 w-full h-full"
                  style={{ 
                    opacity: 0,
                    willChange: 'transform, opacity',
                  }}
                >
                  <AlternatingProjectCard 
                    project={project} 
                    index={index}
                    isActive={activeProject === index}
                    onOpenModal={setSelected}
                  />
                </div>
              ))}
            </div>

            {/* Progress Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
              {projects.map((_, index) => (
                <motion.div
                  key={index}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    activeProject === index 
                      ? 'w-12 bg-gradient-to-r from-indigo-600 to-purple-600' 
                      : 'w-8 bg-gray-300 dark:bg-gray-700'
                  }`}
                  layoutId={`progress-${index}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: Fallback Layout */}
        <div className="lg:hidden">
          <MobileFallback projects={projects} onOpenModal={setSelected} />
        </div>
      </div>

      {/* Modal (detailed) */}
      <AnimatePresence>
        {selected && (
          <ProjectModal project={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </section>
  );
};

// Alternating Project Card Component
interface AlternatingProjectCardProps {
  project: Project;
  index: number;
  isActive: boolean;
  onOpenModal: (project: Project) => void;
}

const AlternatingProjectCard: React.FC<AlternatingProjectCardProps> = ({ 
  project, 
  index, 
  isActive, 
  onOpenModal 
}) => {
  const direction = index % 2 === 0 ? 'left' : 'right';
  
  return (
    <div className="w-full h-full flex items-center justify-center p-4 md:p-8 lg:p-12">

      <div className="max-w-6xl w-full h-full flex items-center">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full ${
          direction === 'right' ? 'lg:grid-flow-col-dense' : ''
        }`}>
          {/* Image Side */}
          <div className={`relative ${direction === 'right' ? 'lg:col-start-2' : ''}`}>
            <div className="relative h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl group project-image-container">
              {project.video ? (
                <video
                  src={project.video}
                  poster={project.image}
                  className="absolute inset-0 w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              ) : (
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              
              {/* Direction Indicator */}
              <div className="absolute top-6 right-6">
                <div className={`px-3 py-1 rounded-full text-xs font-medium shadow-lg ${
                  direction === 'left' 
                    ? 'bg-blue-500/90 text-white' 
                    : 'bg-purple-500/90 text-white'
                }`}>
                  {direction === 'left' ? '← Left Entry' : 'Right Entry →'}
                </div>
              </div>

              {/* Floating Action Button */}
              <motion.button
                onClick={() => onOpenModal(project)}
                className="absolute bottom-6 right-6 w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group/btn"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ExternalLink className="w-6 h-6 text-gray-900 group-hover/btn:text-indigo-600 transition-colors" />
              </motion.button>

              {/* Tech Stack Overlay */}
              <div className="absolute bottom-6 left-6 space-y-2">
                {project.tech.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="block px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-gray-900 text-sm font-medium shadow-lg"
                  >
                    {tech}
                  </span>
                ))}
                {project.tech.length > 3 && (
                  <span className="block px-3 py-1 rounded-full bg-indigo-600/90 backdrop-blur-sm text-white text-sm font-medium shadow-lg">
                    +{project.tech.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Decorative Elements */}
            <div className={`absolute -top-6 ${direction === 'left' ? '-right-6' : '-left-6'} w-32 h-32 ${
              direction === 'left' 
                ? 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20' 
                : 'bg-gradient-to-br from-purple-500/20 to-pink-500/20'
            } rounded-full blur-3xl -z-10`} />
          </div>

          {/* Content Side */}
          <div className={`space-y-6 ${direction === 'right' ? 'lg:col-start-1' : ''}`}>
            {/* Recognition badge (kept) */}
            <div className="flex items-start justify-between">
              <div />

              {project.recognition && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400">
                  <Award className="w-4 h-4" />
                  <span className="text-sm font-medium">{project.recognition}</span>
                </div>
              )}
            </div>

            {/* Title */}
            <h3 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              {project.title}
            </h3>

            {/* Year */}
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Calendar className="w-5 h-5" />
              <span className="text-lg font-medium">{project.year}</span>
            </div>

            {/* Description */}
            <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              {project.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => onOpenModal(project)}
                className={`px-8 py-4 rounded-xl text-white font-semibold shadow-lg transition-all duration-300 hover:shadow-xl ${
                  direction === 'left'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-500/30 hover:shadow-blue-500/40'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-purple-500/30 hover:shadow-purple-500/40'
                }`}
              >
                View Details
              </button>

              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                >
                  <GithubIcon className="w-5 h-5" />
                  GitHub
                </a>
              )}

              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                  Live Demo
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mobile Fallback Component
interface MobileFallbackProps {
  projects: Project[];
  onOpenModal: (project: Project) => void;
}

const MobileFallback: React.FC<MobileFallbackProps> = ({ projects, onOpenModal }) => {
  return (
    <div className="space-y-8 px-6 py-12">
      <div className="text-center mb-12">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Mobile Project Showcase
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Simplified view for mobile devices with accessibility in mind
        </p>
      </div>

      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="aspect-video relative">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>
          
          <div className="p-6">
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {project.title}
            </h4>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {project.description}
            </p>
            
            <button
              onClick={() => onOpenModal(project)}
              className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              View Details
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Project Modal Component
interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    // Save current scroll position
    const scrollY = window.scrollY;
    
    // Lock scroll
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    return () => {
      // Restore scroll
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    };
  }, []);

  return (
    <motion.div
      key="modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto"
      data-lenis-prevent=""
      data-lenis-prevent-wheel=""
      data-lenis-prevent-touch=""
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <motion.div
        className="max-w-6xl w-full my-8 rounded-3xl shadow-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden"
        initial={{ scale: 0.9, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
        exit={{ scale: 0.95, y: 20, opacity: 0, transition: { duration: 0.25 } }}
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          className="max-h-[85vh] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-gray-200 dark:scrollbar-track-gray-800"
          data-lenis-prevent=""
          data-lenis-prevent-wheel=""
          data-lenis-prevent-touch=""
          style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
        >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {project.recognition && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-xs font-medium">
                    <Award className="w-3 h-3" />
                    {project.recognition}
                  </div>
                )}
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
                  <Calendar className="w-4 h-4" />
                  {project.year}
                </div>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                {project.title}
              </h3>
            </div>

            <button 
              aria-label="Close modal" 
              onClick={onClose} 
              className="ml-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-4">
            {project.github && (
              <a 
                href={project.github} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm font-medium"
              >
                <GithubIcon className="w-4 h-4" />
                View Code
              </a>
            )}
            {project.url && (
              <a 
                href={project.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors text-sm font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                Live Demo
              </a>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-8">
          {/* Description */}
          <div>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Screenshots Gallery */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Code className="w-5 h-5 text-indigo-600" />
              Project Showcase
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 w-full h-[400px] relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 group">
                {project.video ? (
                  <video
                    src={project.video}
                    poster={project.image}
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  <Image 
                    src={project.screenshots?.[0] ?? project.image} 
                    alt={`${project.title} main screenshot`} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                )}
              </div>

              {project.screenshots && project.screenshots.slice(1).map((src, i) => (
                <div key={i} className="h-48 relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 group">
                  <Image 
                    src={src} 
                    alt={`${project.title} screenshot ${i + 2}`} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              🛠️ Technologies Used
            </h4>
            <div className="flex flex-wrap gap-3">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-medium text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProjectsTimeline;