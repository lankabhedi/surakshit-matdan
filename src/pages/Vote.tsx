import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Loader2, 
  ArrowLeft, 
  Vote as VoteIcon,
  AlertTriangle
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { blockchainService } from '../utils/blockchain';

export default function Vote() {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const { currentElection, user, addVote, setUser, updateElection } = useStore();
  
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [voting, setVoting] = useState(false);
  const [, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [, setTxHash] = useState('');

  const election = currentElection || useStore(state => state.elections.find(e => e.id === electionId));

  const handleVote = async () => {
    if (!selectedCandidate || !election || !user) return;
    
    setVoting(true);
    setError('');

    try {
      await blockchainService.connect();

      const hash = await blockchainService.castVote(parseInt(selectedCandidate));
      
      const newVote = {
        id: String(Date.now()),
        electionId: election.id,
        voterId: user.id,
        candidateId: selectedCandidate,
        timestamp: new Date(),
        transactionHash: hash,
      };
      
      // Update election votes
      const updatedCandidates = election.candidates.map(c => 
        c.id === selectedCandidate 
          ? { ...c, votes: c.votes + 1 }
          : c
      );
      
      updateElection(election.id, { 
        candidates: updatedCandidates,
        totalVotes: election.totalVotes + 1
      });
      
      addVote(newVote);
      setTxHash(hash);
      setUser({ ...user, hasVoted: true });
      setSuccess(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cast vote';
      setError(errorMessage);
    }
    
    setVoting(false);
  };

  if (!election) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Election not found</h2>
          <Link to="/dashboard" className="text-primary-600 hover:text-primary-700">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800">Surakshit Matdan</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className="max-w-2xl mx-auto">
          {/* Election Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 mb-8 text-white"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                Active
              </span>
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            </div>
            <h1 className="text-2xl font-bold mb-2">{election.title}</h1>
            <p className="text-primary-100">{election.description}</p>
          </motion.div>

          {/* Candidates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6"
          >
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800">Select Your Candidate</h2>
              <p className="text-slate-500 text-sm mt-1">Choose one candidate to vote for</p>
            </div>
            
            <div className="divide-y divide-slate-100">
              {election.candidates.map((candidate, index) => (
                <motion.label
                  key={candidate.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className={`p-6 flex items-center gap-4 cursor-pointer transition-all duration-200 ${
                    selectedCandidate === candidate.id
                      ? 'bg-primary-50'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="candidate"
                    value={candidate.id}
                    checked={selectedCandidate === candidate.id}
                    onChange={() => setSelectedCandidate(candidate.id)}
                    className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                  />
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center text-3xl">
                    {candidate.symbol || '🗳️'}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800">{candidate.name}</h3>
                    <p className="text-primary-600 font-medium">{candidate.party}</p>
                    <p className="text-slate-500 text-sm mt-1">{candidate.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-800">
                      {election.totalVotes > 0 
                        ? Math.round((candidate.votes / election.totalVotes) * 100)
                        : 0}%
                    </p>
                    <p className="text-slate-500 text-xs">{candidate.votes} votes</p>
                  </div>
                </motion.label>
              ))}
            </div>
          </motion.div>

          {/* Warning */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
              >
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-700">Error</p>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Vote Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
          >
            <div>
              <p className="text-slate-500 text-sm">Your vote will be recorded on the blockchain</p>
              <p className="text-slate-400 text-xs mt-1">Cannot be changed after submission</p>
            </div>
            <button
              onClick={handleVote}
              disabled={!selectedCandidate || voting}
              className="btn-primary flex items-center gap-2"
            >
              {voting ? (
                <>
                  <Loader2 className="animate-spin" />
                  Casting Vote...
                </>
              ) : (
                <>
                  <VoteIcon className="w-5 h-5" />
                  Cast Vote
                </>
              )}
            </button>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
