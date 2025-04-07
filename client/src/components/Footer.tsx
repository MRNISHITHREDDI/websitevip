import { Twitter, MessageCircle, Share2, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-[#05012B] pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-full bg-[#00ECBE]/20 flex items-center justify-center mr-2">
                <span className="text-[#00ECBE] text-xl font-bold">W</span>
              </div>
              <span className="text-[#00ECBE] font-poppins font-bold text-xl">WinGo</span>
            </div>
            <p className="text-gray-400 mb-6">The most advanced color prediction platform powered by blockchain technology.</p>
            <div className="flex gap-4">
              <motion.a 
                href="#" 
                className="w-8 h-8 rounded-full bg-[#00ECBE]/20 flex items-center justify-center text-[#00ECBE]"
                whileHover={{ 
                  backgroundColor: "#00ECBE",
                  color: "#05012B",
                  scale: 1.1
                }}
                transition={{ duration: 0.3 }}
              >
                <Twitter size={16} />
              </motion.a>
              <motion.a 
                href="#" 
                className="w-8 h-8 rounded-full bg-[#00ECBE]/20 flex items-center justify-center text-[#00ECBE]"
                whileHover={{ 
                  backgroundColor: "#00ECBE",
                  color: "#05012B",
                  scale: 1.1
                }}
                transition={{ duration: 0.3 }}
              >
                <MessageCircle size={16} />
              </motion.a>
              <motion.a 
                href="#" 
                className="w-8 h-8 rounded-full bg-[#00ECBE]/20 flex items-center justify-center text-[#00ECBE]"
                whileHover={{ 
                  backgroundColor: "#00ECBE",
                  color: "#05012B",
                  scale: 1.1
                }}
                transition={{ duration: 0.3 }}
              >
                <Share2 size={16} />
              </motion.a>
            </div>
          </div>
          
          <div>
            <h3 className="text-[#00ECBE] font-poppins font-medium text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/">
                  <a className="text-gray-400 hover:text-[#00ECBE] transition duration-300">Home</a>
                </Link>
              </li>
              <li>
                <a href="#prediction" className="text-gray-400 hover:text-[#00ECBE] transition duration-300">Predictions</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#00ECBE] transition duration-300">How It Works</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#00ECBE] transition duration-300">VIP Access</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#00ECBE] transition duration-300">Blog</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-[#00ECBE] font-poppins font-medium text-lg mb-6">Support</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-[#00ECBE] transition duration-300">FAQ</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#00ECBE] transition duration-300">Help Center</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#00ECBE] transition duration-300">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#00ECBE] transition duration-300">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#00ECBE] transition duration-300">Contact Us</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-[#00ECBE] font-poppins font-medium text-lg mb-6">Newsletter</h3>
            <p className="text-gray-400 mb-4">Subscribe to get the latest updates and offers.</p>
            <form className="mb-4">
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-[#05012B] border border-[#00ECBE]/30 text-gray-300 px-4 py-2 rounded-l-full focus:outline-none focus:ring-2 focus:ring-[#00ECBE]/50 w-full" 
                />
                <motion.button 
                  type="submit" 
                  className="bg-[#00ECBE] text-[#05012B] px-4 py-2 rounded-r-full transition duration-300"
                  whileHover={{ 
                    boxShadow: "0 0 20px 0 rgba(0, 236, 190, 0.6)"
                  }}
                >
                  <Send size={18} />
                </motion.button>
              </div>
            </form>
            <p className="text-gray-500 text-xs">By subscribing you agree to our Privacy Policy</p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">© {currentYear} WinGo. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-500 text-sm hover:text-[#00ECBE] transition duration-300">Terms</a>
              <a href="#" className="text-gray-500 text-sm hover:text-[#00ECBE] transition duration-300">Privacy</a>
              <a href="#" className="text-gray-500 text-sm hover:text-[#00ECBE] transition duration-300">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
