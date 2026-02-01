import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

interface NameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  targetTopicId?: string | null;
}

const NameModal: React.FC<NameModalProps> = ({ isOpen, onClose, onSubmit, targetTopicId }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validate = (val: string) => {
    const trimmed = val.trim();
    if (trimmed.length < 2 || trimmed.length > 16) return 'Name must be 2–16 characters.';
    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) return 'Letters, numbers, and underscores only.';
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate(name);
    if (err) {
      setError(err);
      return;
    }
    onSubmit(name);
    
    if (targetTopicId) {
      navigate(`/quiz/${targetTopicId}`);
    } else {
      navigate('/topics');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#E9E1D6]/80 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-white w-full max-w-md p-8 md:p-10 rounded-[2.5rem] shadow-2xl"
      >
        <h2 className="text-3xl font-serif mb-2">Identify yourself.</h2>
        <p className="text-[#8C857C] mb-8">Choose a display name for the leaderboard.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="e.g. rialo_fan_01"
              className="w-full bg-[#E9E1D6]/30 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[#0B0B0B]/10 transition-all text-lg font-medium"
            />
            {error && <p className="text-red-500 text-sm pl-2">{error}</p>}
          </div>

          <div className="flex flex-col gap-3">
            <Button type="submit" className="w-full">Continue</Button>
            <Button variant="ghost" onClick={onClose} className="w-full">Cancel</Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default NameModal;