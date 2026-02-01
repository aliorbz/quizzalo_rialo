import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { Trophy, BookOpen, Timer, LayoutGrid } from 'lucide-react';

interface HomePageProps {
  onStartQuiz: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onStartQuiz }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-28 pb-16 sm:py-20 overflow-hidden relative">
      <header className="absolute top-0 left-0 right-0 p-4 sm:p-6 md:p-10 flex items-center justify-between z-20">
        <div className="flex items-center gap-2 sm:gap-3">
          <img 
            src="https://pbs.twimg.com/profile_images/1950265537784926208/qbjSWMDP_400x400.jpg" 
            alt="Rialo Logo" 
            className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl shadow-lg border-2 border-white/50"
          />
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link to="/topics">
            <Button variant="outline" className="px-3 sm:px-6 py-2 sm:py-2.5 text-[10px] sm:text-sm h-9 sm:h-11">
              <LayoutGrid className="w-3.5 h-3.5" /> <span>Topics</span>
            </Button>
          </Link>
          <Link to="/leaderboard">
            <Button variant="outline" className="px-3 sm:px-6 py-2 sm:py-2.5 text-[10px] sm:text-sm h-9 sm:h-11">
              <Trophy className="w-3.5 h-3.5" /> <span>Rankings</span>
            </Button>
          </Link>
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl w-full"
      >
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-block px-3 py-1 rounded-full bg-[#0B0B0B]/5 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-4 sm:mb-6"
        >
          Community Sprint
        </motion.span>
        
        <h1 className="text-6xl sm:text-8xl md:text-[10rem] font-serif font-black leading-[0.85] sm:leading-[0.8] mb-8 sm:mb-12 tracking-tighter">
          Quizzalo
        </h1>
        
        <p className="text-lg sm:text-xl md:text-2xl text-[#8C857C] mb-10 sm:mb-14 max-w-xl mx-auto font-light leading-relaxed px-4">
          A 60-second sprint through Rialo fundamentals.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 sm:mb-32 px-4">
          <Button onClick={onStartQuiz} className="w-full sm:w-auto text-lg sm:text-xl px-12 sm:px-16 py-4 sm:py-5">
            Start Quiz
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 max-w-5xl mx-auto text-left px-4 pb-20 sm:pb-0">
          {[
            { icon: BookOpen, title: "1. Pick a topic", text: "Select from core Rialo modules to test your depth." },
            { icon: Timer, title: "2. 60-second run", text: "Answer 10 questions before the clock hits zero." },
            { icon: Trophy, title: "3. Get ranked", text: "Submit your best time and score to the global list." }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + (i * 0.1) }}
              className="bg-white/40 backdrop-blur-sm p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border border-white/40 shadow-sm relative group"
            >
              <item.icon className="w-5 h-5 sm:w-6 sm:h-6 mb-3 sm:mb-4 opacity-40 group-hover:opacity-100 transition-opacity" />
              <h3 className="text-lg sm:text-xl font-medium mb-1 sm:mb-2">{item.title}</h3>
              <p className="text-[#8C857C] text-sm sm:text-base font-light leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;
