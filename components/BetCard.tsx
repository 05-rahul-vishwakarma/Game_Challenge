import { Bet, BetStatus } from "@/lib/store";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

interface BetCardProps {
  bet: Bet;
  onAccept: (id: string, opponent: string) => void;
  onResolve: (id: string, winner: string) => void;
  onPlayGame: (bet: Bet) => void;
  currentUser: string;
}

const statusStyles: { [key in BetStatus]: { border: string; bg: string } } = {
  open: { border: "border-blue-500", bg: "bg-blue-500/10" },
  accepted: { border: "border-yellow-500", bg: "bg-yellow-500/10" },
  resolved: { border: "border-green-500", bg: "bg-green-500/10" },
};

const BetCard = ({
  bet,
  onAccept,
  onResolve,
  onPlayGame,
  currentUser,
}: BetCardProps) => {
  const handleAccept = () => {
    if (!currentUser) {
      toast.error("Please set your name before accepting a bet.");
      return;
    }
    if (currentUser && currentUser !== bet.creator && bet._id) {
      onAccept(bet._id, currentUser);
    }
  };

  const handleResolve = (winner: string) => {
    if (!currentUser) {
      toast.error("Please set your name before resolving a bet.");
      return;
    }
    if (currentUser && currentUser === bet.creator && bet._id) {
      onResolve(bet._id, winner);
    }
  };

  const handlePlayGame = () => {
    if (!currentUser) {
      toast.error("Please set your name before playing a game.");
      return;
    }
    onPlayGame(bet);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`group relative w-full p-6 rounded-2xl shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border ${
        statusStyles[bet.status].border
      } hover:shadow-2xl transition-all duration-300 overflow-hidden`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="w-full h-full bg-gradient-to-br from-current to-transparent"></div>
      </div>
      
      {/* Glow Effect */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${statusStyles[bet.status].bg} blur-xl`}></div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 leading-tight">
              {bet.title}
            </h2>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mt-2"
            />
          </div>
          <div className="flex flex-col items-end space-y-2">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              bet.status === 'open' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
              bet.status === 'accepted' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
              'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
            } shadow-sm`}>
              {bet.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Amount Display */}
        <div className="flex items-center justify-center py-4 mb-6">
          <div className="relative">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl p-4 shadow-lg"
            >
              <div className="text-center">
                <div className="text-sm font-medium text-white/80 mb-1">Bet Amount</div>
                <div className="text-3xl md:text-4xl font-bold text-white">
                  ${bet.amount}
                </div>
              </div>
            </motion.div>
            <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl blur opacity-30"></div>
          </div>
        </div>

        {/* Player Information */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {bet.creator[0]?.toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Creator</div>
              <div className="font-semibold text-gray-800 dark:text-gray-200">{bet.creator}</div>
              {bet.creatorChoice && (
                <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  Chose: {bet.creatorChoice} ⚡
                </div>
              )}
            </div>
          </div>

          {bet.opponent && (
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {bet.opponent[0]?.toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Opponent</div>
                <div className="font-semibold text-gray-800 dark:text-gray-200">{bet.opponent}</div>
              </div>
            </div>
          )}

          {bet.winner && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl border border-green-200 dark:border-green-700"
            >
              <div className="text-2xl">🏆</div>
              <div className="flex-1">
                <div className="text-sm font-medium text-green-600 dark:text-green-400">Winner</div>
                <div className="font-bold text-green-700 dark:text-green-300">{bet.winner}</div>
              </div>
            </motion.div>
          )}

          {bet.gamePlayed && !bet.winner && (
            <motion.div 
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center space-x-3 p-3 bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 rounded-xl border border-orange-200 dark:border-orange-700"
            >
              <div className="text-2xl animate-spin">⏳</div>
              <div className="flex-1">
                <div className="text-sm font-medium text-orange-600 dark:text-orange-400">Status</div>
                <div className="font-semibold text-orange-700 dark:text-orange-300">Game completed, awaiting resolution...</div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {bet.status === "open" && currentUser !== bet.creator && (
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAccept}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:from-blue-600 hover:to-purple-700"
            >
              🎯 Accept Bet
            </motion.button>
          )}
          
          {bet.status === "accepted" && !bet.gamePlayed && currentUser === bet.opponent && (
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePlayGame}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:from-purple-600 hover:to-pink-700"
            >
              🎮 Play Game
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BetCard;
