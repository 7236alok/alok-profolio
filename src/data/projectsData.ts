// Project data for portfolio
// Add, edit, or remove projects here

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  screenshots?: string[];
  tech: string[];
  url?: string;
  github?: string;
  recognition?: string;
  keyLearnings?: string[];
  architectureImg?: string;
  year?: string;
  tags?: string[];
  impact?: string;
}

export const projects: Project[] = [
  {
    id: "1",
    title: "Social Spy – Social Media Data Extraction Tool",
    description:
      "Engineered a Flask-based automation tool integrating APIs from multiple platforms for social media data extraction. Automated PDF report generation with a MongoDB backend — improved data collection efficiency by 40%.",
    image: "/projects/project1.jpg",
    screenshots: [
      "/projects/project1.jpg",
      "/projects/project1-01.jpg",
      "/projects/project1-02.jpg"
    ],
    tech: ["Flask", "Python", "MongoDB", "REST", "Celery"],
    github: "https://github.com/yourusername/social-media-extraction-tool",
    recognition: "Smart India Hackathon 2024 Finalist",
    keyLearnings: [
      "Built multi-API integration with robust rate-limit handling.",
      "Improved throughput using Celery for task scheduling.",
      "Used schema-free MongoDB for flexible and scalable data ingestion."
    ],
    architectureImg: "/projects/architecture-social.png",
    year: "2024",
    tags: ["AI", "Automation", "Data Extraction", "Flask"],
    impact: "Hackathon",
  },
  {
    id: "2",
    title: "Real-Time DDoS Attack Detection System",
    description:
      "Developed and deployed a real-time DDoS detection system using Logistic Regression, Apache Kafka, and FastAPI. Designed an alerting dashboard in Grafana and optimized system latency through multithreading for continuous inference.",
    image: "/projects/project2.jpg",
    screenshots: [
      "/projects/project2.jpg",
      "/projects/project2-01.jpg",
      "/projects/project2-02.jpg"
    ],
    tech: [
      "Python",
      "FastAPI",
      "Apache Kafka",
      "Elasticsearch",
      "Grafana",
      "WireShark",
      "Machine Learning"
    ],
    github: "https://github.com/yourusername/ddos-detection",
    recognition: "Industry Internship Project at Horizon17 Technologies",
    keyLearnings: [
      "Achieved 92%+ accuracy using optimized Logistic Regression model.",
      "Implemented Kafka-based data pipelines for real-time flow handling.",
      "Created Grafana dashboards with automated security alerts."
    ],
    architectureImg: "/projects/architecture-ddos.png",
    year: "2025",
    tags: ["AI Security", "Cybersecurity", "Machine Learning", "Kafka"],
    impact: "Industry",
  },
  {
    id: "3",
    title: "Algorithm Visualization Platform",
    description:
      "An interactive web application to visualize sorting, searching, and graph algorithms, improving conceptual understanding through animation and interactivity. Widely used for classroom demonstrations and learning assistance.",
    image: "/projects/project3.jpg",
    screenshots: [
      "/projects/project3.jpg",
      "/projects/project3-01.jpg",
      "/projects/project3-02.jpg"
    ],
    tech: ["JavaScript", "HTML5 Canvas", "Chart.js", "CSS", "Accessibility"],
    url: "https://https://algo-visualizer-alok.netlify.app/",
    github: "https://github.com/yourusername/algorithm-visualization",
    keyLearnings: [
      "Enhanced understanding of algorithm efficiency via dynamic visuals.",
      "Optimized animation rendering for smooth experience across devices."
    ],
    architectureImg: "/projects/architecture-algo.png",
    year: "2023",
    tags: ["Visualization", "DSA", "Education", "Web App"],
    impact: "Academic",
  },
  {
    id: "4",
    title: "Smart Pet Feeder using IoT",
    description:
      "Built an IoT-based smart pet feeder using ESP8266 and servo motor for automated food dispensing. Integrated a web dashboard for schedule management, manual feeding, and real-time remote control.",
    image: "/projects/project1.jpg",
    screenshots: [
      "/projects/project1.jpg",
      "/projects/project1-01.jpg",
      "/projects/project1-02.jpg"
    ],
    tech: ["ESP8266", "C", "HTML", "CSS", "IoT", "Web Server"],
    github: "https://github.com/yourusername/smart-pet-feeder",
    keyLearnings: [
      "Learned embedded system design using ESP8266.",
      "Implemented scheduling with NTP-based time synchronization.",
      "Enabled secure web-based remote control and feeding logs."
    ],
    architectureImg: "/projects/architecture-petfeeder.png",
    year: "2024",
    tags: ["IoT", "Embedded Systems", "Automation", "Smart Devices"],
    impact: "Personal",
  },
  {
    id: "5",
    title: "Exam Central – Role-based Exam Management System",
    description:
      "Developed a role-based examination management platform with Next.js, Prisma ORM, and Clerk authentication. Deployed in Docker containers and integrated PostgreSQL for secure and efficient data handling.",
    image: "/projects/project2.jpg",
    screenshots: [
      "/projects/project2.jpg",
      "/projects/project2-01.jpg",
      "/projects/project2-02.jpg"
    ],
    tech: ["Next.js", "Prisma", "Clerk", "Docker", "PostgreSQL"],
    github: "https://github.com/yourusername/exam-central",
    keyLearnings: [
      "Implemented secure RBAC and multi-session handling.",
      "Used containerization to streamline deployment environments."
    ],
    architectureImg: "/projects/architecture-exam.png",
    year: "2024",
    tags: ["Full Stack", "RBAC", "Next.js", "PostgreSQL"],
    impact: "Academic",
  },
  
  // Add more projects below this line
  // Template for new project:
  /*
  {
    id: "4",
    title: "Your Project Name",
    description: "Brief description of your project and its impact...",
    image: "/projects/project4.jpg",
    screenshots: [
      "/projects/project4.jpg",
      "/projects/project4-01.jpg",
      "/projects/project4-02.jpg"
    ],
    tech: ["React", "Node.js", "MongoDB", "etc"],
    url: "https://your-live-demo.com",
    github: "https://github.com/yourusername/project-name",
    recognition: "Optional: Any award or recognition",
    keyLearnings: [
      "First key learning or achievement",
      "Second key learning or technical insight",
      "Third key learning or best practice discovered",
    ],
    architectureImg: "/projects/architecture-diagram.png",
    year: "2024",
  },
  */
];

// Helper function to get project by ID
export const getProjectById = (id: string): Project | undefined => {
  return projects.find(project => project.id === id);
};

// Helper function to get projects by year
export const getProjectsByYear = (year: string): Project[] => {
  return projects.filter(project => project.year === year);
};

// Helper function to get projects by technology
export const getProjectsByTech = (tech: string): Project[] => {
  return projects.filter(project => 
    project.tech.some(t => t.toLowerCase().includes(tech.toLowerCase()))
  );
};

// Helper function to get all unique technologies
export const getAllTechnologies = (): string[] => {
  const allTech = projects.flatMap(project => project.tech);
  return Array.from(new Set(allTech)).sort();
};

// Helper function to get all unique years
export const getAllYears = (): string[] => {
  const allYears = projects
    .map(project => project.year)
    .filter((year): year is string => year !== undefined);
  return Array.from(new Set(allYears)).sort((a, b) => parseInt(b) - parseInt(a));
};

// Statistics
export const getProjectStats = () => {
  return {
    total: projects.length,
    withRecognition: projects.filter(p => p.recognition).length,
    withLiveDemo: projects.filter(p => p.url).length,
    withGithub: projects.filter(p => p.github).length,
    technologies: getAllTechnologies().length,
  };
};
