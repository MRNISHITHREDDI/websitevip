import { motion } from 'framer-motion';
import wingoImage from "../assets/wingo-image.png";
import trxWinImage from "../assets/trx-win-image.png";

const cardVariants = {
  initial: { y: 50, opacity: 0 },
  animate: { 
    y: 0, 
    opacity: 1,
    transition: { 
      duration: 0.6,
      ease: "easeOut"
    }
  },
  hover: {
    y: -8,
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)",
    transition: {
      duration: 0.3
    }
  }
};

const FeaturesSection = () => {
  return (
    <section id="prediction" className="py-16 lg:py-24 bg-gradient-to-b from-[#001c54] to-[#000c33]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4">
            <span className="text-[#00ECBE]">Revolutionary</span>
            <span className="text-white"> Prediction Platform</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Our advanced platform combines blockchain technology with predictive algorithms to give you the edge in color prediction games.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* WinGo Feature */}
          <motion.div 
            className="bg-[#05012B]/50 rounded-xl p-6 lg:p-8 border border-[#00ECBE]/20 relative overflow-hidden"
            variants={cardVariants}
            initial="initial"
            whileInView="animate"
            whileHover="hover"
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-1/2">
                <div className="relative rounded-xl overflow-hidden"
                  style={{ 
                    boxShadow: "0 0 15px 0 rgba(0, 236, 190, 0.3)",
                    border: "2px solid rgba(0, 236, 190, 0.3)",
                    aspectRatio: "16/9"
                  }}>
                  {/* WinGo Image */}
                  <motion.div
                    className="absolute inset-0 w-full h-full"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img 
                      src={wingoImage} 
                      alt="Win Go Game" 
                      className="w-full h-full object-fill"
                      style={{ display: "block" }}
                    />
                  </motion.div>
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <h3 className="text-[#00ECBE] text-2xl font-poppins font-bold mb-3">Win Go</h3>
                <p className="text-gray-300 mb-6">
                  Win Go event celebrates luck and chance by providing big prizes for little money. The lottery's simplicity and potential jackpot appeal make it popular. Every ticket has the opportunity of a life-changing win, making it a symbol of hope and excitement.
                </p>
                <div className="flex gap-4">
                  <motion.a 
                    href="#" 
                    className="bg-gradient-to-b from-[#001c54] to-[#000c33] border border-[#00ECBE] text-[#00ECBE] px-4 py-2 rounded-full transition duration-300 text-sm"
                    whileHover={{ 
                      boxShadow: "0 0 20px 0 rgba(0, 236, 190, 0.6)",
                      y: -2 
                    }}
                  >
                    Demo
                  </motion.a>
                  <motion.a 
                    href="#" 
                    className="bg-[#00ECBE] text-[#05012B] px-4 py-2 rounded-full transition duration-300 text-sm"
                    whileHover={{ 
                      boxShadow: "0 0 20px 0 rgba(0, 236, 190, 0.6)",
                      y: -2 
                    }}
                  >
                    VIP Prediction
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* TRX Hash Feature */}
          <motion.div 
            className="bg-[#05012B]/50 rounded-xl p-6 lg:p-8 border border-[#00ECBE]/20"
            variants={cardVariants}
            initial="initial"
            whileInView="animate"
            whileHover="hover"
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-1/2">
                <div className="relative rounded-xl overflow-hidden"
                  style={{ 
                    boxShadow: "0 0 15px 0 rgba(0, 236, 190, 0.3)",
                    border: "2px solid rgba(0, 236, 190, 0.3)",
                    aspectRatio: "16/9"
                  }}>
                  {/* TRX Win Image */}
                  <motion.div
                    className="absolute inset-0 w-full h-full"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img 
                      src={trxWinImage} 
                      alt="TRX Win Game" 
                      className="w-full h-full object-fill"
                      style={{ display: "block" }}
                    />
                  </motion.div>
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <h3 className="text-[#00ECBE] text-2xl font-poppins font-bold mb-3">TRX Hash</h3>
                <p className="text-gray-300 mb-6">
                  TRX Hash feature combines technology with games. TRON's (TRX) blockchain technology ensures fair and transparent event results in these games. Every ticket has the opportunity of a life-changing win, making it a symbol of hope and excitement.
                </p>
                <div className="flex gap-4">
                  <motion.a 
                    href="#" 
                    className="bg-gradient-to-b from-[#001c54] to-[#000c33] border border-[#00ECBE] text-[#00ECBE] px-4 py-2 rounded-full transition duration-300 text-sm"
                    whileHover={{ 
                      boxShadow: "0 0 20px 0 rgba(0, 236, 190, 0.6)",
                      y: -2 
                    }}
                  >
                    Demo
                  </motion.a>
                  <motion.a 
                    href="#" 
                    className="bg-[#00ECBE] text-[#05012B] px-4 py-2 rounded-full transition duration-300 text-sm"
                    whileHover={{ 
                      boxShadow: "0 0 20px 0 rgba(0, 236, 190, 0.6)",
                      y: -2 
                    }}
                  >
                    VIP Prediction
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
