import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bet, CoinSide } from "@/lib/store";

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  bet: Bet;
  onResolve: (id: string, winner: string) => void;
  currentUser: string;
}

const GameModal = ({
  isOpen,
  onClose,
  bet,
  onResolve,
  currentUser,
}: GameModalProps) => {
  const [flipping, setFlipping] = useState(false);
  const [result, setResult] = useState<"heads" | "tails" | null>(null);
  const [winner, setWinner] = useState<string | null>(null);

  const handleCoinFlip = () => {
    // Only allow opponent to flip the coin, and only if game not played
    if (currentUser !== bet.opponent || !bet.creatorChoice || bet.gamePlayed) {
      return;
    }

    setFlipping(true);
    setResult(null);
    setWinner(null);

    setTimeout(() => {
      const flipResult = Math.random() < 0.5 ? "heads" : "tails";
      setResult(flipResult);

      // Determine winner based on creator's choice and result
      const winnerName =
        flipResult === bet.creatorChoice ? bet.creator : bet.opponent;
      setWinner(winnerName || null);
      setFlipping(false);

      // Update bet with game result and winner
      if (bet._id && winnerName) {
        fetch(`/api/bets/${bet._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gamePlayed: true,
            status: "resolved",
            winner: winnerName,
          }),
        });
        // Optimistically update bet object so UI reflects winner instantly
        bet.winner = winnerName;
        bet.gamePlayed = true;
      }
    }, 2000); // Simulate flip duration
  };

  const handleResolveBet = () => {
    if (bet._id && winner) {
      onResolve(bet._id, winner);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-card-light dark:bg-card-dark rounded-lg p-8 w-full max-w-md shadow-xl relative"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
              Play Game: {bet.title}
            </h2>
            <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
              Pick heads or tails, then flip to decide the winner.
            </p>

            {bet.creator === currentUser && (
              <div className="mb-4 text-center">
                <p className="text-lg mb-2">Your Choice:</p>
                <p className="text-xl font-bold text-blue-600">
                  {bet.creatorChoice?.toUpperCase()}
                </p>
              </div>
            )}
            {bet.opponent === currentUser && !bet.gamePlayed && (
              <div className="mb-4 text-center">
                <p className="text-lg">Click the coin to flip!</p>
              </div>
            )}

            <div className="flex flex-col items-center justify-center mb-6">
              <div
                className={`coin ${flipping ? "flipping" : ""} ${result || ""}`}
                onClick={handleCoinFlip}
              >
                <div className="side heads">🪙 H</div>
                <div className="side tails">🪙 T</div>
              </div>
              {result && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-xl font-semibold text-primary-light dark:text-primary-dark"
                >
                  Result: {result.toUpperCase()}
                </motion.p>
              )}
              {winner && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-lg text-green-600 dark:text-green-400"
                >
                  Winner: {winner}
                </motion.p>
              )}
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-4 py-2 rounded-md bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleResolveBet}
                disabled={!winner || flipping}
                className="px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 disabled:opacity-50 transition-colors"
              >
                Resolve Bet
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GameModal;
