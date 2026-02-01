import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { INTRODUCING_RIALO_1, INTRODUCING_RIALO_2, INTRODUCING_RIALO_3 } from '../questions';
import { Question, QuizState, QuizScore } from '../types';
import Button from '../components/Button';
import { Timer as TimerIcon, Trophy, X } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';

const QUIZ_DURATION = 60;
const QUESTIONS_PER_RUN = 10; 

const QuizPage: React.FC<{ playerName: string }> = ({ playerName }) => {
  const { topicId } = useParams();
  const navigate = useNavigate();

  const [state, setState] = useState<QuizState>(QuizState.COUNTDOWN);
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initQuiz = useCallback(() => {
    let pool: Question[] = [];
    if (topicId === 'introducing-rialo-1') pool = [...INTRODUCING_RIALO_1];
    else if (topicId === 'introducing-rialo-2') pool = [...INTRODUCING_RIALO_2];
    else if (topicId === 'introducing-rialo-3') pool = [...INTRODUCING_RIALO_3];
    
    const shuffled = pool.sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, QUESTIONS_PER_RUN));
    setCurrentIndex(0);
    setUserAnswers({});
    setTimeLeft(QUIZ_DURATION);
    setState(QuizState.COUNTDOWN);
    setCountdown(3);
    setScore(0);
  }, [topicId]);

  useEffect(() => { initQuiz(); }, [initQuiz]);

  useEffect(() => {
    if (state === QuizState.COUNTDOWN) {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else setState(QuizState.ACTIVE);
    }
  }, [countdown, state]);

  useEffect(() => {
    if (state === QuizState.ACTIVE) {
      if (timeLeft > 0) {
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
      } else setState(QuizState.FAILED);
    }
  }, [timeLeft, state]);

  const submitFinalScore = async (finalScore: number, remainingTime: number) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (isSupabaseConfigured && supabase) {
      try {
        const topicKey = topicId || 'unknown';
        const scoreData: QuizScore = {
          player_name: playerName,
          topic: topicKey,
          score: finalScore,
          total_questions: QUESTIONS_PER_RUN,
          time_remaining_ms: remainingTime * 1000
        };

        console.log("Submitting score to Supabase...", scoreData);

        // 1. Log the run history
        const { error: scoreError } = await supabase.from('quiz_scores').insert([scoreData]);
        if (scoreError) console.error("Error inserting quiz score:", scoreError);

        // 2. Update player best
        const { data: currentBest, error: fetchError } = await supabase
          .from('player_best')
          .select('*')
          .eq('player_name', playerName)
          .maybeSingle();

        if (fetchError) console.error("Error fetching player best:", fetchError);

        let updatedBestByTopic = currentBest?.best_by_topic || {};
        const prevBestForTopic = updatedBestByTopic[topicKey] || 0;

        // Update if improved or if first time
        if (finalScore > prevBestForTopic || !currentBest) {
          updatedBestByTopic[topicKey] = Math.max(finalScore, prevBestForTopic);
          
          const newTotalPoints = Object.values(updatedBestByTopic).reduce(
            (acc: number, val: any) => acc + (Number(val) || 0), 
            0
          );

          const { error: upsertError } = await supabase.from('player_best').upsert({
            player_name: playerName,
            best_by_topic: updatedBestByTopic,
            total_points: newTotalPoints,
            updated_at: new Date().toISOString()
          }, { onConflict: 'player_name' });

          if (upsertError) {
            console.error("Error upserting player best:", upsertError);
          } else {
            console.log("Leaderboard updated successfully!");
          }
        }
      } catch (err) { 
        console.error("Critical error during score submission:", err); 
      }
    }
    setIsSubmitting(false);
  };

  const handleAnswerSelect = (optionKey: 'A' | 'B' | 'C' | 'D') => {
    if (state !== QuizState.ACTIVE || userAnswers[currentIndex]) return;
    const currentQuestion = questions[currentIndex];
    const isCorrect = optionKey === currentQuestion.answer;
    
    setUserAnswers(prev => ({ ...prev, [currentIndex]: optionKey }));
    
    if (isCorrect) setScore(prev => prev + 1);

    setTimeout(() => {
      if (currentIndex < QUESTIONS_PER_RUN - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        const finalScore = isCorrect ? score + 1 : score;
        setState(QuizState.FINISHED);
        submitFinalScore(finalScore, timeLeft);
      }
    }, 400);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (state !== QuizState.ACTIVE) return;
      const key = e.key.toUpperCase();
      if (['A', 'B', 'C', 'D'].includes(key)) handleAnswerSelect(key as any);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state, currentIndex, userAnswers, score]);

  const currentQuestion = questions[currentIndex];

  if (state === QuizState.COUNTDOWN) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div key={countdown} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.5 }} className="text-9xl font-serif font-black">
            {countdown > 0 ? countdown : "Go!"}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  if (state === QuizState.FAILED) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-12 rounded-[2.5rem] shadow-2xl max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6"><X className="w-10 h-10" /></div>
          <h2 className="text-4xl font-serif font-black mb-4">Time’s Up!</h2>
          <p className="text-[#8C857C] mb-8">The Rialo engine waits for no one. Try to pick up the pace!</p>
          <div className="flex flex-col gap-3">
            <Button onClick={initQuiz} className="w-full">Try Again</Button>
            <Button variant="ghost" onClick={() => navigate('/topics')} className="w-full">Change Topic</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (state === QuizState.FINISHED) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-10 md:p-12 rounded-[2.5rem] shadow-2xl max-w-2xl w-full text-center">
          <div className="w-20 h-20 bg-[#0B0B0B] text-[#E9E1D6] rounded-full flex items-center justify-center mx-auto mb-6"><Trophy className="w-10 h-10" /></div>
          <h2 className="text-5xl font-serif font-black mb-2">Sprint Complete</h2>
          <p className="text-[#8C857C] text-lg mb-10">Your score: <span className="text-[#0B0B0B] font-bold">{score} / {QUESTIONS_PER_RUN}</span></p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={initQuiz} className="flex-1" variant="outline">Try Again</Button>
            <Button onClick={() => navigate('/leaderboard')} className="flex-1">Leaderboard</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-20 flex flex-col items-center max-w-4xl mx-auto">
      <div className="w-full flex items-center justify-between mb-16">
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-widest text-[#8C857C] mb-1">Status</span>
          <span className="text-2xl font-bold">{currentIndex + 1} / {QUESTIONS_PER_RUN}</span>
        </div>
        <div className={`flex flex-col items-end transition-colors ${timeLeft < 10 ? 'text-red-500' : ''}`}>
           <span className="text-xs font-bold uppercase tracking-widest text-[#8C857C] mb-1">Timer</span>
           <div className="flex items-center gap-2">
             <motion.div animate={timeLeft < 10 ? { scale: [1, 1.1, 1] } : {}} transition={{ repeat: Infinity, duration: 1 }}><TimerIcon className="w-5 h-5" /></motion.div>
             <span className="text-3xl font-mono font-black">{timeLeft}s</span>
           </div>
        </div>
      </div>
      <div className="w-full h-2 bg-[#0B0B0B]/5 rounded-full mb-20 overflow-hidden">
        <motion.div className="h-full bg-[#0B0B0B]" initial={{ width: 0 }} animate={{ width: `${((currentIndex + 1) / QUESTIONS_PER_RUN) * 100}%` }} />
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={currentIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full">
          <h2 className="text-3xl md:text-5xl font-serif font-black mb-14 leading-[1.1] tracking-tight">{currentQuestion?.prompt}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {(['A', 'B', 'C', 'D'] as const).map((key) => (
              <button key={key} disabled={!!userAnswers[currentIndex]} onClick={() => handleAnswerSelect(key)} className={`flex items-start gap-4 p-7 rounded-[2rem] text-left transition-all duration-300 ${userAnswers[currentIndex] === key ? 'bg-[#0B0B0B] text-white' : 'bg-white hover:bg-[#F9F6F2]'}`}>
                <span className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg ${userAnswers[currentIndex] === key ? 'bg-white/20' : 'bg-[#E9E1D6]'}`}>{key}</span>
                <span className="font-semibold pt-2 text-xl leading-snug">{currentQuestion?.options[key]}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default QuizPage;
