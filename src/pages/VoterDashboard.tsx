import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, 
  LogOut, 
  Vote, 
  BarChart3, 
  ChevronRight, 
  Loader2,
  Calendar,
  Users,
  Clock
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { MOCK_ELECTIONS } from '../data/mockData';
import type { Election } from '../types';

export default function VoterDashboard() {
  const navigate = useNavigate();
  const { user, logout, setElections, setCurrentElection } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setElections(MOCK_ELECTIONS);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [setElections]);

  const elections = useStore(state => state.elections);
  const activeElections = elections.filter(e => e.isActive);
  const upcomingElections = elections.filter(e => !e.isActive);
  const votes = useStore(state => state.votes);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleVote = (election: Election) => {
    setCurrentElection(election);
    navigate(`/vote/${election.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
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
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-slate-800">{user?.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 mb-8 text-white"
        >
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-primary-100">Your voice matters. Participate in the democratic process.</p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { 
              icon: Vote, 
              label: 'Your Votes', 
              value: votes.length.toString(), 
              color: 'from-blue-500 to-blue-600' 
            },
            { 
              icon: Calendar, 
              label: 'Active Elections', 
              value: activeElections.length.toString(), 
              color: 'from-emerald-500 to-emerald-600' 
            },
            { 
              icon: Users, 
              label: 'Total Elections', 
              value: elections.length.toString(), 
              color: 'from-violet-500 to-violet-600' 
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
              <p className="text-slate-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Active Elections */}
        {activeElections.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800">Active Elections</h2>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full">
                Live Now
              </span>
            </div>
            <div className="grid gap-4">
              {activeElections.map((election, index) => (
                <motion.div
                  key={election.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card-hover p-6 cursor-pointer group"
                  onClick={() => handleVote(election)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-slate-800 group-hover:text-primary-600 transition-colors">
                          {election.title}
                        </h3>
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      </div>
                      <p className="text-slate-500 text-sm mb-4">{election.description}</p>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Users size={16} />
                          {election.candidates.length} candidates
                        </span>
                        <span className="flex items-center gap-1">
                          <Vote size={16} />
                          {election.totalVotes.toLocaleString()} votes
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-primary-600 font-medium group-hover:translate-x-1 transition-transform">
                      Vote Now
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Elections */}
        {upcomingElections.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800">Upcoming Elections</h2>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 text-sm font-medium rounded-full">
                Coming Soon
              </span>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {upcomingElections.map((election, index) => (
                <motion.div
                  key={election.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
                >
                  <h3 className="font-bold text-slate-800 mb-2">{election.title}</h3>
                  <p className="text-slate-500 text-sm mb-4">{election.description}</p>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock size={16} />
                    Starts: {election.startDate.toLocaleDateString('en-IN', { 
                      day: 'numeric', 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            to="/results"
            className="card-hover p-6 flex items-center gap-4 group"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">View Live Results</h3>
              <p className="text-slate-500 text-sm">See real-time election results</p>
            </div>
          </Link>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Verification Status</h3>
              <p className="text-slate-500 text-sm">
                {user?.isVerified ? (
                  <span className="text-emerald-600 font-medium">Verified Voter</span>
                ) : (
                  <span className="text-amber-600 font-medium">Pending Verification</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
