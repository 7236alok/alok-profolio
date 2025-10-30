// Skills Data Configuration - Easy to update and maintain

export interface Skill {
  name: string;
  level: number;
  category: string;
  color: string;
  icon: string;
  description: string;
  projects: string[];
  yearsOfExperience: number;
  tags?: string[];
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  learningPath?: string[];
  relatedSkills?: string[];
  certifications?: string[];
  trending?: boolean;
}

export interface SkillCategory {
  name: string;
  color: string;
  gradient: string;
  skills: Skill[];
  chapterTitle: string;
  chapterDescription: string;
  icon?: string;
  priority?: number;
  subcategories?: string[];
}

// Utility to add missing properties to skills for backward compatibility
const enhanceSkill = (skill: Partial<Skill>): Skill => ({
  name: skill.name || '',
  level: skill.level || 0,
  category: skill.category || '',
  color: skill.color || '#ffffff',
  icon: skill.icon || '⭐',
  description: skill.description || '',
  projects: skill.projects || [],
  yearsOfExperience: skill.yearsOfExperience || 0,
  tags: skill.tags || [],
  difficulty: skill.difficulty || (
    skill.level && skill.level >= 90 ? 'Expert' : 
    skill.level && skill.level >= 80 ? 'Advanced' : 
    skill.level && skill.level >= 60 ? 'Intermediate' : 'Beginner'
  ),
  trending: skill.trending ?? (skill.level ? skill.level >= 85 : false),
  learningPath: skill.learningPath || [],
  relatedSkills: skill.relatedSkills || [],
  certifications: skill.certifications || []
});

// =====================================
// SKILLS DATA - EASY TO UPDATE
// =====================================

