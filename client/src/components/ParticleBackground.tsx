import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

const ParticleBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const numParticles = 20;

  useEffect(() => {
    if (!containerRef.current) return;

    const generateParticles = () => {
      const tempParticles: Particle[] = [];
      for (let i = 0; i < numParticles; i++) {
        tempParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.floor(Math.random() * 6) + 3,
          duration: Math.floor(Math.random() * 8) + 4,
          delay: Math.random() * 5
        });
      }
      particlesRef.current = tempParticles;
    };

    generateParticles();
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    >
      {particlesRef.current.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-[#00ECBE]/60 pointer-events-none"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          initial={{ opacity: 0, y: 0, scale: 1 }}
          animate={{
            opacity: [0, 0.5, 0],
            y: -20,
            scale: 0,
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

export default ParticleBackground;
