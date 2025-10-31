'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { PERSONAL_INFO } from '@/constants';
import Lenis from 'lenis';
import { ParticleField, NeuralBackground, ParallaxOrbs } from './backgrounds/AnimatedBackgrounds';
import {
  FiCheckCircle,
  FiCode,
  FiCpu,
  FiAward,
  FiGithub,
  FiLinkedin,
  FiUser,
  FiCalendar,
  FiTrendingUp,
  FiDatabase,
  FiServer,
  FiLayers,
  FiZap,
  FiTarget,
  FiActivity,
  FiShield,
  FiGlobe,
  FiBookOpen,
  FiStar,
  FiExternalLink,
  FiMapPin,
  FiClock,
  FiPlay,
  FiPause,
  FiChevronRight
} from 'react-icons/fi';

export default function About() {
  const [activeTab, setActiveTab] = useState('about');
  const [flipped, setFlipped] = useState(false);
  const [statsAnimated, setStatsAnimated] = useState(false);
  const [isStatsInView, setIsStatsInView] = useState(false);
  const [selectedTimelineItem, setSelectedTimelineItem] = useState<number | null>(null);
  const [timelineAutoPlay, setTimelineAutoPlay] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const [shouldRenderBg, setShouldRenderBg] = useState(false);
  const timelineContainerRef = useRef<HTMLDivElement>(null);

  // Initialize Lenis smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    setShouldRenderBg(!mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setShouldRenderBg(!event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Enhanced scroll-to for tab changes with Lenis
  const scrollToSection = (elementId: string) => {
    if (lenisRef.current) {
      const element = document.getElementById(elementId);
      if (element) {
        lenisRef.current.scrollTo(element, {
          offset: -100,
          duration: 1.5,
          easing: (t) => 1 - Math.pow(1 - t, 3),
        });
      }
    }
  };

  // Intersection Observer for stats animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsStatsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Animated counter hook
  const useCounter = (end: number, duration: number = 2000) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
      if (!isStatsInView) return;
      
      let startTime: number;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        setCount(Math.floor(progress * end));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }, [end, duration, isStatsInView]);
    
    return count;
  };

  // Stats data
  const stats = [
    { label: 'Projects Completed', value: useCounter(8), suffix: '+', icon: FiTarget },
    { label: 'LeetCode Problems', value: useCounter(300), suffix: '+', icon: FiCode },
    { label: 'CGPA', value: useCounter(851), suffix: '', icon: FiTrendingUp, format: (val: number) => (val / 100).toFixed(2) },
    { label: 'GitHub Commits', value: useCounter(500), suffix: '+', icon: FiGithub }
  ];



  // Timeline data
  const timeline = [
    {
      year: '2022',
      date: 'August 2022',
      title: 'Started B.Tech IT Journey',
      company: 'Amity University',
      location: 'Noida, UP',
      description: 'Began my journey in Information Technology with focus on programming fundamentals and data structures.',
      achievements: [
        'Built strong foundation in C/C++ programming',
        'Started competitive programming on LeetCode',
        'Learned Data Structures & Algorithms',
        'Developed first web applications with HTML, CSS, JavaScript'
      ],
      technologies: ['C', 'C++', 'HTML', 'CSS', 'JavaScript', 'DSA'],
      icon: FiBookOpen,
      status: 'completed',
      duration: '4 years program'
    },
    {
      year: '2023',
      date: 'Year 2023',
      title: 'Algorithm Visualization Platform',
      company: 'Academic Project',
      location: 'Personal Development',
      description: 'Built interactive web application for visualizing sorting, searching, and graph algorithms to improve conceptual understanding.',
      achievements: [
        'Implemented dynamic visualizations for sorting algorithms',
        'Created graph algorithm visualizations (Dijkstra, MST, DFS, BFS)',
        'Enhanced academic engagement and learning experience',
        'Optimized rendering for smooth animations across devices'
      ],
      technologies: ['JavaScript', 'HTML5 Canvas', 'Chart.js', 'CSS', 'Algorithms'],
      icon: FiCode,
      status: 'completed',
      duration: '3 months',
      link: 'https://your-algorithm-visualization.vercel.app'
    },
    {
      year: '2024',
      date: 'March 2024',
      title: 'Smart India Hackathon 2024 Finalist',
      company: 'SIH 2024 - Social Spy Project',
      location: 'National Level Competition',
      description: 'Developed Social Media Data Extraction Tool, achieving grand finalist status in India\'s largest hackathon.',
      achievements: [
        'Led team of 6 developers to national grand finals',
        'Engineered Flask-based tool integrating 5+ platform APIs (Instagram, Facebook, Twitter, Gmail, Telegram)',
        'Implemented automated PDF report generation with MongoDB backend',
        'Achieved 40% improvement in data collection efficiency',
        'Built robust multi-API orchestration with rate-limit handling'
      ],
      technologies: ['Flask', 'Python', 'MongoDB', 'REST APIs', 'Selenium', 'Celery', 'PDF Generation'],
      icon: FiAward,
      status: 'completed',
      duration: '6 months',
      link: '#projects'
    },
    {
      year: '2024',
      date: 'September 2024',
      title: 'Exam Central - Role-based Exam Management',
      company: 'Hackathon Project',
      location: 'Full-Stack Development',
      description: 'Developed comprehensive role-based examination management platform with modern tech stack and containerized deployment.',
      achievements: [
        'Built with Next.js, Prisma ORM, and Clerk authentication',
        'Implemented secure RBAC and multi-session handling',
        'Containerized deployment with Docker for consistency',
        'Automated environment setup with env configs and migrations',
        'Reduced deployment errors by 40% through automation'
      ],
      technologies: ['Next.js', 'React', 'Prisma', 'Clerk', 'Docker', 'PostgreSQL', 'TypeScript'],
      icon: FiLayers,
      status: 'completed',
      duration: '2 months',
      link: 'https://github.com/yourusername/exam-central'
    },
    {
      year: '2024',
      date: 'Late 2024',
      title: 'Smart Pet Feeder using IoT',
      company: 'Personal Innovation Project',
      location: 'IoT Development',
      description: 'Built IoT-based smart pet feeder with ESP8266 for automated food dispensing and remote control capabilities.',
      achievements: [
        'Designed embedded system using ESP8266 and servo motor',
        'Implemented scheduling with NTP-based time synchronization',
        'Built web dashboard for schedule management and manual feeding',
        'Enabled secure web-based remote control and feeding logs',
        'Learned practical embedded systems and IoT integration'
      ],
      technologies: ['ESP8266', 'C', 'HTML', 'CSS', 'IoT', 'Web Server', 'Arduino'],
      icon: FiCpu,
      status: 'completed',
      duration: '1 month'
    },
    {
      year: '2025',
      date: 'May - July 2025',
      title: 'Real-Time DDoS Attack Detection System',
      company: 'Horizon17 Technology and Sustainability Pvt Ltd',
      location: 'Industry Internship (Remote)',
      description: 'Built enterprise-grade real-time DDoS detection system with 92%+ accuracy using Machine Learning and Kafka pipelines.',
      achievements: [
        'Achieved 92%+ detection accuracy using optimized Logistic Regression model',
        'Implemented Kafka-based data pipelines for real-time flow handling',
        'Built FastAPI backend with multithreading for continuous inference at scale',
        'Designed Grafana dashboard with automated security alerts',
        'Optimized API latency and system performance',
        'Reduced security response time significantly'
      ],
      technologies: ['Python', 'FastAPI', 'Apache Kafka', 'Grafana', 'Elasticsearch', 'WireShark', 'Machine Learning', 'Logistic Regression'],
      icon: FiShield,
      status: 'completed',
      duration: '3 months',
      link: 'https://github.com/yourusername/ddos-detection'
    },
    {
      year: 'Present',
      date: 'October 2025',
      title: 'Full-Stack Developer & ML Enthusiast',
      company: 'Continuous Learning & Building',
      location: 'Crafting Future Solutions',
      description: 'Continuing to build scalable applications, explore cutting-edge technologies, and solve real-world problems.',
      achievements: [
        'Solved 250+ problems on LeetCode for strong DSA foundation',
        'Building advanced portfolio with Next.js, TypeScript, and Framer Motion',
        'Exploring AI/ML integration in modern web applications',
        'NVIDIA Deep Learning Certified',
        'CISCO Cybersecurity & CCNA Certified',
        'Contributing to open source and mentoring peers'
      ],
      technologies: ['Next.js', 'React', 'TypeScript', 'Python', 'Machine Learning', 'Cybersecurity', 'Full Stack'],
      icon: FiZap,
      status: 'ongoing',
      duration: 'Ongoing'
    }
  ];

  const tabs = [
    { id: 'about', label: 'About', icon: FiUser },
    { id: 'timeline', label: 'Journey', icon: FiCalendar }
  ];

  return (
    <section
      id="about"
      className="relative w-full py-20 md:py-28 px-4 sm:px-6 lg:px-8 text-white overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950/80 to-slate-950"
      role="main"
      aria-labelledby="about-heading"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950/70 to-slate-950 z-0" />
        {shouldRenderBg && (
          <>
            <ParticleField
              particleCount={150}
              speed={0.55}
              opacityRange={[0.3, 0.85]}
              hueRange={[280, 320]}
              className="z-10 mix-blend-screen"
            />
            <NeuralBackground
              nodeCount={60}
              connectionDistance={130}
              connectionOpacity={0.4}
              nodeColor="rgba(244, 114, 182, 0.55)"
              connectionColor="rgba(168, 85, 247, 0.95)"
              pulseSpeed={5200}
              className="z-20 mix-blend-screen"
            />
            <ParallaxOrbs
              orbCount={42}
              speed={0.001}
              radiusRange={[8, 26]}
              depthRange={[0.35, 1.2]}
              colors={[
                'rgba(236, 72, 153, 0.55)',
                'rgba(129, 140, 248, 0.5)',
                'rgba(56, 189, 248, 0.48)',
                'rgba(244, 114, 182, 0.5)'
              ]}
              className="z-30 mix-blend-screen"
            />
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/65 z-40" />
      </div>

      <div className="relative z-50 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 mb-4">
            About Alok
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Full-Stack Developer & Machine Learning Enthusiast crafting scalable solutions and real-world impact
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          ref={statsRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.label}
                className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 text-center hover:bg-white/10 transition-all duration-300"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ scale: 1.05 }}
              >
                <IconComponent className="w-8 h-8 mx-auto mb-3 text-blue-400" />
                <div className="text-3xl font-bold text-white mb-1">
                  {stat.format ? stat.format(stat.value) : stat.value}{stat.suffix}
                </div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-2 border border-white/10">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-pink-500 to-indigo-500 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence>
          {activeTab === 'about' && (
            <motion.div
              key="about"
              className="flex flex-col lg:flex-row items-center gap-12"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Profile Image */}
              <div className="w-full lg:w-2/5 flex justify-center">
                <div className="relative w-[350px] h-[350px] md:w-[400px] md:h-[400px]">
                  <motion.div
                    className="w-full h-full relative"
                    animate={{ rotateY: flipped ? 180 : 0 }}
                    transition={{ duration: 0.8 }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* Front Side */}
                    <div className="absolute w-full h-full backface-hidden overflow-hidden">
                      <Image
                        src="/profile/profile.jpg"
                        alt="Alok Kumar Yadav"
                        fill
                        sizes="(max-width: 768px) 350px, 400px"
                        className="object-cover rounded-2xl shadow-xl grayscale hover:grayscale-0 transition-all duration-500"
                        priority
                      />
                    </div>

                    {/* Back Side */}
                    <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-pink-500 to-indigo-500 rounded-2xl flex items-center justify-center p-6">
                      <p className="text-white text-xl md:text-2xl font-semibold text-center">
                        "Building tomorrow's solutions with today's passion"
                      </p>
                    </div>
                  </motion.div>

                  <motion.button
                    onClick={() => setFlipped(!flipped)}
                    className="absolute -bottom-3 -right-3 bg-gradient-to-r from-pink-500 to-indigo-500 p-3 rounded-full shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    aria-label="Flip card"
                  >
                    <FiStar className="text-white text-xl" />
                  </motion.button>
                </div>
              </div>

              {/* About Content */}
              <div className="w-full lg:w-3/5 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-white mb-4">Hello, I'm Alok Kumar Yadav</h3>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    A passionate <span className="text-indigo-400 font-semibold">Full-Stack Developer</span> and 
                    <span className="text-pink-400 font-semibold"> Machine Learning Enthusiast</span> currently pursuing 
                    B.Tech in Information Technology at Amity University with an impressive <span className="text-yellow-400">8.51 CGPA</span>.
                  </p>
                  <p className="text-gray-300">
                    I specialize in building scalable web applications, real-time cybersecurity systems, and automation tools. 
                    As a <span className="text-green-400 font-semibold">Smart India Hackathon 2024 Finalist</span>, I've proven my ability to 
                    deliver innovative solutions that solve real-world problems.
                  </p>
                  <p className="text-gray-300">
                    My expertise spans from <span className="text-blue-400">frontend development</span> with React and Next.js to 
                    <span className="text-purple-400"> backend systems</span> with FastAPI and Flask, complemented by deep knowledge in 
                    <span className="text-orange-400"> machine learning</span> and <span className="text-red-400">cybersecurity</span>.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {['React', 'TypeScript', 'Python', 'FastAPI', 'Machine Learning', 'Cybersecurity'].map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-full text-sm text-indigo-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <motion.a
                    href="#contact"
                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-lg font-medium text-center hover:shadow-lg transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Let's Connect
                  </motion.a>
                  <div className="flex gap-3 justify-center sm:justify-start">
                    <motion.a
                      href="https://github.com/7236alok"

                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition-all"
                      whileHover={{ scale: 1.1 }}
                    >
                      <FiGithub className="text-xl" />
                    </motion.a>
                    <motion.a
                      href="https://linkedin.com/in/7236alok"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition-all"
                      whileHover={{ scale: 1.1 }}
                    >
                      <FiLinkedin className="text-xl" />
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Removed legacy timeline skills/knowledge-graph block */}

          {activeTab === 'timeline' && (
            <motion.div
              key="timeline"
              className="max-w-6xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Timeline Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Professional Journey</h3>
                  <p className="text-gray-400">My path from student to developer</p>
                </div>
                <div className="flex items-center gap-4">
                  <motion.button
                    onClick={() => setTimelineAutoPlay(!timelineAutoPlay)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-lg border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {timelineAutoPlay ? <FiPause className="w-4 h-4" /> : <FiPlay className="w-4 h-4" />}
                    {timelineAutoPlay ? 'Pause' : 'Auto Play'}
                  </motion.button>
                </div>
              </div>

              {/* Scrollable Timeline Container */}
              <div 
                ref={timelineContainerRef}
                className="relative max-h-[600px] overflow-y-auto pr-4 scrollbar-timeline"
                data-lenis-prevent=""
                data-lenis-prevent-wheel=""
                data-lenis-prevent-touch=""
                style={{ 
                  overscrollBehavior: 'contain',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                {/* Enhanced Timeline line with progress */}
                <div className="absolute left-6 md:left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-500/30 via-purple-500/30 to-indigo-500/30 rounded-full"></div>
                <motion.div 
                  className="absolute left-6 md:left-8 top-0 w-1 bg-gradient-to-b from-pink-500 via-purple-500 to-indigo-500 rounded-full origin-top"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 2, delay: 0.5 }}
                  style={{ height: '100%' }}
                />
                
                <div className="space-y-12">
                  {timeline.map((item, index) => {
                    const ItemIcon = item.icon;
                    const isSelected = selectedTimelineItem === index;
                    const isCompleted = item.status === 'completed';
                    
                    return (
                      <motion.div
                        key={`${item.year}-${index}`}
                        className="relative"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 * index }}
                      >
                        <div className="flex items-start gap-6 md:gap-8">
                          {/* Enhanced Timeline dot */}
                          <motion.div 
                            className="relative z-10 flex-shrink-0"
                            whileHover={{ scale: 1.1 }}
                            onClick={() => setSelectedTimelineItem(isSelected ? null : index)}
                          >
                            <motion.div 
                              className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-lg cursor-pointer border-4 ${
                                isCompleted 
                                  ? 'bg-gradient-to-r from-pink-500 to-indigo-500 border-white/20' 
                                  : 'bg-gradient-to-r from-yellow-400 to-orange-500 border-white/20'
                              }`}
                              whileHover={{ 
                                boxShadow: "0 0 30px rgba(168, 85, 247, 0.4)",
                                scale: 1.05 
                              }}
                              animate={isSelected ? { 
                                boxShadow: "0 0 30px rgba(168, 85, 247, 0.6)",
                                scale: 1.1 
                              } : {}}
                            >
                              <ItemIcon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                            </motion.div>
                            
                            {/* Pulse effect for ongoing items */}
                            {!isCompleted && (
                              <motion.div
                                className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 opacity-30"
                                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                            )}
                          </motion.div>

                          {/* Enhanced Content Card */}
                          <motion.div 
                            className={`flex-1 transition-all duration-300 ${
                              isSelected ? 'transform scale-[1.02]' : ''
                            }`}
                            layout
                          >
                            <motion.div
                              className={`bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden hover:bg-white/8 transition-all duration-300 ${
                                isSelected ? 'border-purple-500/30 shadow-xl shadow-purple-500/10' : ''
                              }`}
                              whileHover={{ y: -2 }}
                            >
                              {/* Card Header */}
                              <div className="p-6 pb-4">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                    <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                                      isCompleted 
                                        ? 'text-green-400 bg-green-500/20 border border-green-500/30' 
                                        : 'text-yellow-400 bg-yellow-500/20 border border-yellow-500/30'
                                    }`}>
                                      {item.year}
                                    </span>
                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                      <FiClock className="w-3 h-3" />
                                      {item.duration}
                                    </span>
                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                      <FiMapPin className="w-3 h-3" />
                                      {item.location}
                                    </span>
                                  </div>
                                  
                                  {item.link && (
                                    <motion.a
                                      href={item.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-gray-400 hover:text-white transition-colors"
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      <FiExternalLink className="w-4 h-4" />
                                    </motion.a>
                                  )}
                                </div>

                                <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                                  {item.title}
                                </h3>
                                <div className="flex items-center gap-2 mb-3">
                                  <p className="text-indigo-300 font-medium">{item.company}</p>
                                  <span className="text-gray-500">•</span>
                                  <span className="text-sm text-gray-400">{item.date}</span>
                                </div>
                                <p className="text-gray-300 leading-relaxed">{item.description}</p>
                              </div>

                              {/* Expandable Section */}
                              <AnimatePresence>
                                {isSelected && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="border-t border-white/10"
                                  >
                                    <div className="p-6 pt-4 space-y-4">
                                      {/* Achievements */}
                                      <div>
                                        <h4 className="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
                                          <FiTarget className="w-4 h-4" />
                                          Key Achievements
                                        </h4>
                                        <ul className="space-y-2">
                                          {item.achievements.map((achievement, i) => (
                                            <motion.li
                                              key={i}
                                              className="flex items-start gap-2 text-sm text-gray-300"
                                              initial={{ opacity: 0, x: -10 }}
                                              animate={{ opacity: 1, x: 0 }}
                                              transition={{ delay: 0.1 * i }}
                                            >
                                              <FiChevronRight className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                              {achievement}
                                            </motion.li>
                                          ))}
                                        </ul>
                                      </div>

                                      {/* Technologies */}
                                      <div>
                                        <h4 className="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
                                          <FiCode className="w-4 h-4" />
                                          Technologies Used
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                          {item.technologies.map((tech, i) => (
                                            <motion.span
                                              key={tech}
                                              className="px-2 py-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded text-xs text-indigo-300"
                                              initial={{ opacity: 0, scale: 0.8 }}
                                              animate={{ opacity: 1, scale: 1 }}
                                              transition={{ delay: 0.05 * i }}
                                              whileHover={{ scale: 1.05 }}
                                            >
                                              {tech}
                                            </motion.span>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          </motion.div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Timeline Footer */}
                <motion.div
                  className="mt-12 text-center pb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500/20 to-indigo-500/20 border border-purple-500/30 rounded-full text-purple-300">
                    <FiZap className="w-4 h-4" />
                    <span className="text-sm font-medium">Journey continues...</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
