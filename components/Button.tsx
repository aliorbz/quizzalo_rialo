
import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '', 
  disabled = false,
  type = 'button'
}) => {
  const baseStyles = "px-8 py-3.5 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2 outline-none focus:ring-2 focus:ring-[#0B0B0B]/20";
  
  const variants = {
    primary: "bg-[#0B0B0B] text-[#E9E1D6] hover:bg-[#222] shadow-lg shadow-[#0B0B0B]/10 active:scale-95",
    secondary: "bg-[#8C857C]/10 text-[#0B0B0B] hover:bg-[#8C857C]/20 active:scale-95",
    outline: "border border-[#0B0B0B]/10 bg-transparent text-[#0B0B0B] hover:bg-[#0B0B0B]/5 active:scale-95",
    ghost: "bg-transparent text-[#8C857C] hover:text-[#0B0B0B] active:scale-95"
  };

  return (
    <motion.button
      type={type}
      whileTap={{ scale: 0.96 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''} ${className}`}
    >
      {children}
    </motion.button>
  );
};

export default Button;
