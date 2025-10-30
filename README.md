# 🚀 Modern Developer Portfolio

A cutting-edge, performance-optimized portfolio website built with Next.js 15, TypeScript, and advanced animations. Features immersive 3D elements, smooth scrolling, and professional UI/UX design.

![Portfolio Preview](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🎨 **Design & Animation**
- **Modern Glass Morphism UI** with sophisticated backdrop blur effects
- **Smooth Scroll Experience** powered by Lenis for buttery performance
- **Advanced Framer Motion Animations** with stagger effects and transitions
- **3D WebGL Background** using Three.js for immersive visuals
- **Responsive Design** optimized for all devices and screen sizes

### 🧭 **Navigation & UX**
- **Smart Hide-on-Scroll Navbar** with elevation states
- **Command Palette** (Ctrl/Cmd+K) for quick navigation
- **Scroll Progress Indicator** with gradient visualization
- **Deep Linking Support** with URL hash updates
- **Keyboard Navigation** and accessibility features

### 💼 **Portfolio Sections**
- **Interactive Skills Showcase** with scrollytelling timeline
- **Advanced Project Gallery** with filtering and modal views
- **Dynamic About Section** with animated content
- **Contact Integration** with form validation

### ⚡ **Performance & Developer Experience**
- **TypeScript Strict Mode** for type safety
- **ESLint & Prettier** for code quality
- **Path Aliases** for clean imports
- **Optimized Images** with Next.js Image component
- **Bundle Analysis** and performance monitoring

## 🛠️ Tech Stack

### **Frontend**
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **Animations:** Framer Motion 6.5
- **Icons:** Lucide React, React Icons

### **3D & Visual Effects**
- **3D Engine:** Three.js 0.180
- **React Three Fiber:** @react-three/fiber 9.3
- **3D Helpers:** @react-three/drei 10.7
- **Smooth Scrolling:** Lenis 1.3

### **Animation Libraries**
- **Scroll Animations:** AOS (Animate On Scroll) 2.3
- **Motion Library:** Framer Motion 6.5
- **Smooth Scrolling:** @studio-freight/lenis 1.0

## 📁 Project Structure


# ```plaintext
```
r_protfolio/
├── 📁 public/                    # Static assets
│   ├── 📁 footer/               # Footer images
│   ├── 📁 hero/                 # Hero section assets
│   ├── 📁 profile/              # Profile pictures
│   └── 📁 projects/             # Project screenshots
│
├── 📁 src/
│   ├── 📁 app/                  # Next.js App Router
│   │   ├── 📁 components/       # Page-specific components
│   │   │   ├── 📄 About.tsx            # About section
│   │   │   ├── 📄 AdvancedHero.tsx     # Enhanced hero component
│   │   │   ├── 📄 Footer.tsx           # Site footer
│   │   │   ├── 📄 Hero.tsx             # Hero section
│   │   │   ├── 📄 Navbar.tsx           # Navigation with command palette
│   │   │   ├── 📄 Projects.tsx         # Advanced project showcase
│   │   │   ├── 📄 Skills.tsx           # Interactive skills timeline
│   │   │   ├── 📄 SkillsBackground.tsx # WebGL background component
│   │   │   └── 📄 Skills.css           # Skills-specific styles
│   │   │
│   │   ├── 📁 skills/           # Skills page route
│   │   │   └── 📄 page.tsx             # Skills page component
│   │   │
│   │   ├── 📄 globals.css              # Global styles & Tailwind
│   │   ├── 📄 layout.tsx               # Root layout component
│   │   └── 📄 page.tsx                 # Home page
│   │
│   ├── 📁 components/           # Shared/reusable components
│   │   ├── 📄 AdvancedMotion.tsx       # Motion wrappers
│   │   ├── 📄 AdvancedVSCode.tsx       # VS Code simulation
│   │   ├── 📄 ErrorBoundary.tsx        # Error handling
│   │   └── 📁 ui/                      # UI primitives
│   │       └── 📄 Loading.tsx          # Loading components
│   │
│   ├── 📁 constants/            # App configuration
│   │   ├── 📄 index.ts                 # General constants
│   │   └── 📄 skillsData.ts            # Skills data structure
│   │
│   ├── 📁 hooks/                # Custom React hooks
│   │   └── 📄 index.ts                 # Hook exports
│   │
│   ├── 📁 types/                # TypeScript definitions
│   │   ├── 📄 aos.d.ts                 # AOS type declarations
│   │   └── 📄 framer-motion.d.ts       # Motion type extensions
│   │
│   └── 📁 utils/                # Utility functions
│       ├── 📄 advancedAnimations.ts    # Animation helpers
│       ├── 📄 performance.ts           # Performance utilities
│       └── 📄 webglEffects.ts          # WebGL effect helpers
│
├── 📄 eslint.config.mjs                # ESLint configuration
├── 📄 next.config.ts                   # Next.js configuration
├── 📄 package.json                     # Dependencies & scripts
├── 📄 postcss.config.mjs               # PostCSS configuration
├── 📄 tailwind.config.ts               # Tailwind CSS configuration
├── 📄 tsconfig.json                    # TypeScript configuration
└── 📄 README.md                        # Project documentation
```

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ 
- npm/yarn/pnpm/bun

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/r_protfolio.git
   cd r_protfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### **Build for Production**
```bash
npm run build
npm run start
```

## 🎯 Key Components

### **Navbar Component**
- Smart hide-on-scroll behavior
- Command palette with fuzzy search (Ctrl+K)
- Scroll progress indicator
- Theme toggle with persistence
- Smooth anchor navigation

### **Skills Component**
- Scrollytelling timeline layout
- Interactive chapter navigation
- WebGL particle background
- Per-skill markers on timeline
- Deep linking support

### **Projects Component**
- Advanced filtering system
- Modal gallery with carousel
- Technology tag system
- Interactive hover effects
- Responsive masonry layout

### **WebGL Background**
- Three.js particle system
- Dynamic color adaptation
- Performance optimized
- Fallback support

## 🔧 Configuration

### **Environment Variables**
Create a `.env.local` file:
```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

### **Customization**
- **Colors:** Edit `tailwind.config.ts`
- **Constants:** Modify `src/constants/index.ts`
- **Skills Data:** Update `src/constants/skillsData.ts`
- **Assets:** Replace images in `public/` directory

## 📱 Responsive Design

- **Mobile First:** Optimized for mobile devices
- **Breakpoints:** Tailored for all screen sizes
- **Touch Friendly:** Gesture-based interactions
- **Performance:** Lazy loading and optimization

## 🔍 SEO & Performance

- **Meta Tags:** Dynamic SEO optimization
- **Sitemap:** Auto-generated sitemap
- **Performance:** 95+ Lighthouse score
- **Accessibility:** WCAG 2.1 compliant

## 🚀 Deployment

### **Vercel (Recommended)**
```bash
npm install -g vercel
vercel
```

### **Netlify**
```bash
npm run build
# Deploy dist folder
```

### **Manual Deployment**
```bash
npm run build
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Framer Motion** for smooth animations
- **Three.js Community** for 3D capabilities
- **Tailwind CSS** for utility-first styling
- **Vercel** for hosting and deployment

---

**Built with ❤️ by [Your Name]**

🌐 **Live Demo:** [your-portfolio-url.com](https://your-portfolio-url.com)  
📧 **Contact:** your.email@example.com  
💼 **LinkedIn:** [Your LinkedIn](https://linkedin.com/in/your-profile)  
🐙 **GitHub:** [Your GitHub](https://github.com/your-username)
#   a l o k - p r o f o l i o 
 
 