export const SKILLS_DATA: SkillCategory[] = [
  {
    name: "Programming Languages",
    color: "#3178c6",
    gradient: "from-blue-400 to-indigo-500",
    chapterTitle: "Chapter 1: Foundation Languages",
    chapterDescription: "The core programming languages that power modern development",
    icon: "💻",
    priority: 1,
    subcategories: ["Systems Programming", "Web Development", "Data Science"],
    skills: [
      enhanceSkill({
        name: "Python",
        level: 92,
        category: "Programming Languages",
        color: "#ffd43b",
        icon: "🐍",
        description: "Expert in Python for ML, automation, backend development, and data engineering with FastAPI, Flask",
        projects: ["DDoS Detection System", "Social Media Extraction Tool"],
        yearsOfExperience: 3,
        tags: ["machine-learning", "automation", "backend", "data-science"],
        difficulty: "Expert",
        learningPath: ["Basics", "OOP", "Libraries", "Frameworks", "Advanced"],
        relatedSkills: ["FastAPI", "Flask", "Scikit-learn", "Keras", "Selenium"],
        certifications: ["NVIDIA Deep Learning", "CISCO Cybersecurity"],
        trending: true
      }),
      enhanceSkill({
        name: "JavaScript",
        level: 88,
        category: "Programming Languages",
        color: "#f7df1e",
        icon: "🟨",
        description: "Frontend and full-stack development with Node.js, React and modern ES6+ features",
        projects: ["Exam Central", "Algorithm Visualization"],
        yearsOfExperience: 2.5,
        tags: ["frontend", "fullstack", "es6", "async"],
        difficulty: "Advanced",
        relatedSkills: ["Node.js", "React", "Next.js"],
        trending: true
      }),
      enhanceSkill({
        name: "C++",
        level: 85,
        category: "Programming Languages",
        color: "#00599c",
        icon: "⚡",
        description: "Strong foundation in data structures, algorithms, and competitive programming",
        projects: ["LeetCode 250+ Problems", "DSA Implementations"],
        yearsOfExperience: 3,
        tags: ["dsa", "competitive-programming", "performance"],
        difficulty: "Advanced",
        relatedSkills: ["C", "STL", "Algorithms"],
        trending: false
      }),
      enhanceSkill({
        name: "C",
        level: 80,
        category: "Programming Languages",
        color: "#00599c",
        icon: "⚡",
        description: "System programming, algorithms, and competitive programming",
        projects: ["Data Structures Implementation", "Algorithm Optimization"],
        yearsOfExperience: 3,
        tags: ["systems", "algorithms", "performance"],
        difficulty: "Advanced"
      }),
      enhanceSkill({
        name: "C",
        level: 82,
        category: "Programming Languages",
        color: "#a8b9cc",
        icon: "⚙️",
        description: "Low-level programming and system development",
        projects: ["System Programming", "Memory Management"],
        yearsOfExperience: 2.5,
        tags: ["systems", "memory", "embedded"],
        difficulty: "Advanced"
      })
    ]
  },

  {
    name: "Web Frameworks & Libraries",
    color: "#61dafb",
    gradient: "from-cyan-400 to-blue-500",
    chapterTitle: "Chapter 2: Web Development Arsenal",
    chapterDescription: "Modern frameworks and libraries for building scalable web applications",
    icon: "🌐",
    priority: 2,
    subcategories: ["Frontend", "Backend", "Full-Stack"],
    skills: [
      enhanceSkill({
        name: "React",
        level: 87,
        category: "Web Frameworks",
        color: "#61dafb",
        icon: "⚛️",
        description: "Building scalable, component-based user interfaces",
        projects: ["Exam Central", "Portfolio Website"],
        yearsOfExperience: 2,
        tags: ["frontend", "components", "hooks"],
        difficulty: "Advanced",
        trending: true
      }),
      enhanceSkill({
        name: "Next.js",
        level: 85,
        category: "Web Frameworks",
        color: "#000000",
        icon: "▲",
        description: "Full-stack React framework with SSR and optimized performance",
        projects: ["Exam Central", "Portfolio"],
        yearsOfExperience: 1.5,
        tags: ["fullstack", "ssr", "performance"],
        difficulty: "Advanced",
        trending: true
      }),
      enhanceSkill({
        name: "FastAPI",
        level: 90,
        category: "Web Frameworks",
        color: "#05998b",
        icon: "⚡",
        description: "High-performance Python API framework for real-time systems",
        projects: ["DDoS Detection System", "Real-time Analytics"],
        yearsOfExperience: 1.5,
        tags: ["api", "async", "performance"],
        difficulty: "Expert",
        trending: true
      }),
      enhanceSkill({
        name: "Flask",
        level: 88,
        category: "Web Frameworks",
        color: "#ffffff",
        icon: "🌶️",
        description: "Lightweight Python framework for web applications",
        projects: ["Social Media Extraction Tool", "API Development"],
        yearsOfExperience: 2,
        tags: ["lightweight", "microframework"],
        difficulty: "Advanced"
      }),
      enhanceSkill({
        name: "Node.js",
        level: 85,
        category: "Web Frameworks",
        color: "#68a063",
        icon: "🟢",
        description: "Server-side JavaScript runtime for scalable backend applications",
        projects: ["Backend APIs", "Real-time Applications"],
        yearsOfExperience: 2,
        tags: ["backend", "runtime", "async"],
        difficulty: "Advanced",
        relatedSkills: ["Express.js", "JavaScript"],
        trending: true
      }),
      enhanceSkill({
        name: "Selenium",
        level: 82,
        category: "Web Frameworks",
        color: "#43b02a",
        icon: "🌐",
        description: "Web automation and browser testing framework",
        projects: ["Social Media Extraction Tool", "Web Scraping"],
        yearsOfExperience: 1.5,
        tags: ["automation", "testing", "web-scraping"],
        difficulty: "Intermediate"
      })
    ]
  },

  {
    name: "Machine Learning & AI",
    color: "#ff8a00",
    gradient: "from-orange-400 to-red-500",
    chapterTitle: "Chapter 3: Artificial Intelligence",
    chapterDescription: "Deep learning, neural networks, and intelligent systems",
    icon: "🧠",
    priority: 3,
    subcategories: ["Deep Learning", "Classical ML", "Data Processing"],
    skills: [
      enhanceSkill({
        name: "Deep Neural Networks",
        level: 88,
        category: "AI/ML",
        color: "#ff6b6b",
        icon: "🧠",
        description: "NVIDIA certified in deep learning fundamentals and DNN architectures",
        projects: ["DDoS Detection System", "Threat Detection Models"],
        yearsOfExperience: 2,
        tags: ["deep-learning", "neural-networks"],
        difficulty: "Advanced",
        certifications: ["NVIDIA Deep Learning"],
        trending: true
      }),
      enhanceSkill({
        name: "Scikit-learn",
        level: 85,
        category: "AI/ML",
        color: "#f7931e",
        icon: "🔬",
        description: "Machine learning algorithms and model optimization",
        projects: ["Logistic Regression Models", "Feature Engineering"],
        yearsOfExperience: 2,
        tags: ["machine-learning", "algorithms"],
        difficulty: "Advanced"
      }),
      enhanceSkill({
        name: "Keras",
        level: 82,
        category: "AI/ML",
        color: "#d00000",
        icon: "🔥",
        description: "High-level neural network API for rapid prototyping",
        projects: ["Neural Network Models", "Deep Learning Prototypes"],
        yearsOfExperience: 1.5,
        tags: ["deep-learning", "prototyping"],
        difficulty: "Intermediate"
      }),
      enhanceSkill({
        name: "Feature Engineering",
        level: 87,
        category: "AI/ML",
        color: "#4ecdc4",
        icon: "⚗️",
        description: "Data preprocessing and feature optimization for ML models",
        projects: ["DDoS Detection", "Data Analysis Pipeline"],
        yearsOfExperience: 2,
        tags: ["data-preprocessing", "optimization"],
        difficulty: "Advanced"
      })
    ]
  },

  {
    name: "Cybersecurity",
    color: "#ff4757",
    gradient: "from-red-500 to-pink-600",
    chapterTitle: "Chapter 4: Digital Defense",
    chapterDescription: "Advanced cybersecurity and threat detection systems",
    icon: "🛡️",
    priority: 4,
    subcategories: ["Threat Detection", "Network Security", "Analysis"],
    skills: [
      enhanceSkill({
        name: "DDoS Attack Detection",
        level: 92,
        category: "Cybersecurity",
        color: "#ff4757",
        icon: "🛡️",
        description: "Real-time DDoS attack detection with 92%+ accuracy using Logistic Regression and ML",
        projects: ["Real-Time DDoS Detection System (Horizon17 Technologies)"],
        yearsOfExperience: 1,
        tags: ["threat-detection", "machine-learning", "real-time"],
        difficulty: "Expert",
        certifications: ["CISCO Cybersecurity"],
        trending: true
      }),
      enhanceSkill({
        name: "WAF Log Analysis",
        level: 85,
        category: "Cybersecurity",
        color: "#ff6b7a",
        icon: "🔍",
        description: "Web Application Firewall log analysis and threat detection",
        projects: ["Security Monitoring Dashboard", "Threat Detection"],
        yearsOfExperience: 1,
        tags: ["log-analysis", "monitoring"],
        difficulty: "Advanced"
      }),
      enhanceSkill({
        name: "Network Security",
        level: 83,
        category: "Cybersecurity",
        color: "#ff8a95",
        icon: "🌐",
        description: "CISCO certified in cybersecurity and network fundamentals",
        projects: ["Network Analysis", "Security Assessment"],
        yearsOfExperience: 1.5,
        tags: ["network", "cisco"],
        difficulty: "Advanced",
        certifications: ["CISCO Cybersecurity"]
      }),
      enhanceSkill({
        name: "Wireshark",
        level: 80,
        category: "Cybersecurity",
        color: "#1e90ff",
        icon: "📡",
        description: "Network protocol analysis and packet inspection",
        projects: ["Network Traffic Analysis", "Security Monitoring"],
        yearsOfExperience: 1,
        tags: ["network-analysis", "packet-inspection"],
        difficulty: "Intermediate"
      })
    ]
  },

  {
    name: "Data Engineering & Tools",
    color: "#2ed573",
    gradient: "from-green-400 to-emerald-500",
    chapterTitle: "Chapter 5: Data Pipeline Mastery",
    chapterDescription: "Real-time data processing and enterprise-grade databases",
    icon: "🔧",
    priority: 5,
    subcategories: ["Streaming", "Databases", "Search"],
    skills: [
      enhanceSkill({
        name: "Apache Kafka",
        level: 87,
        category: "Data Engineering",
        color: "#231f20",
        icon: "📨",
        description: "Real-time data streaming and pipeline architecture",
        projects: ["DDoS Detection System", "Real-time Analytics"],
        yearsOfExperience: 1,
        tags: ["streaming", "real-time"],
        difficulty: "Advanced",
        trending: true
      }),
      enhanceSkill({
        name: "Elasticsearch",
        level: 85,
        category: "Data Engineering",
        color: "#005571",
        icon: "🔍",
        description: "Search and analytics engine for large-scale data",
        projects: ["Log Analysis", "Security Monitoring"],
        yearsOfExperience: 1,
        tags: ["search", "analytics"],
        difficulty: "Advanced"
      }),
      enhanceSkill({
        name: "MongoDB",
        level: 88,
        category: "Data Engineering",
        color: "#47a248",
        icon: "🍃",
        description: "NoSQL database for scalable web applications",
        projects: ["Social Media Tool", "Data Storage Solutions"],
        yearsOfExperience: 2,
        tags: ["nosql", "database"],
        difficulty: "Advanced"
      }),
      enhanceSkill({
        name: "MySQL",
        level: 85,
        category: "Data Engineering",
        color: "#4479a1",
        icon: "🗄️",
        description: "Relational database design and optimization",
        projects: ["Database Design", "Data Management"],
        yearsOfExperience: 2.5,
        tags: ["sql", "relational"],
        difficulty: "Advanced"
      }),
      enhanceSkill({
        name: "PostgreSQL",
        level: 82,
        category: "Data Engineering",
        color: "#336791",
        icon: "🐘",
        description: "Advanced SQL database with Prisma ORM integration",
        projects: ["Exam Central", "Database Architecture"],
        yearsOfExperience: 1.5,
        tags: ["sql", "orm"],
        difficulty: "Intermediate"
      })
    ]
  },

  {
    name: "DevOps & Monitoring",
    color: "#0db7ed",
    gradient: "from-blue-500 to-purple-600",
    chapterTitle: "Chapter 6: Cloud Infrastructure",
    chapterDescription: "Containerization, monitoring, and deployment automation",
    icon: "⚙️",
    priority: 6,
    subcategories: ["Containerization", "Monitoring", "Version Control"],
    skills: [
      enhanceSkill({
        name: "Docker",
        level: 88,
        category: "DevOps",
        color: "#0db7ed",
        icon: "🐳",
        description: "Containerization and deployment automation",
        projects: ["Exam Central", "Microservices Deployment"],
        yearsOfExperience: 1.5,
        tags: ["containerization", "deployment"],
        difficulty: "Advanced",
        trending: true
      }),
      enhanceSkill({
        name: "Grafana",
        level: 85,
        category: "DevOps",
        color: "#f46800",
        icon: "📊",
        description: "Real-time monitoring dashboards and alerting systems",
        projects: ["DDoS Detection Dashboard", "System Monitoring"],
        yearsOfExperience: 1,
        tags: ["monitoring", "dashboards"],
        difficulty: "Advanced"
      }),
      enhanceSkill({
        name: "Git",
        level: 90,
        category: "DevOps",
        color: "#f05032",
        icon: "🔀",
        description: "Version control and collaborative development",
        projects: ["All Projects", "Team Collaboration"],
        yearsOfExperience: 3,
        tags: ["version-control", "collaboration"],
        difficulty: "Expert"
      }),
      enhanceSkill({
        name: "VS Code",
        level: 92,
        category: "DevOps",
        color: "#007acc",
        icon: "💻",
        description: "Advanced IDE configuration and productivity optimization",
        projects: ["Development Environment", "Code Optimization"],
        yearsOfExperience: 3,
        tags: ["ide", "productivity"],
        difficulty: "Expert"
      })
    ]
  },

  {
    name: "Data Science & Visualization",
    color: "#9c88ff",
    gradient: "from-purple-400 to-pink-500",
    chapterTitle: "Chapter 7: Data Insights",
    chapterDescription: "Statistical analysis, visualization, and data-driven decision making",
    icon: "📊",
    priority: 7,
    subcategories: ["Analysis", "Visualization", "Computing"],
    skills: [
      enhanceSkill({
        name: "Pandas",
        level: 88,
        category: "Data Science",
        color: "#150458",
        icon: "🐼",
        description: "Data manipulation and analysis with Python",
        projects: ["Data Pipeline", "Feature Engineering"],
        yearsOfExperience: 2,
        tags: ["data-analysis", "python"],
        difficulty: "Advanced"
      }),
      enhanceSkill({
        name: "NumPy",
        level: 85,
        category: "Data Science",
        color: "#013243",
        icon: "🔢",
        description: "Numerical computing and array operations",
        projects: ["ML Models", "Scientific Computing"],
        yearsOfExperience: 2,
        tags: ["numerical-computing", "arrays"],
        difficulty: "Advanced"
      }),
      enhanceSkill({
        name: "Matplotlib",
        level: 82,
        category: "Data Science",
        color: "#11557c",
        icon: "📈",
        description: "Statistical data visualization and plotting",
        projects: ["Data Analysis", "Performance Metrics"],
        yearsOfExperience: 2,
        tags: ["visualization", "plotting"],
        difficulty: "Intermediate"
      }),
      enhanceSkill({
        name: "Chart.js",
        level: 87,
        category: "Data Science",
        color: "#ff6384",
        icon: "📊",
        description: "Interactive web-based data visualization",
        projects: ["Algorithm Visualization", "Dashboard Charts"],
        yearsOfExperience: 1.5,
        tags: ["web-visualization", "interactive"],
        difficulty: "Advanced"
      })
    ]
  }
];

