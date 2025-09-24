import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

import { CoinSide } from "@/lib/store";

interface CreateBetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string, amount: string, creatorChoice: CoinSide) => void;
}

const CreateBetModal = ({ isOpen, onClose, onCreate }: CreateBetModalProps) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [creatorChoice, setCreatorChoice] = useState<CoinSide>("heads");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && amount) {
      onCreate(title, amount, creatorChoice);
      setTitle("");
      setAmount("");
      setCreatorChoice("heads");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-3xl p-8 w-full max-w-lg shadow-2xl border border-white/20 dark:border-gray-700/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl"
              >
                🎯
              </motion.div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Create New Bet
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Set up your coin flip challenge
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Bet Title */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label htmlFor="title" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Bet Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a catchy bet title..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  required
                />
              </motion.div>

              {/* Amount */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Bet Amount
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-lg font-bold">$</span>
                  </div>
                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                    required
                    min="1"
                    step="0.01"
                  />
                </div>
              </motion.div>

              {/* Coin Choice */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Your Coin Choice
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setCreatorChoice("heads")}
                    className={`relative overflow-hidden p-4 rounded-2xl border-2 transition-all duration-200 ${
                      creatorChoice === "heads"
                        ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-yellow-400 shadow-lg shadow-yellow-400/25"
                        : "bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-600 hover:border-yellow-400 dark:hover:border-yellow-400"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">🪙</div>
                      <div className="font-bold">Heads</div>
                    </div>
                    {creatorChoice === "heads" && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center"
                      >
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      </motion.div>
                    )}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setCreatorChoice("tails")}
                    className={`relative overflow-hidden p-4 rounded-2xl border-2 transition-all duration-200 ${
                      creatorChoice === "tails"
                        ? "bg-gradient-to-r from-gray-400 to-gray-600 text-white border-gray-400 shadow-lg shadow-gray-400/25"
                        : "bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-400"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">🪙</div>
                      <div className="font-bold">Tails</div>
                    </div>
                    {creatorChoice === "tails" && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center"
                      >
                        <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                      </motion.div>
                    )}
                  </motion.button>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex gap-4 pt-4"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:from-blue-600 hover:to-purple-700"
                >
                  🚀 Create Bet
                </motion.button>
              </motion.div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateBetModal;
