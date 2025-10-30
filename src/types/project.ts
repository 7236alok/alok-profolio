
export interface Project {
  id: string;
  title: string;
  description: string;
  images: string[];
  demoUrl: string;
  caseStudyUrl: string;
  technologies: string[];
  category: string;
  github?: string;
  liveUrl?: string;
  miniDemoType: 'iframe' | 'codesandbox' | 'video';
  engagementMetrics?: {
    views: number;
    interactions: number;
    avgTimeSpent: number;
  };
}

export interface EngagementEvent {
  projectId: string;
  type: 'view' | 'interaction' | 'demo_open' | 'case_study_open';
  timestamp: Date;
  duration?: number;
}
