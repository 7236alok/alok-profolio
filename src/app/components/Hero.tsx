'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createCleanupableThrottle, createCleanupableDebounce } from '@/utils/performance';
import { HEADLINE_VARIANTS, ANIMATION_CONFIG, PERFORMANCE_CONFIG } from '@/constants';

// Configuration constants
const BLOB_CONFIG = ANIMATION_CONFIG.blob;

// Generate deterministic blob configurations
const generateBlobs = () => {
  return Array.from({ length: BLOB_CONFIG.count }, (_, i) => {
    // Seeded pseudo-random generator for consistency
    const random = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    const seed = i * 10;
    return {
      id: `blob-${i}`,
      width: BLOB_CONFIG.minSize + random(seed) * BLOB_CONFIG.maxSizeAddition,
      height: BLOB_CONFIG.minSize + random(seed + 1) * BLOB_CONFIG.maxSizeAddition,
      left: random(seed + 2) * BLOB_CONFIG.positionRange,
      top: random(seed + 3) * BLOB_CONFIG.positionRange,
      x: (random(seed + 4) - BLOB_CONFIG.animationOffset) * BLOB_CONFIG.positionRange,
      y: (random(seed + 5) - BLOB_CONFIG.animationOffset) * BLOB_CONFIG.positionRange,
      duration: random(seed + 6) * BLOB_CONFIG.maxDurationAddition + BLOB_CONFIG.minDuration,
    };
  });
};

const BLOBS = generateBlobs();

const Particles = () => {
  const particles = Array.from({ length: ANIMATION_CONFIG.particles.count }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    speed: Math.random() * 0.2 + 0.1
  }));

  return (
    <div className="absolute inset-0 overflow-hidden opacity-40">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            x: [0, (Math.random() - 0.5) * 20],
            y: [0, (Math.random() - 0.5) * 20],
          }}
          transition={{
            duration: 10 + Math.random() * 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      ))}
    </div>
  );
};

