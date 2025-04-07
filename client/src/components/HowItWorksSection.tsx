import { motion } from 'framer-motion';
import { User, Palette, Trophy, Info } from 'lucide-react';

const steps = [
  {
    icon: <User className="text-[#00ECBE] text-3xl" />,
    title: "Create Account",
    description: "Sign up for free and complete your profile to start your prediction journey."
  },
  {
    icon: <Palette className="text-[#00ECBE] text-3xl" />,
    title: "Make Prediction",
    description: "Choose a color and place your bet based on our algorithm's suggestions."
  },
  {
    icon: <Trophy className="text-[#00ECBE] text-3xl" />,
    title: "Collect Rewards",
    description: "Win big with accurate predictions and withdraw your earnings instantly."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6
    }
  }
};

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-16 lg:py-24 bg-gradient-to-b from-[#001c54] to-[#000c33]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4">
            <span className="text-white">How </span>
            <span className="text-[#00ECBE]" style={{ textShadow: "0 0 10px rgba(0, 236, 190, 0.5)" }}>It Works</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Our platform makes color prediction simple, secure, and rewarding in just a few easy steps.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              className="bg-[#05012B]/30 rounded-xl p-6 text-center border border-[#00ECBE]/20"
              variants={itemVariants}
              whileHover={{ 
                y: -8,
                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)",
                transition: { duration: 0.3 }
              }}
            >
              <div className="w-16 h-16 rounded-full bg-[#00ECBE]/20 flex items-center justify-center mx-auto mb-6">
                {step.icon}
              </div>
              <h3 className="text-[#00ECBE] font-poppins font-medium text-xl mb-3">{step.title}</h3>
              <p className="text-gray-300">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div 
            className="inline-block bg-[#00ECBE]/10 p-4 rounded-lg border border-[#00ECBE]/30"
            whileHover={{ 
              boxShadow: "0 0 15px 0 rgba(0, 236, 190, 0.3)",
              scale: 1.02
            }}
          >
            <p className="text-[#00ECBE] font-medium flex items-center justify-center gap-2">
              <Info size={20} />
              All results are verified by technology for transparency and fairness.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
