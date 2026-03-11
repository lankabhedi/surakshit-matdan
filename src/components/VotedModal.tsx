import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Download, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Link } from 'react-router-dom';

export default function VotedModal() {
  const { setShowVotedModal, votes } = useStore();
  const latestVote = votes[votes.length - 1];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowVotedModal(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, [setShowVotedModal]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowVotedModal(false)}
        />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
        >
          <button
            onClick={() => setShowVotedModal(false)}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>

          <div className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-accent-500/30"
            >
              <CheckCircle2 className="w-12 h-12 text-white" />
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-slate-900 mb-2"
            >
              Vote Cast Successfully!
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-slate-600 mb-6"
            >
              Your vote has been recorded on the blockchain and cannot be altered.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-slate-50 rounded-xl p-4 mb-6 text-left"
            >
              <p className="text-xs text-slate-500 mb-1">Transaction Hash</p>
              <p className="text-sm font-mono text-slate-700 break-all">
                {latestVote?.transactionHash || 'Pending...'}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col gap-3"
            >
              <Link
                to="/results"
                onClick={() => setShowVotedModal(false)}
                className="btn-primary w-full"
              >
                View Live Results
              </Link>
              <button
                onClick={() => {
                  if (latestVote?.transactionHash) {
                    navigator.clipboard.writeText(latestVote.transactionHash);
                  }
                }}
                className="btn-secondary w-full"
              >
                <Download size={20} />
                Copy Receipt
              </button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
