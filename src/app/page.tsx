// import Navbar from './components/Navbar';
import AdvancedHero from './components/AdvancedHero';
import About from './components/About';
// import HybridProjects from './components/HybridProjects';
import Skills from './components/Skills';
import Projects from './components/project';
// import Contact from './components/Contact';
import Footer from './components/Footer';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Project } from '@/types/project';

export default function Home() {
  const projects: Project[] = [
    {
      id: 'ddos-detection',
      title: 'DDoS Attack Detection System',
      description: 'Real-time AI-powered DDoS detection with hybrid CNN-Transformer model...',
      images: ['/projects/project1.jpg', '/projects/project2.jpg'],
      demoUrl: 'https://codesandbox.io/s/your-demo-id',
      caseStudyUrl: '/case-studies/ddos-detection',
      technologies: ['Python', 'TensorFlow', 'FastAPI', 'Docker'],
      category: 'ai-ml',
      github: 'https://github.com/yourusername/ddos-detection',
      miniDemoType: 'codesandbox'
    },
    {
      id: 'algo-visualizer',
      title: 'Algorithm Visualizer',
      description: "A visual learning platform for algorithms like Bubble, Merge, and Dijkstra's...",
      images: ['/projects/project2.jpg', '/projects/project3.jpg'],
      demoUrl: 'https://algo-visualizer-alok.netlify.app/',
      caseStudyUrl: '/case-studies/algo-visualizer',
      technologies: ['TypeScript', 'React', 'D3.js', 'Framer Motion'],
      category: 'web-dev',
      github: 'https://github.com/yourusername/algo-visualizer',
      liveUrl: 'https://algo-visualizer-alok.netlify.app/',
      miniDemoType: 'iframe'
    },
    // ... more projects
  ];

  return (
    <ErrorBoundary>
      {/* <Navbar /> */}
      <main className="flex flex-col w-full overflow-x-hidden">
        {/* Advanced Hero Section */}
        <AdvancedHero />
        
        {/* About Section */}
        <About />
        
        {/* Advanced Skills Section */}
        <Skills />
        
        {/* Projects Section */}
        <Projects />
        
        {/* Contact Section - Uncomment when ready */}
        {/* <Contact /> */}
        
        {/* Footer */}
        <Footer />
      </main>
    </ErrorBoundary>
  );
}