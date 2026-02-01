import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import { PlayerBest } from '../types';
import { Medal, AlertCircle, LayoutGrid, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const MAX_TOTAL_POINTS = 30; // 3 topics * 10 points

const LeaderboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [topPlayers, setTopPlayers] = useState<PlayerBest[]>([]);
  const [myBest, setMyBest] = useState<PlayerBest | null>(null);
  const [myRank, setMyRank] = useState<number | null>(null);

  const playerName = localStorage.getItem('quizzalo_player_name');

  useEffect(() => {
    const fetchData = async () => {
      if (!isSupabaseConfigured || !supabase) {
        setLoading(false);
        return;
      }

      try {
        // Fetch top 10 ranked by total points, then by earliest update (tie-breaker)
        const { data: top } = await supabase
          .from('player_best')
          .select('*')
          .order('total_points', { ascending: false })
          .order('updated_at', { ascending: true })
          .limit(10);

        setTopPlayers(top || []);

        if (playerName) {
          const { data: mine } = await supabase
            .from('player_best')
            .select('*')
            .eq('player_name', playerName)
            .single();

          if (mine) {
            setMyBest(mine);
            const { count } = await supabase
              .from('player_best')
              .select('*', { count: 'exact', head: true })
              .or(`total_points.gt.${mine.total_points},and(total_points.eq.${mine.total_points},updated_at.lt.${mine.updated_at})`);
            
            setMyRank((count || 0) + 1);
          }
        }
      } catch (err) {
        console.error("Error fetching leaderboard", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [playerName]);

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen px-6 py-20 flex flex-col items-center justify-center">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl text-center max-w-lg">
          <AlertCircle className="w-12 h-12 text-[#8C857C] mx-auto mb-6 opacity-30" />
          <h2 className="text-3xl font-serif mb-4">Leaderboard Unavailable</h2>
          <p className="text-[#8C857C] mb-8">Supabase configuration keys are missing. Connect your Supabase instance to enable global rankings.</p>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-20 flex flex-col items-center relative">
      {/* Top Navigation Header */}
      <header className="absolute top-0 left-0 right-0 p-6 md:p-10 flex items-center justify-end z-20">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="outline" className="px-6 py-2.5 text-sm h-11">
              <Home className="w-4 h-4" /> Home
            </Button>
          </Link>
          <Link to="/topics">
            <Button variant="outline" className="px-6 py-2.5 text-sm h-11">
              <LayoutGrid className="w-4 h-4" /> Topics
            </Button>
          </Link>
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl text-center mb-16 pt-12 md:pt-16"
      >
        <h1 className="text-6xl md:text-7xl font-serif font-black mb-4">Hall of Fame</h1>
        <p className="text-[#8C857C] text-lg">The world's best Rialo fundamentalists.</p>
      </motion.div>

      <div className="w-full max-w-4xl flex flex-col gap-6">
        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0B0B0B]/5">
                <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-[#8C857C]">Rank</th>
                <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-[#8C857C]">Name</th>
                <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-[#8C857C] text-right">Points / {MAX_TOTAL_POINTS}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={3} className="px-8 py-6 border-b border-[#0B0B0B]/5 h-20">
                      <div className="w-full h-4 bg-[#0B0B0B]/5 rounded-full" />
                    </td>
                  </tr>
                ))
              ) : topPlayers.length > 0 ? (
                topPlayers.map((player, i) => (
                  <tr 
                    key={player.player_name} 
                    className={`group transition-colors ${player.player_name === playerName ? 'bg-[#0B0B0B]/5' : 'hover:bg-[#0B0B0B]/5'}`}
                  >
                    <td className="px-8 py-6 border-b border-[#0B0B0B]/5">
                      <div className="flex items-center gap-3">
                        {i === 0 && <Medal className="w-5 h-5 text-yellow-500" />}
                        {i === 1 && <Medal className="w-5 h-5 text-slate-400" />}
                        {i === 2 && <Medal className="w-5 h-5 text-amber-700" />}
                        {i > 2 && <span className="font-mono text-[#8C857C]">#{i + 1}</span>}
                      </div>
                    </td>
                    <td className="px-8 py-6 border-b border-[#0B0B0B]/5 font-medium">
                      {player.player_name}
                      {player.player_name === playerName && <span className="ml-2 text-[10px] bg-[#0B0B0B] text-white px-2 py-0.5 rounded-full uppercase tracking-tighter">You</span>}
                    </td>
                    <td className="px-8 py-6 border-b border-[#0B0B0B]/5 text-right font-mono font-bold text-xl">
                      {player.total_points}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-8 py-20 text-center text-[#8C857C]">
                    No scores recorded yet. Be the first!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {playerName && myBest && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0B0B0B] text-[#E9E1D6] p-8 rounded-[2.5rem] flex items-center justify-between shadow-2xl"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-widest opacity-50 mb-1">Your Personal Best</p>
              <h4 className="text-2xl font-serif">Global Rank #{myRank || '-'}</h4>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold uppercase tracking-widest opacity-50 mb-1">Total Score</p>
              <p className="text-4xl font-mono font-bold">{myBest.total_points} <span className="text-sm opacity-40">/ {MAX_TOTAL_POINTS}</span></p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;