// Additional configuration
export const SKILLS_CONFIG = {
  totalSkills: SKILLS_DATA.flatMap(cat => cat.skills).length,
  averageLevel: Math.round(
    SKILLS_DATA.flatMap(cat => cat.skills).reduce((acc, skill) => acc + skill.level, 0) / 
    SKILLS_DATA.flatMap(cat => cat.skills).length
  ),
  categories: SKILLS_DATA.length,
  maxLevel: Math.max(...SKILLS_DATA.flatMap(cat => cat.skills).map(skill => skill.level)),
  minLevel: Math.min(...SKILLS_DATA.flatMap(cat => cat.skills).map(skill => skill.level))
};

// Helper functions for data manipulation
export const getSkillsByDifficulty = (difficulty: Skill['difficulty']) => 
  SKILLS_DATA.flatMap(cat => cat.skills).filter(skill => skill.difficulty === difficulty);

export const getTrendingSkills = () => 
  SKILLS_DATA.flatMap(cat => cat.skills).filter(skill => skill.trending);

export const getSkillsByTag = (tag: string) =>
  SKILLS_DATA.flatMap(cat => cat.skills).filter(skill => skill.tags?.includes(tag));

export const getAllSkills = () => SKILLS_DATA.flatMap(cat => cat.skills);

export const getAllTags = () => {
  const tags = new Set<string>();
  SKILLS_DATA.flatMap(cat => cat.skills).forEach(skill => {
    skill.tags?.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
};