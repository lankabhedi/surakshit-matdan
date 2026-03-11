import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, BarChart3, CheckCircle2 } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Results() {
  const elections = useStore(state => state.elections);
  const [selectedElection, setSelectedElection] = useState(elections[0]?.id || '');

  const currentElection = elections.find(e => e.id === selectedElection) || elections[0];

  const getWinner = (election: typeof elections[0]) => {
    if (!election || election.candidates.length === 0) return null;
    return election.candidates.reduce((prev, current) => 
      prev.votes > current.votes ? prev : current
    );
  };

  const winner = getWinner(currentElection);

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
            <div className="flex items-center gap-4">
              <span className="text-slate-500 text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Live Results
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        {/* Back Button */}
        <Link 
          to="/dashboard" 
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Live Election Results</h1>
          <p className="text-slate-500">Real-time results powered by blockchain technology</p>
        </motion.div>

        {/* Election Selector */}
        {elections.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <select
              value={selectedElection}
              onChange={(e) => setSelectedElection(e.target.value)}
              className="input-field max-w-md"
            >
              {elections.map(election => (
                <option key={election.id} value={election.id}>
                  {election.title}
                </option>
              ))}
            </select>
          </motion.div>
        )}

        {currentElection && (
          <>
            {/* Election Info Card */}
            <motion.div
              key={currentElection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 mb-8 text-white"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">{currentElection.title}</h2>
                <span className={`px-4 py-1 rounded-full text-sm font-medium ${
                  currentElection.isActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-slate-800 text-slate-300'
                }`}>
                  {currentElection.isActive ? 'Active' : 'Completed'}
                </span>
              </div>
              <p className="text-primary-100 mb-6">{currentElection.description}</p>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold">{currentElection.candidates.length}</p>
                  <p className="text-primary-200 text-sm">Candidates</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold">{currentElection.totalVotes.toLocaleString()}</p>
                  <p className="text-primary-200 text-sm">Total Votes</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold flex items-center justify-center gap-2">
                    {winner ? (
                      <>
                        <span>{winner.symbol}</span>
                        <span className="text-lg">{winner.name.split(' ')[0]}</span>
                      </>
                    ) : (
                      '-'
                    )}
                  </p>
                  <p className="text-primary-200 text-sm">Leading</p>
                </div>
              </div>
            </motion.div>

            {/* Candidates Results */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-xl font-bold text-slate-800">Candidate Performance</h3>
              </div>
              
              <div className="p-6 space-y-6">
                {currentElection.candidates
                  .sort((a, b) => b.votes - a.votes)
                  .map((candidate, idx) => {
                    const percentage = currentElection.totalVotes > 0 
                      ? Math.round((candidate.votes / currentElection.totalVotes) * 100)
                      : 0;
                    
                    const isWinner = winner?.id === candidate.id && currentElection.totalVotes > 0;
                    const isRunnerUp = idx === 1 && currentElection.totalVotes > 0;
                    
                    return (
                      <motion.div
                        key={candidate.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + idx * 0.1 }}
                        className={`relative p-6 rounded-2xl ${
                          isWinner 
                            ? 'bg-gradient-to-r from-emerald-50 to-accent-50 border-2 border-emerald-200' 
                            : isRunnerUp
                              ? 'bg-slate-50 border border-slate-200'
                              : 'bg-white border border-slate-100'
                        }`}
                      >
                        {/* Rank Badge */}
                        <div className="absolute -top-3 -left-2 w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                          {idx + 1}
                        </div>
                        
                        {isWinner && (
                          <div className="absolute -top-3 -right-2 px-3 py-1 bg-gradient-to-r from-emerald-500 to-accent-500 rounded-full text-white text-xs font-semibold flex items-center gap-1 shadow-lg">
                            <CheckCircle2 size={12} />
                            Leading
                          </div>
                        )}

                        <div className="flex items-start gap-4">
                          {/* Symbol */}
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${
                            isWinner 
                              ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' 
                              : 'bg-slate-100'
                          }`}>
                            {candidate.symbol || '🗳️'}
                          </div>
                          
                          {/* Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-slate-800 text-lg">{candidate.name}</h4>
                              {isWinner && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                            </div>
                            <p className="text-primary-600 font-medium mb-3">{candidate.party}</p>
                            <p className="text-slate-500 text-sm mb-4">{candidate.description}</p>
                            
                            {/* Progress Bar */}
                            <div className="relative">
                              <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentage}%` }}
                                  transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                                  className={`h-full rounded-full ${
                                    isWinner 
                                      ? 'bg-gradient-to-r from-emerald-500 to-accent-500' 
                                      : 'bg-gradient-to-r from-primary-500 to-primary-600'
                                  }`}
                                />
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-slate-500 text-sm">
                                {candidate.votes.toLocaleString()} votes
                              </p>
                              <p className="font-bold text-slate-800">{percentage}%</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            </motion.div>
          </>
        )}

        {/* Empty State */}
        {elections.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No Elections Yet</h3>
            <p className="text-slate-500 mb-6">There are no elections available at the moment.</p>
            <Link to="/dashboard" className="btn-primary">
              Return to Dashboard
            </Link>
          </motion.div>
        )}
      </main>
    </div>
  );
}
