// Advanced Hero Component with Professional-Level Features
'use client';

import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useSpring, useTransform, useMotionValue, useScroll } from 'framer-motion';
import { Download, Github, Linkedin, Mail, ArrowDown, Zap, Code, Sparkles, Play, Settings, Search, Terminal as TerminalIcon, X } from 'lucide-react';
import { createCleanupableThrottle, createCleanupableDebounce } from '@/utils/performance';
import { HEADLINE_VARIANTS, ANIMATION_CONFIG, PERFORMANCE_CONFIG, PERSONAL_INFO, SOCIAL_LINKS } from '@/constants';
import { 
  staggerContainer, 
  fadeInUp, 
  scaleOnHover, 
  textReveal,
  holographicShimmer,
  neuralPulse,
  quantumFloat
} from '@/utils/advancedAnimations';
import { AdaptiveRenderer, cssShaderEffects, cssAnimations } from '@/utils/webglEffects';
import { 
  AdvancedTokenizer, 
  IntelliSense, 
  DiagnosticIndicator, 
  FileTree, 
  Tab, 
  StatusBar 
} from '@/components/AdvancedVSCode';
import { ParticleField, NeuralBackground } from './backgrounds/AnimatedBackgrounds';

// Advanced Configuration with Performance Optimizations
const ADVANCED_CONFIG = {
  ...ANIMATION_CONFIG,
  webgl: {
    enabled: true,
    particleCount: 200,
    connectionDistance: 150,
    maxConnections: 5,
  },
  audio: {
    enabled: false, // Can be toggled
    sensitivity: 50,
    frequencyRange: [20, 2000],
  },
  neural: {
    nodeCount: 50,
    connectionOpacity: 0.3,
    pulseSpeed: 4000, // Increased from 2000 to slow down movement
  },
  performance: {
    useRAF: true,
    gpuAcceleration: true,
    lowPowerMode: false,
  }
};

// Background components are shared via ParticleField and NeuralBackground

// VS Code typing animation component with advanced features
interface AdvancedTypewriterProps {
  files: Array<{
    name: string;
    content: string;
    language: string;
  }>;
  currentFileIndex: number;
  speed?: number;
  showIntelliSense?: boolean;
}

