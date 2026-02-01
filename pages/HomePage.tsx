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
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20 overflow-hidden relative">
      <header className="absolute top-0 left-0 right-0 p-6 md:p-10 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <img 
            src="https://pbs.twimg.com/profile_images/1950265537784926208/qbjSWMDP_400x400.jpg" 
            alt="Rialo Logo" 
            className="w-12 h-12 rounded-2xl shadow-lg border-2 border-white/50"
          />
          <span className="font-serif text-2xl hidden md:block">Quizzalo</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/topics">
            <Button variant="outline" className="px-6 py-2.5 text-sm h-11">
              <LayoutGrid className="w-4 h-4" /> Topics
            </Button>
          </Link>
          <Link to="/leaderboard">
            <Button variant="outline" className="px-6 py-2.5 text-sm h-11">
              <Trophy className="w-4 h-4" /> Leaderboard
            </Button>
          </Link>
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl"
      >
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-block px-4 py-1.5 rounded-full bg-[#0B0B0B]/5 text-xs font-bold uppercase tracking-widest mb-6"
        >
          Community Sprint
        </motion.span>
        
        <h1 className="text-8xl md:text-[10rem] font-serif font-black leading-[0.8] mb-12 tracking-tighter">
          Quizzalo
        </h1>
        
        <p className="text-xl md:text-2xl text-[#8C857C] mb-14 max-w-xl mx-auto font-light leading-relaxed">
          A 60-second sprint through Rialo fundamentals.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-32">
          <Button onClick={onStartQuiz} className="w-full sm:w-auto text-xl px-16 py-5">
            Start Quiz
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
          {[
            { icon: BookOpen, title: "1. Pick a topic", text: "Select from the core Rialo modules to test your depth." },
            { icon: Timer, title: "2. 60-second run", text: "Answer 10 questions before the clock hits zero." },
            { icon: Trophy, title: "3. Get ranked", text: "Submit your best time and score to the global list." }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + (i * 0.1) }}
              className="bg-white/40 backdrop-blur-sm p-8 rounded-[2rem] border border-white/40 shadow-sm relative group"
            >
              <item.icon className="w-6 h-6 mb-4 opacity-40 group-hover:opacity-100 transition-opacity" />
              <h3 className="text-xl font-medium mb-2">{item.title}</h3>
              <p className="text-[#8C857C] font-light leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;