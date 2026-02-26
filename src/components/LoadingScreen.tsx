import { motion } from 'motion/react';
import { Store } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-purple-600 z-[100] flex flex-col items-center justify-center text-white">
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ 
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="bg-white p-6 rounded-3xl shadow-xl mb-8"
      >
        <Store className="w-16 h-16 text-purple-600" />
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-black uppercase tracking-widest mb-2"
      >
        Sayonako
      </motion.h1>
      
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -10, 0],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2
            }}
            className="w-3 h-3 bg-white rounded-full"
          />
        ))}
      </div>
    </div>
  );
}
