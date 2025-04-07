import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

interface PerformanceCardProps {
  score: number;
  title: string;
  description: string;
  delay: number;
}

const PerformanceCard = ({ score, title, description, delay }: PerformanceCardProps) => {
  const [displayScore, setDisplayScore] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  useEffect(() => {
    if (isInView) {
      let startTime: number;
      let animationDuration = 1500; // ms
      
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / animationDuration, 1);
        const currentValue = progress * score;
        
        setDisplayScore(Number(currentValue.toFixed(1)));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayScore(score);
        }
      };
      
      // Delay the start of animation
      const timeoutId = setTimeout(() => {
        requestAnimationFrame(animate);
      }, delay);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isInView, score, delay]);

  return (
    <motion.div 
      ref={ref}
      className="bg-gradient-to-b from-[#001c54]/30 to-[#000c33]/30 backdrop-blur-md rounded-xl p-6 text-center border border-[#00ECBE]/20"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: delay / 1000 }}
      whileHover={{ 
        y: -8,
        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)",
        transition: { duration: 0.3 }
      }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="flex flex-col items-center">
        <div className="relative mb-4">
          <div className="text-6xl font-bold text-[#00ECBE]" style={{ textShadow: "0 0 10px rgba(0, 236, 190, 0.5)" }}>
            {displayScore === 10 ? "10.0" : (displayScore.toString().includes('.') ? displayScore.toFixed(1) : displayScore + ".0")}
          </div>
          <div className="absolute -top-1 right-0 text-gray-400 text-sm">/10</div>
        </div>
        <div className="w-16 h-1 bg-[#00ECBE] mb-4 rounded-full"></div>
        <h3 className="text-[#00ECBE] font-poppins font-medium text-lg mb-2">{title}</h3>
        <p className="text-gray-300 text-sm">{description}</p>
      </div>
    </motion.div>
  );
};

const PerformanceSection = () => {
  const performanceMetrics = [
    { 
      score: 9.8, 
      title: "API Response Speed", 
      description: "Lightning-fast predictions",
      delay: 0
    },
    { 
      score: 10, 
      title: "Prediction Accuracy", 
      description: "100% accurate predictions",
      delay: 200
    },
    { 
      score: 9.9, 
      title: "Development Team", 
      description: "Expert developers & analysts",
      delay: 400
    },
    { 
      score: 9.7, 
      title: "User Satisfaction", 
      description: "Trusted by thousands",
      delay: 600
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-[#05012B]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4">
            <span className="text-white">Our </span>
            <span className="text-[#00ECBE]" style={{ textShadow: "0 0 10px rgba(0, 236, 190, 0.5)" }}>Performance</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            See why thousands of users trust our platform for accurate predictions and exceptional experience.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {performanceMetrics.map((metric, index) => (
            <PerformanceCard 
              key={index}
              score={metric.score}
              title={metric.title}
              description={metric.description}
              delay={metric.delay}
            />
          ))}
        </div>
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.a 
            href="#" 
            className="inline-flex items-center gap-2 bg-[#00ECBE] text-[#05012B] font-semibold px-8 py-3 rounded-full transition duration-300"
            whileHover={{ 
              boxShadow: "0 0 20px 0 rgba(0, 236, 190, 0.6)",
              y: -2 
            }}
          >
            <span>Join Our Community</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default PerformanceSection;
