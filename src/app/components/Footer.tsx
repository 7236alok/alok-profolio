'use client';

import React, { useRef, useEffect, useState, memo, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Github, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { PERSONAL_INFO, SOCIAL_LINKS } from '@/constants';
import * as THREE from 'three';

interface ClockHandProps {
  length: number;
  width: number;
  color: string;
  rotationRef: React.RefObject<THREE.Mesh | null>;
}

const ClockHand = memo<ClockHandProps>(({ length, width, color, rotationRef }) => (
  <mesh ref={rotationRef}>
    <boxGeometry args={[width, length, 0.1]} />
    <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
    <mesh position={[0, length / 2, 0]} />
  </mesh>
));
ClockHand.displayName = 'ClockHand';

const AnalogClock = memo(({ parallax }: { parallax: THREE.Vector2 }) => {
  const hourRef = useRef<THREE.Mesh>(null);
  const minuteRef = useRef<THREE.Mesh>(null);
  const secondRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const hourMarksRef = useRef<THREE.Group>(null);

  interface FrameClock {
    elapsedTime: number;
  }

  interface FrameState {
    clock: FrameClock;
  }

  useFrame((state: FrameState): void => {
    const now: Date = new Date();
    const seconds: number = now.getSeconds() + now.getMilliseconds() / 1000;
    const minutes: number = now.getMinutes() + seconds / 60;
    const hours: number = (now.getHours() % 12) + minutes / 60;

    if (secondRef.current) secondRef.current.rotation.z = -seconds * (Math.PI / 30);
    if (minuteRef.current) minuteRef.current.rotation.z = -minutes * (Math.PI / 30);
    if (hourRef.current) hourRef.current.rotation.z = -hours * (Math.PI / 6);

    if (groupRef.current) {
      groupRef.current.position.x = parallax.x * 0.5;
      groupRef.current.position.y = parallax.y * 0.5;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      groupRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.2) * 0.1;
    }

    if (hourMarksRef.current) {
      hourMarksRef.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });

  const hourMarks = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const angle = (i * Math.PI) / 6;
      const radius = 4.3;
      const x = Math.sin(angle) * radius;
      const y = Math.cos(angle) * radius;
      return (
        <mesh key={i} position={[x, y, 0.15]}>
          <cylinderGeometry args={[0.15, 0.15, 0.3, 16]} />
          <meshStandardMaterial 
            color="#4f46e5" 
            emissive="#4f46e5" 
            emissiveIntensity={0.8}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      );
    });
  }, []);

  return (
    <group ref={groupRef}>
      {/* REMOVED: Clock Face (the black horizontal cylinder) */}
      
      {/* Inner Ring */}
      <mesh>
        <torusGeometry args={[4.8, 0.12, 16, 100]} />
        <meshStandardMaterial 
          color="#6366f1" 
          emissive="#6366f1" 
          emissiveIntensity={1.2}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Outer Glow Ring */}
      <mesh>
        <torusGeometry args={[5.1, 0.06, 16, 100]} />
        <meshStandardMaterial 
          color="#ec4899" 
          emissive="#ec4899" 
          emissiveIntensity={0.8}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Hour Markers */}
      <group ref={hourMarksRef}>
        {hourMarks}
      </group>

      {/* Center Pivot */}
      <mesh position={[0, 0, 0.3]}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial 
          color="#fbbf24" 
          emissive="#fbbf24" 
          emissiveIntensity={1.5}
          metalness={1}
          roughness={0}
        />
      </mesh>

      {/* Clock Hands */}
      <ClockHand length={2.5} width={0.25} color="#e0e0e0" rotationRef={hourRef} />
      <ClockHand length={3.8} width={0.18} color="#fbbf24" rotationRef={minuteRef} />
      <ClockHand length={4.2} width={0.1} color="#ef4444" rotationRef={secondRef} />
    </group>
  );
});
AnalogClock.displayName = 'AnalogClock';

const ParticleField = memo(({ parallax }: { parallax: THREE.Vector2 }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const count = 300;
    const pos = [];
    const col = [];
    for (let i = 0; i < count; i++) {
      pos.push((Math.random() - 0.5) * 25);
      pos.push((Math.random() - 0.5) * 25);
      pos.push((Math.random() - 0.5) * 25);
      col.push(Math.random() * 0.5 + 0.5);
      col.push(Math.random() * 0.3 + 0.3);
      col.push(Math.random() * 0.6 + 0.4);
    }
    return { positions: new Float32Array(pos), colors: new Float32Array(col) };
  }, []);

  useFrame(() => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += 0.001;
    pointsRef.current.position.x = parallax.x * 1.5;
    pointsRef.current.position.y = parallax.y * 1.5;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.08} vertexColors transparent opacity={0.8} />
    </points>
  );
});
ParticleField.displayName = 'ParticleField';

