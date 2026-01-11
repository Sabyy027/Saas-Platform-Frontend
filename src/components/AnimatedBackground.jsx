import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const AnimatedBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      </div>

      {/* Floating Orbs */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full mix-blend-multiply filter blur-xl opacity-20"
          style={{
            width: `${Math.random() * 300 + 200}px`,
            height: `${Math.random() * 300 + 200}px`,
            background: i % 3 === 0 
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : i % 3 === 1
              ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
              : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          }}
          animate={{
            x: [
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`,
            ],
            y: [
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`,
            ],
          }}
          transition={{
            duration: Math.random() * 10 + 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Mouse-following gradient */}
      <motion.div
        className="absolute w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{
          x: mousePosition.x * window.innerWidth - 192,
          y: mousePosition.y * window.innerHeight - 192,
        }}
        transition={{
          type: 'spring',
          damping: 30,
          stiffness: 200,
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
