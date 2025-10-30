"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Menu, X, Github, Linkedin, Download, ArrowUp } from "lucide-react";
import { NAVIGATION_ITEMS, SOCIAL_LINKS } from "@/constants";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("#hero");
  const [scrollState, setScrollState] = useState({
    hidden: false,
    elevated: false,
    showToTop: false,
  });

  // Destructure for cleaner usage
  const { hidden, elevated, showToTop } = scrollState;

  const navRef = useRef<HTMLElement | null>(null);
  const lastScrollY = useRef(0);
  const rafId = useRef<number | null>(null);

  // Unified scroll handler (performance optimized with RAF)
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll("section[id]")) as HTMLElement[];
    
    const handleScroll = () => {
      if (rafId.current !== null) return;
      
      rafId.current = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const scrollDiff = currentScrollY - lastScrollY.current;
        const scrollPos = currentScrollY + 150;

        // Find active section
        let currentSection = "hero";
        for (let i = sections.length - 1; i >= 0; i--) {
          if (sections[i].offsetTop <= scrollPos) {
            currentSection = sections[i].id;
            break;
          }
        }

        const mapped = NAVIGATION_ITEMS.find(
          n => n.href.replace(/^#/, "") === currentSection
        )?.name || currentSection.charAt(0).toUpperCase() + currentSection.slice(1);

        setActiveLink(mapped);

        // Update scroll states
        setScrollState({
          elevated: currentScrollY > 50,
          hidden: currentScrollY > 200 && scrollDiff > 5,
          showToTop: currentScrollY > 500,
        });

        lastScrollY.current = currentScrollY;
        rafId.current = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  // Enhanced smooth scroll with proper offset
  const handleAnchorClick = useCallback((
    e: React.MouseEvent<HTMLAnchorElement>,
    name: string,
    href: string
  ) => {
    if (!href.startsWith("#")) return;
    
    e.preventDefault();
    
    const targetId = href.replace(/^#/, "");
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      // Get navbar height for offset
      const navbarHeight = navRef.current?.offsetHeight || 0;
      const targetPosition = targetElement.offsetTop - navbarHeight - 20;
      
      // Smooth scroll with offset
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });
      
      setActiveLink(name);
      setIsMenuOpen(false);
      
      // Update URL without jumping
      if (window.history.replaceState) {
        window.history.replaceState(null, "", href);
      }
    }
  }, []);

  // Scroll progress bar
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { 
    stiffness: 100, 
    damping: 30, 
    restDelta: 0.001 
  });

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-4 left-0 right-0 z-50 transition-all duration-300 ${
          hidden ? "-translate-y-[150%]" : "translate-y-0"
        }`}
        aria-label="Primary Navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`relative backdrop-blur-xl transition-all duration-300 ${
              elevated
                ? "bg-gray-900/80 shadow-2xl shadow-black/20"
                : "bg-gray-900/60 shadow-lg"
            } border border-white/10 rounded-2xl px-6 py-4 flex items-center justify-between`}
          >
            {/* Scroll progress bar */}
            <motion.div
              className="absolute left-0 bottom-0 h-[3px] w-full origin-left rounded-b-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600"
              style={{ scaleX: progress }}
            />

            {/* Logo */}
            <a
              href="#hero"
              onClick={(e) => handleAnchorClick(e, "Home", "#hero")}
              className="flex items-center gap-3 text-white no-underline group"
            >
              <div className="relative w-11 h-11 rounded-xl overflow-hidden border-2 border-white/20 shadow-lg group-hover:border-cyan-400/50 transition-all duration-300">
                <Image
                  src="/navbar/logo.png"
                  alt="AY Logo"
                  fill
                  sizes="44px"
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  priority
                />
              </div>
              <div className="hidden sm:block">
                <div className="text-base font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Alok Yadav
                </div>
                <div className="text-xs text-gray-400 font-medium">
                  Full-Stack & ML Engineer
                </div>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <nav className="flex gap-1" aria-label="Main navigation">
                {NAVIGATION_ITEMS.map((item) => {
                  const isActive = activeLink === item.name;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={(e) => handleAnchorClick(e, item.name, item.href)}
                      className={`relative px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-lg ${
                        isActive
                          ? "text-white"
                          : "text-gray-300 hover:text-white"
                      }`}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <motion.span
                          layoutId="navbar-indicator"
                          className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg border border-cyan-500/30"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}
                      
                      {/* Text with proper z-index */}
                      <span className="relative z-10">{item.name}</span>
                    </a>
                  );
                })}
              </nav>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                <motion.a
                  href="/resume.pdf"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg text-sm font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="w-4 h-4" />
                  Resume
                </motion.a>

                {/* Social Links */}
                <motion.a
                  href={SOCIAL_LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="GitHub Profile"
                >
                  <Github className="w-5 h-5" />
                </motion.a>

                <motion.a
                  href={SOCIAL_LINKS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-5 h-5" />
                </motion.a>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMenuOpen((s) => !s)}
              className="md:hidden p-2 rounded-lg bg-white/5 text-gray-200 hover:bg-white/10 transition-colors"
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle mobile menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </motion.button>
          </div>

          {/* Mobile Menu */}
          <motion.div
            initial={false}
            animate={{
              height: isMenuOpen ? "auto" : 0,
              opacity: isMenuOpen ? 1 : 0,
              y: isMenuOpen ? 0 : -20,
            }}
            transition={{
              duration: 0.3,
              ease: [0.04, 0.62, 0.23, 0.98],
            }}
            className="md:hidden overflow-hidden"
          >
            <div className="mt-2 bg-gray-900/90 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-white/10">
              {/* Mobile Navigation Links */}
              <nav className="flex flex-col gap-1 mb-4">
                {NAVIGATION_ITEMS.map((item) => {
                  const isActive = activeLink === item.name;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={(e) => handleAnchorClick(e, item.name, item.href)}
                      className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                        isActive
                          ? "text-white bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30"
                          : "text-gray-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {item.name}
                    </a>
                  );
                })}
              </nav>

              {/* Mobile Resume Button */}
              <a
                href="/resume.pdf"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg text-sm font-semibold shadow-lg mb-4"
              >
                <Download className="w-4 h-4" />
                Download Resume
              </a>

              {/* Mobile Social Links */}
              <div className="flex items-center justify-center gap-4 pt-4 border-t border-white/10">
                <a
                  href={SOCIAL_LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                  aria-label="GitHub Profile"
                >
                  <Github className="w-5 h-5" />
                  <span className="text-sm font-medium">GitHub</span>
                </a>
                <a
                  href={SOCIAL_LINKS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-5 h-5" />
                  <span className="text-sm font-medium">LinkedIn</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </nav>

      {/* Scroll to Top Button */}
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed right-6 bottom-6 z-50 p-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 backdrop-blur-sm border border-white/20"
        initial={{ opacity: 0, y: 20, scale: 0.8 }}
        animate={{
          opacity: showToTop ? 1 : 0,
          y: showToTop ? 0 : 20,
          scale: showToTop ? 1 : 0.8,
          pointerEvents: showToTop ? "auto" : "none",
        }}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
        transition={{
          duration: 0.3,
          ease: "easeOut",
        }}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>
    </>
  );
}