const AdvancedTypewriter: React.FC<AdvancedTypewriterProps> = ({ 
  files, 
  currentFileIndex, 
  speed = 50,
  showIntelliSense = true
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);
  const [intelliSenseVisible, setIntelliSenseVisible] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const currentFile = files[currentFileIndex] || files[0];
  const tokens = useMemo(() => 
    AdvancedTokenizer.tokenize(displayText, currentFile.language), 
    [displayText, currentFile.language]
  );

  // Realistic typing with variable speed and pauses
  useEffect(() => {
    if (currentIndex < currentFile.content.length) {
      const char = currentFile.content[currentIndex];
      let delay = speed;
      
      // Vary typing speed for realism
      if (char === ' ') delay = speed * 0.3; // Faster for spaces
      else if (/[{}();,.]/.test(char)) delay = speed * 1.5; // Slower for punctuation
      else if (/[A-Z]/.test(char)) delay = speed * 1.2; // Slightly slower for capitals
      
      // Random human-like variation
      delay += Math.random() * speed * 0.5;

      const timer = setTimeout(() => {
        setDisplayText(prev => prev + char);
        setCurrentIndex(prev => prev + 1);
        
        // Show IntelliSense occasionally when typing function names
        if (showIntelliSense && Math.random() < 0.1 && /[a-zA-Z]/.test(char)) {
          setIntelliSenseVisible(true);
          setTimeout(() => setIntelliSenseVisible(false), 2000);
        }
      }, delay);

      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
      // Reset for next file or loop
      setTimeout(() => {
        setDisplayText('');
        setCurrentIndex(0);
        setIsTyping(true);
      }, 3000);
    }
  }, [currentIndex, currentFile.content, speed, showIntelliSense]);

  // Cursor blinking
  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(cursorTimer);
  }, []);

  const mockSuggestions = [
    { label: 'useState', kind: 'function' as const, detail: 'React Hook', documentation: 'Returns a stateful value and a function to update it.' },
    { label: 'useEffect', kind: 'function' as const, detail: 'React Hook', documentation: 'Lets you perform side effects in function components.' },
    { label: 'console', kind: 'variable' as const, detail: 'Global object' },
    { label: 'Component', kind: 'class' as const, detail: 'React.Component' },
  ];

  return (
    <div className="relative font-mono">
      <div className="text-white leading-relaxed">
        {AdvancedTokenizer.renderTokens(tokens)}
        {showCursor && isTyping && (
          <motion.span
            className="inline-block w-0.5 h-5 bg-white ml-0.5"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.53, repeat: Infinity }}
          />
        )}
      </div>
      
      <AnimatePresence>
        {intelliSenseVisible && (
          <IntelliSense
            suggestions={mockSuggestions}
            position={{ x: cursorPosition.x, y: cursorPosition.y + 20 }}
            visible={intelliSenseVisible}
            selectedIndex={0}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default function AdvancedHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Enhanced state management
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const [currentHeadline, setCurrentHeadline] = useState<typeof HEADLINE_VARIANTS[number]>(HEADLINE_VARIANTS[0]);
  const [deviceCapabilities, setDeviceCapabilities] = useState({
    supportsWebGL: false,
    supportsIntersectionObserver: false,
    isHighPerformance: false,
    prefersReducedMotion: false,
  });
  
  // VS Code interface state
  const [openTabs, setOpenTabs] = useState<Array<{name: string; content: string; language: string; hasChanges?: boolean}>>([]);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [selectedFile, setSelectedFile] = useState('portfolio.tsx');
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [terminalVisible, setTerminalVisible] = useState(true);

  // Framer Motion values for advanced animations
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const { scrollYProgress } = useScroll();
  
  // Transform mouse position to smooth values
  const rotateX = useTransform(mouseY, [0, 1], [5, -5]);
  const rotateY = useTransform(mouseX, [0, 1], [-5, 5]);

  // Mock project structure with Alok's profile files
  const projectFiles = [
    {
      name: 'src',
      type: 'folder' as const,
      children: [
        {
          name: 'profile',
          type: 'folder' as const,
          children: [
            {
              name: 'ALOK_PROFILE.md',
              type: 'file' as const,
              content: `# Alok Kumar Yadav\n\n7236alokyadav@gmail.com || +917236835404\nLinkedin.com || GitHub.com\n\n## ABOUT\nFull-Stack Developer and Machine Learning Enthusiast with experience in delivering scalable web applications, realtime cybersecurity systems, and automation tools. Proven Smart India Hackathon Finalist with strong skills in backend, frontend, and data engineering, focused on performance optimization and solving real-world problems.\n\n## EDUCATION\n- B.Tech in Information Technology (2022–2026) — CGPA: 8.51\n  - Amity University (Noida, UP)\n- Class XII (PCM) — Renaissance Academy (Gorakhpur, UP) (2019 – 2020)\n\n## SKILL SUMMARY\n- Languages: C, C++, Python, JavaScript (HTML, CSS)\n- Frameworks & Libraries: FastAPI, Flask, Next.js, React, Scikit-learn, Keras, Pandas, NumPy, Matplotlib, Chart.js\n- Databases & Tools: MySQL, MongoDB, Elasticsearch, Docker, Git, VS Code, Jupyter Notebook\n- Specialization: Machine Learning (DNN, Feature Engineering), Cybersecurity (DDoS Detection, WAF Log Analysis, Threat Detection), Real-Time Data Streaming (Apache Kafka, Grafana)\n\n## EXPERIENCE\n- Real-Time DDoS Attack Detection System (May 2025 – July 2025) — Horizon17 Technology and Sustainability Pvt. Ltd.\n  - Built and deployed a real-time DDoS detection system using Logistic Regression, Kafka pipelines, and FastAPI, achieving 90%+ detection accuracy.\n  - Optimized API latency and implemented multithreading for continuous inference at scale.\n  - Designed a Grafana dashboard with automated alerts, enhancing monitoring efficiency and accelerating security response times.\n\n## PROJECTS\n1. Social Media Data Extraction Tool (SIH 2024 Finalist) — GitHub\n   - Engineered a Flask-based tool integrating APIs from 5+ platforms (Instagram, Facebook, Twitter, Gmail, Telegram).\n   - Automated cross-platform data extraction and PDF report generation with MongoDB backend.\n   - Boosted data collection efficiency by 40%; recognized as a Smart India Hackathon 2024 Finalist.\n\n2. Algorithm Visualization — LINK\n   - Built an interactive web app with HTML, CSS, JavaScript, and Chart.js to visualize algorithms.\n\n3. Exam Central — (Hackathon) — GitHub\n   - Developed a role-based exam management system with Next.js, Prisma, Clerk, Docker, PostgreSQL.\n\n## CERTIFICATES & ACHIEVEMENTS\n- Fundamentals of Deep Learning (NVIDIA) — LINK\n- Introduction to Cybersecurity (CISCO) — LINK\n- CCNA: Introduction to Networks (CISCO) — LINK\n- SIH 2024 Finalist — LINK\n`,
              language: 'markdown'
            },
            {
              name: 'profile.json',
              type: 'file' as const,
              content: `{
  "name": "Alok Kumar Yadav",
  "email": "7236alokyadav@gmail.com",
  "phone": "+917236835404",
  "linkedin": "https://www.linkedin.com/in/alok-kumar-yadav",
  "github": "https://github.com/alok-yadav",
  "about": "Full-Stack Developer and Machine Learning Enthusiast with experience in delivering scalable web applications, realtime cybersecurity systems, and automation tools.",
  "education": [
    { "degree": "B.Tech in Information Technology", "years": "2022-2026", "institution": "Amity University" }
  ]
}`,
              language: 'json'
            }
          ]
        },
        {
          name: 'components',
          type: 'folder' as const,
          children: [
            { name: 'Hero.tsx', type: 'file' as const, content: `import React from 'react';\n\nconst Hero = () => (\n  <section>\n    <h1>Alok Kumar Yadav</h1>\n  </section>\n);\n\nexport default Hero;`, language: 'typescript' }
          ]
        }
      ]
    },
    { name: 'package.json', type: 'file' as const, content: `{\n  "name": "alok-portfolio",\n  "version": "1.0.0"\n}`, language: 'json' },
    { name: 'README.md', type: 'file' as const, content: `# Alok Kumar Yadav\n\nFull-Stack Developer and Machine Learning Enthusiast.\n\nSee the \`profile/ALOK_PROFILE.md\` for full details.`, language: 'markdown' }
  ];

  // Sample files for typing animation (Alok's snippets)
  const codeFiles = [
    {
      name: 'profile.ts',
      content: `export const profile = {\n  name: 'Alok Kumar Yadav',\n  email: '7236alokyadav@gmail.com',\n  phone: '+917236835404',\n  headline: 'Full-Stack Developer & Machine Learning Enthusiast'\n};\n\nexport default profile;`,
      language: 'typescript'
    },
    {
      name: 'projects.md',
      content: `# Projects\n\n- Social Media Data Extraction Tool — SIH 2024 Finalist\n- Real-Time DDoS Attack Detection System — Horizon17\n- Exam Central — Hackathon Project`,
      language: 'markdown'
    },
    {
      name: 'README_SNIPPET.md',
      content: `# README\n\nAlok Kumar Yadav — Full-Stack Developer and ML enthusiast.\n\nContact: 7236alokyadav@gmail.com`,
      language: 'markdown'
    }
    ,
    {
      name: 'experience.ts',
      content: `interface Experience {\n  company: string;\n  role: string;\n  duration: string;\n  technologies: string[];\n}\n\nconst myJourney: Experience[] = [\n  {\n    company: "Tech Innovation Inc",\n    role: "Senior Full Stack Developer",\n    duration: "2022 - Present",\n    technologies: ["React", "Node.js", "AWS"]\n  }\n];`,
      language: 'typescript'
    }
  ];

  // Initialize with first file
  useEffect(() => {
    if (codeFiles.length > 0 && openTabs.length === 0) {
      setOpenTabs([codeFiles[0]]);
    }
  }, []);

  // Device capability detection
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const detectCapabilities = () => {
      const canvas = document.createElement('canvas');
      const webglContext = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      setDeviceCapabilities({
        supportsWebGL: !!webglContext,
        supportsIntersectionObserver: 'IntersectionObserver' in window,
        isHighPerformance: navigator.hardwareConcurrency >= 4 && window.devicePixelRatio <= 2,
        prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      });
    };

    detectCapabilities();
    setIsMounted(true);
  }, []);

  // Advanced mouse tracking with performance optimization
  useEffect(() => {
    if (!containerRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        
        setMousePosition({ x: x * 100, y: y * 100 });
        mouseX.set(x);
        mouseY.set(y);
      }
    };

    const container = containerRef.current;
    container.addEventListener('mousemove', handleMouseMove);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

  const handleFileSelect = (file: any) => {
    if (file.type === 'file') {
      setSelectedFile(file.name);
      
      // Add to open tabs if not already open
      const isAlreadyOpen = openTabs.some(tab => tab.name === file.name);
      if (!isAlreadyOpen && file.content) {
        const newTab = {
          name: file.name,
          content: file.content,
          language: file.language || 'typescript'
        };
        setOpenTabs(prev => [...prev, newTab]);
        setActiveTabIndex(openTabs.length);
      } else {
        // Switch to existing tab
        const tabIndex = openTabs.findIndex(tab => tab.name === file.name);
        if (tabIndex !== -1) {
          setActiveTabIndex(tabIndex);
        }
      }
    }
  };

  const closeTab = (index: number) => {
    setOpenTabs(prev => prev.filter((_, i) => i !== index));
    if (activeTabIndex >= index && activeTabIndex > 0) {
      setActiveTabIndex(prev => prev - 1);
    }
  };

  return (
    <motion.section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-950 via-blue-950 to-purple-950 pt-24 md:pt-28 scroll-mt-28"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      {/* Advanced particle effects layer */}
      {isMounted && deviceCapabilities.isHighPerformance && (
        <>
          <ParticleField
            particleCount={ADVANCED_CONFIG.webgl.particleCount}
            speed={0.9}
            opacityRange={[0.25, 0.85]}
            hueRange={[190, 220]}
            className="z-0"
          />
          <NeuralBackground
            nodeCount={ADVANCED_CONFIG.neural.nodeCount}
            connectionDistance={150}
            connectionOpacity={ADVANCED_CONFIG.neural.connectionOpacity}
            nodeColor="rgba(56, 178, 172, 0.6)"
            connectionColor="rgba(56, 178, 172, 1)"
            pulseSpeed={ADVANCED_CONFIG.neural.pulseSpeed}
            mousePosition={mousePosition}
            className="z-10"
          />
        </>
      )}

  {/* Professional VS Code Interface */}
  <div className="relative w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* VS Code Window Frame */}
        <motion.div
          className="bg-gray-800 rounded-lg shadow-2xl overflow-hidden border border-gray-600"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Title Bar */}
          <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-600">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-gray-300 text-sm font-medium">ALOK YADAV - Portfolio</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <Settings className="w-4 h-4 cursor-pointer hover:text-white" />
              <Search className="w-4 h-4 cursor-pointer hover:text-white" />
            </div>
          </div>

          <div className="flex h-[600px]">
            {/* File Explorer Sidebar */}
            <motion.div
              className="w-64 bg-gray-800 border-r border-gray-600"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <FileTree
                files={projectFiles}
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
              />
            </motion.div>

            {/* Main Editor Area */}
            <div className="flex-1 flex flex-col">
              {/* Tab Bar */}
              <div className="bg-gray-700 border-b border-gray-600 flex items-center min-h-[40px] overflow-x-auto">
                <AnimatePresence>
                  {openTabs.map((tab, index) => (
                    <Tab
                      key={tab.name}
                      file={{ name: tab.name, type: 'file' }}
                      isActive={index === activeTabIndex}
                      onClose={() => closeTab(index)}
                      onClick={() => setActiveTabIndex(index)}
                      hasUnsavedChanges={tab.hasChanges}
                    />
                  ))}
                </AnimatePresence>
                <div className="flex-1"></div>
              </div>

              {/* Code Editor */}
              <div className="flex-1 bg-gray-900 relative overflow-hidden">
                <motion.div
                  className="h-full p-6"
                  key={activeTabIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {openTabs.length > 0 && (
                    <div className="space-y-4">
                      {/* Line numbers and code */}
                      <div className="flex text-sm font-mono">
                        <div className="text-gray-500 pr-4 select-none min-w-[3rem] text-right">
                          {Array.from({ length: 20 }, (_, i) => (
                            <div key={i + 1} className="leading-6">
                              {i + 1}
                            </div>
                          ))}
                        </div>
                        <div className="flex-1 leading-6">
                          <AdvancedTypewriter
                            files={codeFiles}
                            currentFileIndex={activeTabIndex % codeFiles.length}
                            speed={80}
                            showIntelliSense={true}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Minimap */}
                <div className="absolute top-0 right-0 w-20 h-full bg-gray-800 opacity-60 border-l border-gray-600">
                  <div className="p-2 text-xs text-gray-500">
                    {Array.from({ length: 40 }, (_, i) => (
                      <div key={i} className="h-1 bg-gray-600 mb-0.5 w-full"></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Terminal (if visible) */}
              <AnimatePresence>
                {terminalVisible && (
                  <motion.div
                    className="h-48 bg-black border-t border-gray-600"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 192, opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-4 font-mono text-sm">
                      <div className="flex items-center mb-2 border-b border-gray-700 pb-2">
                        <TerminalIcon className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-300">Terminal</span>
                        <button
                          className="ml-auto text-gray-400 hover:text-white"
                          onClick={() => setTerminalVisible(false)}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-green-400">
                        <span className="text-blue-400">portfolio@alok-dev</span>
                        <span className="text-white">:</span>
                        <span className="text-cyan-400">~/portfolio</span>
                        <span className="text-white">$ </span>
                        <motion.span
                          className="inline-block"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1 }}
                        >
                          npm run dev
                        </motion.span>
                      </div>
                      <motion.div
                        className="mt-2 text-gray-300"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2 }}
                      >
                        <div className="text-green-400">✓ Development server running</div>
                        <div className="text-blue-400">→ Local: http://localhost:3000</div>
                        <div className="text-gray-400">→ Ready for development</div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Status Bar */}
          <StatusBar
            line={cursorPosition.line}
            column={cursorPosition.column}
            language={openTabs[activeTabIndex]?.language || 'typescript'}
            branch="main"
            errors={0}
            warnings={1}
          />
        </motion.div>
      </div>

      {/* Performance monitor (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 bg-black/50 text-white p-2 rounded text-xs z-50">
          <div>WebGL: {deviceCapabilities.supportsWebGL ? '✓' : '✗'}</div>
          <div>Performance: {deviceCapabilities.isHighPerformance ? 'High' : 'Standard'}</div>
          <div>Reduced Motion: {deviceCapabilities.prefersReducedMotion ? 'On' : 'Off'}</div>
        </div>
      )}
    </motion.section>
  );
}