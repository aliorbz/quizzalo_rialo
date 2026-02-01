import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import HomePage from './pages/HomePage';
import TopicsPage from './pages/TopicsPage';
import QuizPage from './pages/QuizPage';
import LeaderboardPage from './pages/LeaderboardPage';
import BlobBackground from './components/BlobBackground';
import NameModal from './components/NameModal';

const App: React.FC = () => {
  const [playerName, setPlayerName] = useState<string | null>(
    localStorage.getItem('quizzalo_player_name')
  );
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [pendingTopicId, setPendingTopicId] = useState<string | null>(null);

  const handleNameSubmit = (name: string) => {
    const trimmed = name.trim();
    localStorage.setItem('quizzalo_player_name', trimmed);
    setPlayerName(trimmed);
    setIsNameModalOpen(false);
  };

  const startQuizFlow = (topicId?: string) => {
    if (topicId) setPendingTopicId(topicId);
    setIsNameModalOpen(true);
  };

  return (
    <Router>
      <div className="relative min-h-screen text-[#0B0B0B] bg-[#E9E1D6] flex flex-col">
        <BlobBackground />
        
        <main className="relative z-10 flex-grow pb-24 sm:pb-32">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={
                <HomePage onStartQuiz={() => startQuizFlow()} />
              } />
              <Route path="/topics" element={
                <TopicsPage 
                  playerName={playerName} 
                  onRequireName={(tid) => startQuizFlow(tid)} 
                />
              } />
              <Route path="/quiz/:topicId" element={
                playerName ? <QuizPage playerName={playerName} /> : <Navigate to="/topics" replace />
              } />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
            </Routes>
          </AnimatePresence>
        </main>

        <AnimatePresence>
          {isNameModalOpen && (
            <NameModal 
              isOpen={isNameModalOpen} 
              onClose={() => setIsNameModalOpen(false)} 
              onSubmit={handleNameSubmit}
              targetTopicId={pendingTopicId}
            />
          )}
        </AnimatePresence>

        <footer className="fixed bottom-0 left-0 right-0 z-30 pb-6 pt-10 flex items-center justify-center gap-3 pointer-events-none bg-gradient-to-t from-[#E9E1D6] via-[#E9E1D6]/90 to-transparent">
          <img 
            src="https://pbs.twimg.com/profile_images/1801955577763094529/5qtIvl5X_400x400.jpg" 
            alt="" 
            className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-[#0B0B0B]/10"
          />
          <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-bold opacity-60">
            Build by{' '}
            <motion.a 
              href="https://x.com/aliorbz" 
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, color: '#0B0B0B', opacity: 1 }}
              className="underline decoration-[#0B0B0B]/20 pointer-events-auto"
            >
              aliorbz
            </motion.a>
          </span>
        </footer>
      </div>
    </Router>
  );
};

export default App;