// Constants for the portfolio application
export const PERSONAL_INFO = {
  name: 'Alok Kumar Yadav',
  email: '7236alokyadav@gmail.com',
  phone: '+9172369999999',
  location: 'Noida, UP, India',
  title: 'Full-Stack Developer & Machine Learning Enthusiast',
  description: 'Full-Stack Developer and Machine Learning Enthusiast with experience in delivering scalable web applications, real-time cybersecurity systems, and automation tools. Proven Smart India Hackathon Finalist with strong skills in backend, frontend, and data engineering, focused on performance optimization and solving real-world problems.',
  education: {
    degree: 'B.Tech. in Information Technology',
    institution: 'Amity University (Noida, UP)',
    period: '2022–2026',
    cgpa: '8.51',
    relevantCourses: [
      'Data Structures & Algorithms',
      'Database and Management System',
      'Operating Systems',
      'Software Engineering',
      'Machine Learning',
      'Deep Learning',
      'Generative AI',
      'Full Stack Development',
      'Cloud Security'
    ]
  },
  achievements: [
    'Smart India Hackathon 2024 Grand Finalist',
    'LeetCode: 250+ Problems Solved',
    'Real-time DDoS Detection System (92%+ accuracy)',
    'NVIDIA Deep Learning Certified',
    'CISCO Cybersecurity Certified',
    'CISCO CCNA: Introduction to Networks'
  ],
  certifications: [
    {
      name: 'Fundamentals of Deep Learning',
      issuer: 'NVIDIA',
      url: '#'
    },
    {
      name: 'Introduction to Cybersecurity',
      issuer: 'CISCO',
      url: '#'
    },
    {
      name: 'CCNA: Introduction to Networks',
      issuer: 'CISCO',
      url: '#'
    }
  ]
} as const;

export const SOCIAL_LINKS = {
  github: 'https://github.com/7236alok',
  linkedin: 'https://linkedin.com/in/alok-yadav-81731425b',
  email: 'mailto:7236alokyadav@gmail.com',
  phone: 'tel:+917236835404'
} as const;

export const NAVIGATION_ITEMS = [
  { name: 'Home', href: '#hero' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
] as const;

export const HEADLINE_VARIANTS = [
  "Transforming data into intelligent solutions",
  "Building the future with deep learning", 
  "AI researcher and developer"
] as const;

export const ANIMATION_CONFIG = {
  blob: {
    count: 20,
    minSize: 50,
    maxSizeAddition: 100,
    positionRange: 100,
    animationOffset: 0.5,
    minDuration: 10,
    maxDurationAddition: 10
  },
  particles: {
    count: 50
  }
} as const;

export const PERFORMANCE_CONFIG = {
  throttleDelay: 16, // ~60fps
  debounceDelay: 200,
  animationTimeout: 500,
  headlineRotationInterval: 4000,
  gradientUpdateInterval: 5000,
} as const;

// Skills configuration for advanced Skills component
export const SKILLS_CONFIG = {
  categories: [
    {
      name: "Frontend Development",
      color: "#61dafb",
      gradient: "from-blue-400 to-cyan-400",
    },
    {
      name: "Backend Development", 
      color: "#84ba64",
      gradient: "from-green-400 to-emerald-500",
    },
    {
      name: "AI & Machine Learning",
      color: "#ff8a00", 
      gradient: "from-orange-400 to-red-500",
    },
    {
      name: "DevOps & Cloud",
      color: "#0db7ed",
      gradient: "from-blue-500 to-purple-600",
    }
  ],
  animations: {
    cardStagger: 0.1,
    hoverScale: 1.05,
    tapScale: 0.95,
    springConfig: { damping: 20, stiffness: 400 }
  }
} as const;