import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative p-3 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 dark:from-indigo-500 dark:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden"
      aria-label="Toggle theme"
    >
      <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 180 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="relative z-10 text-xl"
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </motion.div>
    </motion.button>
  );
};

export default ThemeSwitcher;