const MovingDotsBackground = memo(() => {
  const parallaxRef = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (0.5 - e.clientY / window.innerHeight) * 2;
      parallaxRef.current.set(x, y);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 20], fov: 55 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.2} />
        <AnalogClock parallax={parallaxRef.current} />
        <ParticleField parallax={parallaxRef.current} />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
    </div>
  );
});
MovingDotsBackground.displayName = 'MovingDotsBackground';

interface FooterProps {
  showClockBackground?: boolean;
  fullscreen?: boolean;
}

const Footer: React.FC<FooterProps> = ({ 
  showClockBackground = true,
  fullscreen = false,
}) => {
  return (
    <footer 
      className={`relative w-full ${fullscreen ? 'h-screen' : 'min-h-[80vh]'} text-white flex items-center justify-center overflow-hidden border-t border-gray-800`}
    >
      {showClockBackground && <MovingDotsBackground />}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 -z-5 before:content-[''] before:absolute before:inset-0 animated-gradient" />
      <style jsx>{`
        .animated-gradient {
          background: linear-gradient(120deg, rgba(99,102,241,0.2), rgba(236,72,153,0.15), rgba(79,70,229,0.2));
          background-size: 300% 300%;
          animation: gradientShift 20s ease infinite;
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* Three Column Layout */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
        
        {/* Left Column - Greeting & Thankful Content */}
        <div className="space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            <h3 className="text-4xl sm:text-5xl font-serif font-light bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Thank You
            </h3>
            <p className="text-2xl font-light text-gray-300">
              For Your Time
            </p>
          </div>
          
          <div className="space-y-3">
            <p className="text-gray-300 text-lg leading-relaxed">
              It's been a pleasure sharing my journey with you. Every connection matters and I'm grateful for the opportunity to connect.
            </p>
            <p className="text-gray-400 text-sm italic">
              "Great things in business are never done by one person. They're done by a team of people."
            </p>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <p className="text-gray-300">
              Let's create something amazing together
            </p>
          </div>
        </div>

        {/* Middle Column - Clock (Now without the black face) */}
        <div className="flex justify-center items-center">
          <div className="relative w-64 h-64 lg:w-80 lg:h-80">
            <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
              <ambientLight intensity={0.6} />
              <pointLight position={[5, 5, 5]} intensity={1} />
              <AnalogClock parallax={new THREE.Vector2(0, 0)} />
            </Canvas>
          </div>
        </div>

        {/* Right Column - Connect Content */}
        <div className="space-y-8 text-center lg:text-right">
          <div className="space-y-4">
            <h3 className="text-3xl font-serif font-light bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Let's Connect
            </h3>
            <p className="text-gray-300 text-lg">
              Ready to start a conversation?
            </p>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <div className="flex items-center justify-end gap-3 text-gray-300 hover:text-white transition-colors">
              <Mail size={20} className="text-blue-400" />
              <a href={`mailto:${SOCIAL_LINKS.email ?? PERSONAL_INFO.email}`} className="text-sm lg:text-base">
                {SOCIAL_LINKS.email ?? PERSONAL_INFO.email}
              </a>
            </div>
            
            {PERSONAL_INFO.phone && (
              <div className="flex items-center justify-end gap-3 text-gray-300 hover:text-white transition-colors">
                <Phone size={20} className="text-green-400" />
                <span className="text-sm lg:text-base">{PERSONAL_INFO.phone}</span>
              </div>
            )}
            
            {PERSONAL_INFO.location && (
              <div className="flex items-center justify-end gap-3 text-gray-300">
                <MapPin size={20} className="text-red-400" />
                <span className="text-sm lg:text-base">{PERSONAL_INFO.location}</span>
              </div>
            )}
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <p className="text-gray-400 text-sm">Follow my work</p>
            <nav aria-label="Social links" className="flex justify-end gap-6">
              <a 
                href={SOCIAL_LINKS.github} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-300 hover:text-white transition-all hover:-translate-y-1 hover:scale-110"
                aria-label="GitHub"
              >
                <Github size={28} />
              </a>
              <a 
                href={SOCIAL_LINKS.linkedin} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-300 hover:text-white transition-all hover:-translate-y-1 hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin size={28} />
              </a>
              <a 
                href={`mailto:${SOCIAL_LINKS.email ?? PERSONAL_INFO.email}`}
                className="text-gray-300 hover:text-white transition-all hover:-translate-y-1 hover:scale-110"
                aria-label="Email"
              >
                <Mail size={28} />
              </a>
            </nav>
          </div>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-gray-800 py-6 text-center">
        <div className="text-sm text-gray-400 space-y-2">
          <p>© {new Date().getFullYear()} {PERSONAL_INFO.name}. All rights reserved.</p>
          <div className="space-x-6">
            <a href="/privacy" className="hover:text-white transition-colors text-xs">Privacy</a>
            <a href="/terms" className="hover:text-white transition-colors text-xs">Terms</a>
            <a href="/sitemap" className="hover:text-white transition-colors text-xs">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
export { MovingDotsBackground };