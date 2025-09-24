import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bet, CoinSide } from "@/lib/store";
import Navbar from "@/components/Navbar";
import BetCard from "@/components/BetCard";
import CreateBetModal from "@/components/CreateBetModal";
import GameModal from "@/components/GameModal"; // Added
import io, { Socket } from "socket.io-client";
import toast from "react-hot-toast";

let socket: Socket;

export default function Home() {
  const [bets, setBets] = useState<Bet[]>([]);
  const [currentUser, setCurrentUser] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userName") || "";
    }
    return "";
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [selectedBet, setSelectedBet] = useState<Bet | null>(null);
  const socketInitialized = useRef(false);

  useEffect(() => {
    const fetchBets = async () => {
      const res = await fetch("/api/bets");
      const data = await res.json();
      setBets(data);
    };
    fetchBets();
  }, []);

  useEffect(() => {
    if (socketInitialized.current) return;
    socketInitialized.current = true;
    socketInitializer();
    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  const socketInitializer = async () => {
    await fetch("/api/socket");
    if (!socket) {
      socket = io({ path: "/api/socket" });
    }

    socket.on("connect", () => {
      console.log("connected");
    });

    socket.off("bet:created");
    socket.on("bet:created", (newBet) => {
      setBets((prevBets) => {
        if (prevBets.some((b) => b._id === newBet._id)) return prevBets;
        return [newBet, ...prevBets];
      });
    });

    socket.off("bet:updated");
    socket.on("bet:updated", (updatedBet) => {
      setBets((prevBets) =>
        prevBets.map((bet) => (bet._id === updatedBet._id ? updatedBet : bet))
      );
    });

    socket.off("bet:deleted");
    socket.on("bet:deleted", (deletedBetId) => {
      setBets((prevBets) => prevBets.filter((bet) => bet._id !== deletedBetId));
    });
  };

  const handleCreateBet = async (
    title: string,
    amount: string,
    creatorChoice: CoinSide
  ) => {
    if (!currentUser) {
      toast.error("Please set your name before creating a bet.");
      return;
    }

    try {
      const res = await fetch("/api/bets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          amount,
          creator: currentUser,
          creatorChoice,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create bet");
      }

      // The server will broadcast the new bet, so we don't need to add it manually
      toast.success("Bet created successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create bet. Please try again.");
    }
  };

  const handlePlayGame = (bet: Bet) => {
    setSelectedBet(bet);
    setIsGameModalOpen(true);
  };

  const handleAcceptBet = async (id: string, opponent: string) => {
    await fetch(`/api/bets/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "accepted", opponent }),
    });
  };

  const handleResolveBet = async (id: string, winner: string) => {
    await fetch(`/api/bets/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "resolved", winner }),
    });
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark relative overflow-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative py-8 md:py-12"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20" />
        <div className="relative max-w-7xl mx-auto px-4 md:px-8">
          {/* User Profile Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-white/20 dark:border-gray-700/50"
          >
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 flex-1">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {currentUser ? currentUser[0]?.toUpperCase() : '?'}
                  </div>
                  <div>
                    <label htmlFor="user" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Your Name
                    </label>
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        id="user"
                        value={currentUser}
                        onChange={(e) => setCurrentUser(e.target.value)}
                        placeholder="Enter your name..."
                        className="px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (currentUser.trim()) {
                            localStorage.setItem("userName", currentUser);
                            toast.success("Name saved successfully!");
                          }
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:from-green-600 hover:to-emerald-700"
                      >
                        Save
                      </motion.button>
                    </div>
                  </div>
                </div>
                
                {currentUser && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">Active Player</span>
                  </motion.div>
                )}
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsModalOpen(true)}
                className="w-full lg:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:from-blue-600 hover:to-purple-700 group"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>Create New Bet</span>
                  <motion.span
                    className="text-xl"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    🎯
                  </motion.span>
                </span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <main className="max-w-7xl mx-auto px-4 md:px-8 pb-12">

        {/* Betting Sections */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Open Bets */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                <span>🎯</span>
                <span>Open Bets</span>
                <span className="bg-white/20 px-2 py-1 rounded-full text-sm">
                  {bets.filter((bet) => bet.status === "open").length}
                </span>
              </h2>
              <p className="text-blue-100 mt-1">Available bets to accept</p>
            </div>
            <div className="p-6 max-h-[600px] overflow-y-auto space-y-4">
              <AnimatePresence>
                {bets
                  .filter((bet) => bet.status === "open")
                  .map((bet, index) => (
                    <motion.div
                      key={bet._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <BetCard
                        bet={bet}
                        onAccept={handleAcceptBet}
                        onResolve={handleResolveBet}
                        onPlayGame={() => handlePlayGame(bet)}
                        currentUser={currentUser}
                      />
                    </motion.div>
                  ))}
              </AnimatePresence>
              {bets.filter((bet) => bet.status === "open").length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <div className="text-4xl mb-2">🎲</div>
                  <p>No open bets available</p>
                  <p className="text-sm">Be the first to create one!</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Accepted Bets */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                <span>⚡</span>
                <span>Active Bets</span>
                <span className="bg-white/20 px-2 py-1 rounded-full text-sm">
                  {bets.filter((bet) => bet.status === "accepted").length}
                </span>
              </h2>
              <p className="text-yellow-100 mt-1">Bets in progress</p>
            </div>
            <div className="p-6 max-h-[600px] overflow-y-auto space-y-4">
              <AnimatePresence>
                {bets
                  .filter((bet) => bet.status === "accepted")
                  .map((bet, index) => (
                    <motion.div
                      key={bet._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <BetCard
                        bet={bet}
                        onAccept={handleAcceptBet}
                        onResolve={handleResolveBet}
                        onPlayGame={() => handlePlayGame(bet)}
                        currentUser={currentUser}
                      />
                    </motion.div>
                  ))}
              </AnimatePresence>
              {bets.filter((bet) => bet.status === "accepted").length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <div className="text-4xl mb-2">⏳</div>
                  <p>No active bets</p>
                  <p className="text-sm">Accept a bet to get started!</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Resolved Bets */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                <span>🏆</span>
                <span>Completed</span>
                <span className="bg-white/20 px-2 py-1 rounded-full text-sm">
                  {bets.filter((bet) => bet.status === "resolved").length}
                </span>
              </h2>
              <p className="text-green-100 mt-1">Finished bets</p>
            </div>
            <div className="p-6 max-h-[600px] overflow-y-auto space-y-4">
              <AnimatePresence>
                {bets
                  .filter((bet) => bet.status === "resolved")
                  .map((bet, index) => (
                    <motion.div
                      key={bet._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <BetCard
                        bet={bet}
                        onAccept={handleAcceptBet}
                        onResolve={handleResolveBet}
                        onPlayGame={() => handlePlayGame(bet)}
                        currentUser={currentUser}
                      />
                    </motion.div>
                  ))}
              </AnimatePresence>
              {bets.filter((bet) => bet.status === "resolved").length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <div className="text-4xl mb-2">📋</div>
                  <p>No completed bets</p>
                  <p className="text-sm">Results will appear here</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>

      <CreateBetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateBet}
      />

      {selectedBet && (
        <GameModal
          isOpen={isGameModalOpen}
          onClose={() => setIsGameModalOpen(false)}
          bet={selectedBet}
          onResolve={handleResolveBet}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}
