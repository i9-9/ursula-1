'use client';

import { motion } from 'framer-motion';
import UrsulaLogo from './UrsulaLogo';

const Loader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background text-foreground">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        aria-label="Loading"
      >
        <UrsulaLogo className="w-[180px] h-auto" title="Ursula" />
      </motion.div>
    </div>
  );
};

export default Loader;