export default function Hero() {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const [inView, setInView] = useState(true); // Set to true initially to ensure content shows
  const [gradientPos, setGradientPos] = useState({ x: 50, y: 50 });
  const [currentHeadline, setCurrentHeadline] = useState<typeof HEADLINE_VARIANTS[number]>(HEADLINE_VARIANTS[0]);
  const [animationKey, setAnimationKey] = useState(0);

  // Initialize on mount
  useEffect(() => {
    setIsMounted(true);

    const handleInitialLoad = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      // Preload background image
      new Image().src = '/hero/background.jpg';
    };

    if (typeof window !== 'undefined') {
      handleInitialLoad();
    }
  }, []);

  // Set up intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (document.getElementById('hero')) {
      observer.observe(document.getElementById('hero')!);
    }

    return () => observer.disconnect();
  }, []);

  // Animate gradient background
  useEffect(() => {
    if (!isMounted) return;

    const interval = setInterval(() => {
        setGradientPos({
          x: 50 + (Math.random() - 0.5) * 20,
          y: 50 + (Math.random() - 0.5) * 20
        });
      }, PERFORMANCE_CONFIG.gradientUpdateInterval);    return () => clearInterval(interval);
  }, [isMounted]);

  // Rotate headlines
  useEffect(() => {
    if (!inView) return;

    const interval = setInterval(() => {
      setAnimationKey(prev => prev + 1);
      setTimeout(() => {
        setCurrentHeadline(prev => {
          const currentIndex = HEADLINE_VARIANTS.indexOf(prev);
          const nextIndex = (currentIndex + 1) % HEADLINE_VARIANTS.length;
          return HEADLINE_VARIANTS[nextIndex];
        });
      }, PERFORMANCE_CONFIG.animationTimeout);
    }, PERFORMANCE_CONFIG.headlineRotationInterval);

    return () => clearInterval(interval);
  }, [inView]);

  // Event handlers with cleanup
  const { throttledFunc: handleMouseMove, cancel: cancelThrottle } = useMemo(
    () =>
      createCleanupableThrottle((e: MouseEvent) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
        setCursorPosition({ x: e.clientX - 15, y: e.clientY - 15 });
      }, PERFORMANCE_CONFIG.throttleDelay),
    []
  );

  const { debouncedFunc: handleResize, cancel: cancelDebounce } = useMemo(() =>
    createCleanupableDebounce(() => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }, PERFORMANCE_CONFIG.debounceDelay)
    , []);

  useEffect(() => {
    if (!isMounted) return;

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      cancelThrottle();
      cancelDebounce();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMounted, handleMouseMove, handleResize, cancelThrottle, cancelDebounce]);

  // Combined background style
  const backgroundStyle = {
    backgroundImage: `radial-gradient(circle at ${gradientPos.x}% ${gradientPos.y}%, rgba(30, 27, 75, 0.8), rgba(15, 23, 42, 0.9)), url('/hero/background.jpg')`,
    backgroundPosition: `${50 + (mousePosition.x / windowSize.width - 0.5) * 10}% ${50 + (mousePosition.y / windowSize.height - 0.5) * 10}%`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundBlendMode: 'overlay',
    transition: 'background-image 3s ease-out, background-position 0.1s linear'
  };

  return (
    <section
      id="hero"
      className="relative h-screen bg-cover bg-center flex items-center justify-center w-full overflow-hidden"
      style={backgroundStyle}
      role="banner"
      aria-label="Hero section with introduction and navigation"
    >
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-purple-900/20 to-black/80 backdrop-blur-sm">
        {isMounted && (
          <>
            <Particles />
            <div className="absolute inset-0 opacity-20">
              {BLOBS.map((blob) => (
                <motion.div
                  key={blob.id}
                  className="absolute rounded-full bg-indigo-500"
                  style={{
                    width: `${blob.width}px`,
                    height: `${blob.height}px`,
                    left: `${blob.left}%`,
                    top: `${blob.top}%`,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{
                    x: [0, blob.x],
                    y: [0, blob.y],
                    opacity: [0.1, 0.3, 0.1],
                  }}
                  whileHover={{ scale: 1.2, opacity: 0.5 }}
                  transition={{
                    duration: blob.duration,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Enhanced Custom Cursor */}
      {isMounted && (
        <>
          <motion.div
            className="fixed w-6 h-6 rounded-full bg-transparent border-2 border-indigo-400 pointer-events-none z-50 mix-blend-difference"
            animate={{
              x: cursorPosition.x + 2,
              y: cursorPosition.y + 2,
              scale: isHovered ? 1.5 : 1,
              opacity: isHovered ? 0.9 : 1
            }}
            transition={{
              type: "spring",
              damping: 22,
              stiffness: 350,
              scale: {
                type: "spring",
                stiffness: 450,
                damping: 10
              }
            }}
          />

          <motion.div
            className="fixed w-5 h-5 rounded-full bg-indigo-500/20 pointer-events-none z-40"
            animate={{
              x: cursorPosition.x + 4,
              y: cursorPosition.y + 4,
              scale: isHovered ? 2 : 1.3,
              opacity: isHovered ? 0.3 : 0.15
            }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 250,
              delay: 0.03
            }}
          />

          {isHovered && (
            <motion.div
              className="fixed px-2 py-1 rounded-md bg-indigo-600 text-white text-xs pointer-events-none z-50"
              initial={{ opacity: 0, y: 5 }}
              animate={{
                x: cursorPosition.x + 8,
                y: cursorPosition.y + 8,
                opacity: 1
              }}
              transition={{
                type: "spring",
                stiffness: 600,
                damping: 20
              }}
            >
              Click me!
            </motion.div>
          )}
        </>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 w-full max-w-[1800px] mx-auto">
        {/* Header Section */}
        <header className="space-y-6 mb-10 sm:mb-12">
          <motion.h1
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold text-white tracking-wide leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            onMouseMove={(e) => {
              const x = e.nativeEvent.offsetX;
              const y = e.nativeEvent.offsetY;
              e.currentTarget.style.setProperty('--x', `${x}px`);
              e.currentTarget.style.setProperty('--y', `${y}px`);
            }}
            style={{
              backgroundImage: 'radial-gradient(circle at var(--x, 100px) var(--y, 100px), #4f46e5, #7c3aed)',
              backgroundSize: '200% 200%',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
            }}
          >
            Hi, I&apos;m <span className="text-transparent">Alok Yadav</span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-2xl md:text-3xl text-gray-200 max-w-2xl mx-auto min-h-[4rem]"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <AnimatePresence>
              <motion.span
                key={animationKey}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="inline-block"
              >
                {currentHeadline}
              </motion.span>
            </AnimatePresence>
          </motion.p>
        </header>

        {/* Call to Action */}
        <nav aria-label="Main navigation">
          <motion.div
            whileHover={isMounted ? { scale: 1.05 } : {}}
            whileTap={isMounted ? { scale: 0.95 } : {}}
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <a
              href="#projects"
              className={`px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 flex items-center ${isHovered
                  ? 'bg-white text-indigo-600 shadow-lg'
                  : 'bg-indigo-600 text-white shadow-md hover:shadow-lg'
                } focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-700`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('projects')?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start'
                });
              }}
            >
              Explore My Work
              <motion.span
                animate={isMounted ? { x: isHovered ? 5 : 0 } : {}}
                transition={{ type: 'spring', stiffness: 500 }}
                className="ml-2"
                aria-hidden="true"
              >
                {isHovered ? '👉' : '↓'}
              </motion.span>
            </a>
          </motion.div>
        </nav>

        {/* Social Links (Optional Addition) */}
        <motion.div
          className="flex gap-4 mt-8"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          {/* Add your social media links/icons here */}
        </motion.div>

        {/* Scroll Indicator */}
        {isMounted && (
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0, y: 0 }}
            animate={inView ? { opacity: 1, y: [0, 10, 0] } : { opacity: 0, y: 0 }}
            transition={{ opacity: { delay: 1, duration: 0.5 }, y: { duration: 2, repeat: Infinity } }}
          >
            <div className="w-6 h-10 border-2 border-indigo-400 rounded-full flex justify-center">
              <motion.div
                className="w-1 h-2 bg-indigo-400 rounded-full mt-1"
                animate={{ y: [0, 4, 0], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}