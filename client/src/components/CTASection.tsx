import { motion } from 'framer-motion';

const CTASection = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-b from-[#001c54] to-[#000c33] rounded-2xl p-8 lg:p-12 shadow-lg border border-[#00ECBE]/20 relative overflow-hidden">
          <motion.div 
            className="absolute top-0 right-0 w-64 h-64 bg-[#00ECBE]/10 rounded-full"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ filter: "blur(3rem)" }}
          />
          <motion.div 
            className="absolute bottom-0 left-0 w-80 h-80 bg-[#00ECBE]/5 rounded-full"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.05, 0.1, 0.05]
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ filter: "blur(3rem)" }}
          />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <motion.div 
              className="lg:w-2/3"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4 text-white">
                Ready to start winning with <span className="text-[#00ECBE]" style={{ textShadow: "0 0 10px rgba(0, 236, 190, 0.5)" }}>color prediction?</span>
              </h2>
              <p className="text-gray-300 mb-0 lg:mb-0 max-w-2xl">
                Join our community of successful players and start making accurate predictions today. Get exclusive access to VIP predictions and special bonuses.
              </p>
            </motion.div>
            <motion.div 
              className="lg:w-1/3 flex flex-col sm:flex-row lg:flex-col gap-4"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.a 
                href="#" 
                className="bg-[#00ECBE] text-[#05012B] font-semibold px-8 py-3 rounded-full transition duration-300 text-center"
                whileHover={{ 
                  boxShadow: "0 0 20px 0 rgba(0, 236, 190, 0.6)",
                  y: -2 
                }}
              >
                Start Playing Now
              </motion.a>
              <motion.a 
                href="https://t.me/ManagerChetanaOfficial" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#00ECBE] text-[#05012B] font-semibold px-8 py-3 rounded-full transition duration-300 text-center flex items-center justify-center gap-2"
                whileHover={{ 
                  boxShadow: "0 0 20px 0 rgba(0, 236, 190, 0.6)",
                  y: -2 
                }}
              >
                Join Our Community <span className="ml-1">→</span>
              </motion.a>
              <motion.a 
                href="#" 
                className="bg-transparent border border-[#00ECBE] text-[#00ECBE] px-8 py-3 rounded-full transition duration-300 text-center"
                whileHover={{ 
                  boxShadow: "0 0 20px 0 rgba(0, 236, 190, 0.6)",
                  y: -2 
                }}
              >
                Learn More
              </motion.a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
