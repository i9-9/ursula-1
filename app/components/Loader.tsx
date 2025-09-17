'use client';

import { motion } from 'framer-motion';
import UrsulaLogo from './UrsulaLogo';

const Loader = () => {

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen w-full flex items-center justify-center bg-white text-black fixed inset-0 z-[9999]"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: 1.2, 
          ease: "easeOut"
        }}
        className="text-center"
      >
        <UrsulaLogo className="w-[180px] h-auto" title="Ursula" />
      </motion.div>
    </motion.div>
  );
};

export default Loader;