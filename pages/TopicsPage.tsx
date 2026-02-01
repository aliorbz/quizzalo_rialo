import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, Book, ArrowLeft, ExternalLink } from 'lucide-react';
import Button from '../components/Button';

interface TopicsPageProps {
  playerName: string | null;
  onRequireName: (topicId: string) => void;
}

const topics = [
  { id: 'introducing-rialo-1', title: 'Introducing Rialo I', description: 'Master the vision, blockchain history, and the foundational Rialo approach.', unlocked: true },
  { id: 'introducing-rialo-2', title: 'Introducing Rialo II', description: 'Deep dive into performance, architectural primitives, and usability.', unlocked: true },
  { id: 'introducing-rialo-3', title: 'Introducing Rialo III', description: 'The developer vision, supermodularity, and real-world connectivity.', unlocked: true },
  { id: 'supermodularity', title: 'Deep Tech', description: 'Advanced engine architecture and execution.', unlocked: false },
];

const TopicsPage: React.FC<TopicsPageProps> = ({ playerName, onRequireName }) => {
  const navigate = useNavigate();

  const handleTopicClick = (topic: any) => {
    if (!topic.unlocked) return;
    if (!playerName) {
      onRequireName(topic.id);
    } else {
      navigate(`/quiz/${topic.id}`);
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 pt-24 sm:pt-32 pb-20 flex flex-col items-center relative">
      <div className="absolute top-6 sm:top-10 left-4 sm:left-10">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="px-3 sm:px-5 py-2 group text-sm"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> <span>Back</span>
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl text-center mb-10 sm:mb-16"
      >
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-black mb-3 sm:mb-4">Choose a topic</h1>
        <p className="text-[#8C857C] text-base sm:text-lg px-4">Pick a module to start your 60-second sprint.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 w-full max-w-6xl">
        {topics.map((topic, i) => (
          <TopicCard 
            key={topic.id} 
            topic={topic} 
            index={i} 
            onClick={() => handleTopicClick(topic)} 
          />
        ))}
      </div>
    </div>
  );
};

const TopicCard: React.FC<{ topic: any, index: number, onClick: () => void }> = ({ topic, index, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={topic.unlocked ? { y: -8 } : {}}
      onClick={onClick}
      className={`group relative h-full flex flex-col p-6 sm:p-8 md:p-10 rounded-[1.5rem] sm:rounded-[2.5rem] transition-all duration-500 overflow-hidden ${
        topic.unlocked 
          ? 'bg-white cursor-pointer shadow-xl shadow-[#0B0B0B]/5 hover:shadow-2xl' 
          : 'bg-[#E9E1D6]/50 border border-[#0B0B0B]/5 cursor-not-allowed grayscale'
      }`}
    >
      <img 
        src="https://pbs.twimg.com/profile_images/1950265537784926208/qbjSWMDP_400x400.jpg" 
        alt="" 
        className="absolute top-4 sm:top-6 right-4 sm:right-6 w-8 h-8 sm:w-10 sm:h-10 rounded-xl opacity-10 group-hover:opacity-20 transition-opacity grayscale"
      />

      <div className="mb-6 sm:mb-8">
        {topic.unlocked ? (
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#0B0B0B] rounded-xl sm:rounded-2xl flex items-center justify-center text-white">
            <Book className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        ) : (
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#8C857C]/20 rounded-xl sm:rounded-2xl flex items-center justify-center text-[#8C857C]">
            <Lock className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        )}
      </div>

      <h3 className={`text-xl sm:text-2xl font-bold mb-2 sm:mb-3 ${!topic.unlocked && 'opacity-50'}`}>
        {topic.title}
      </h3>
      <p className={`text-sm sm:text-base text-[#8C857C] font-light flex-grow leading-relaxed ${!topic.unlocked && 'opacity-50'}`}>
        {topic.description}
      </p>

      {topic.unlocked ? (
        <div className="mt-6 sm:mt-8 flex items-center justify-between">
          <div className="flex items-center gap-2 group-hover:translate-x-2 transition-transform">
             <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#0B0B0B]">Start Sprint</span>
             <ArrowRight className="w-4 h-4" />
          </div>
          
          {topic.id.startsWith('introducing-rialo') && (
            <a 
              href="https://www.rialo.io/posts/introducing-rialo" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-2.5 sm:p-3 bg-[#0B0B0B]/5 hover:bg-[#0B0B0B] text-[#0B0B0B] hover:text-white rounded-lg sm:rounded-xl transition-all relative group/study"
            >
              <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <div className="absolute bottom-full mb-2 right-0 bg-[#0B0B0B] text-white text-[10px] py-1 px-3 rounded whitespace-nowrap opacity-0 group-hover/study:opacity-100 transition-opacity pointer-events-none">
                Study this Topic
              </div>
            </a>
          )}
        </div>
      ) : (
        <div className="mt-6 sm:mt-8">
          <span className="text-[10px] sm:text-sm font-bold uppercase tracking-widest text-[#8C857C]/50">COMING SOON</span>
        </div>
      )}
    </motion.div>
  );
};

export default TopicsPage;