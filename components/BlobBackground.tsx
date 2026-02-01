
import React from 'react';
import { motion } from 'framer-motion';

const BlobBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <motion.div
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -50, 80, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] bg-[#DBCFBD] rounded-full blur-[100px] opacity-40"
      />
      <motion.div
        animate={{
          x: [0, -80, 40, 0],
          y: [0, 100, -50, 0],
          scale: [1, 1.1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -bottom-[10%] -right-[5%] w-[50vw] h-[50vw] bg-[#CFC4B5] rounded-full blur-[120px] opacity-30"
      />
      <motion.div
        animate={{
          x: [0, 50, -30, 0],
          y: [0, 40, 20, 0],
          scale: [1, 1.5, 0.8, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] bg-[#E2D9CD] rounded-full blur-[90px] opacity-25"
      />
    </div>
  );
};

export default BlobBackground;
