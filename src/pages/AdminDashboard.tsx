import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  LogOut, 
  Plus, 
  Users, 
  BarChart3, 
  Settings, 
  Loader2, 
  Trash2, 
  Edit,
  Play,
  Pause,
  X,
  Calendar
} from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Election, Candidate } from '../types';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout, elections, updateElection } = useStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedElection, setSelectedElection] = useState<Election | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleToggleElection = (electionId: string, isActive: boolean) => {
    updateElection(electionId, { isActive: !isActive });
  };

  const totalVoters = 1250;
  const activeCount = elections.filter(e => e.isActive).length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800">Surakshit Matdan</span>
              <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-lg">
                Admin
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="btn-ghost">
                Voter View
              </Link>
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
            <p className="text-slate-500 mt-1">Manage elections and monitor voting activity</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            <Plus size={20} />
            Create Election
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: BarChart3, label: 'Total Elections', value: elections.length, color: 'from-blue-500 to-blue-600' },
            { icon: Users, label: 'Registered Voters', value: totalVoters, color: 'from-emerald-500 to-emerald-600' },
            { icon: Play, label: 'Active Elections', value: activeCount, color: 'from-amber-500 to-amber-600' },
            { icon: Settings, label: 'System Status', value: 'Online', color: 'from-violet-500 to-violet-600' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
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

        {/* Elections Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
        >
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Elections Management</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-slate-600">Election</th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-600">Candidates</th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-600">Votes</th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-600">Status</th>
                  <th className="text-right px-6 py-4 font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {elections.map((election) => (
                  <tr key={election.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-slate-800">{election.title}</p>
                        <p className="text-sm text-slate-500">{election.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex -space-x-2">
                        {election.candidates.slice(0, 3).map((c) => (
                          <div 
                            key={c.id} 
                            className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-sm border-2 border-white"
                            title={c.name}
                          >
                            {c.symbol || '🗳️'}
                          </div>
                        ))}
                        {election.candidates.length > 3 && (
                          <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-xs text-slate-500 border-2 border-white">
                            +{election.candidates.length - 3}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-800">{election.totalVotes.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                        election.isActive 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {election.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleElection(election.id, election.isActive)}
                          className={`p-2 rounded-lg transition-colors ${
                            election.isActive
                              ? 'text-amber-600 hover:bg-amber-50'
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={election.isActive ? 'End Election' : 'Start Election'}
                        >
                          {election.isActive ? <Pause size={18} /> : <Play size={18} />}
                        </button>
                        <button 
                          onClick={() => setSelectedElection(election)}
                          className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          <BarChart3 size={18} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                          <Edit size={18} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateElectionModal onClose={() => setShowCreateModal(false)} />
        )}
      </AnimatePresence>

      {/* Results Modal */}
      <AnimatePresence>
        {selectedElection && (
          <ElectionResultsModal 
            election={selectedElection} 
            onClose={() => setSelectedElection(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CreateElectionModal({ onClose }: { onClose: () => void }) {
  const { setElections, elections } = useStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    candidates: [{ name: '', party: '', symbol: '🗳️', description: '' }],
  });

  const addCandidate = () => {
    setFormData({
      ...formData,
      candidates: [...formData.candidates, { name: '', party: '', symbol: '🗳️', description: '' }],
    });
  };

  const updateCandidate = (index: number, field: keyof Candidate, value: string) => {
    const updated = [...formData.candidates];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, candidates: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 800));

    const newElection: Election = {
      id: String(Date.now()),
      title: formData.title,
      description: formData.description,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      isActive: false,
      isPublished: true,
      totalVotes: 0,
      candidates: formData.candidates.map((c, i) => ({
        ...c,
        id: String(i + 1),
        votes: 0,
      })),
    };

    setElections([...elections, newElection]);
    setLoading(false);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Create New Election</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Election Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-field"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field"
              rows={2}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Calendar size={16} className="inline mr-1" />
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Calendar size={16} className="inline mr-1" />
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="input-field"
                required
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-medium text-slate-700">Candidates</label>
              <button
                type="button"
                onClick={addCandidate}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                + Add Candidate
              </button>
            </div>
            <div className="space-y-4">
              {formData.candidates.map((candidate, idx) => (
                <div key={idx} className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl">
                  <input
                    type="text"
                    placeholder="Candidate Name"
                    value={candidate.name}
                    onChange={(e) => updateCandidate(idx, 'name', e.target.value)}
                    className="input-field"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Party Name"
                    value={candidate.party}
                    onChange={(e) => updateCandidate(idx, 'party', e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading && <Loader2 className="animate-spin" />}
              Create Election
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function ElectionResultsModal({ election, onClose }: { election: Election; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative bg-white rounded-2xl max-w-lg w-full"
      >
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Live Results</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <h3 className="font-bold text-slate-800 mb-4">{election.title}</h3>
          
          <div className="space-y-4">
            {election.candidates
              .sort((a, b) => b.votes - a.votes)
              .map((candidate) => {
                const percentage = election.totalVotes > 0 
                  ? Math.round((candidate.votes / election.totalVotes) * 100)
                  : 0;
                const isLeading = candidate.votes === Math.max(...election.candidates.map(c => c.votes));
                
                return (
                  <div key={candidate.id}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{candidate.symbol}</span>
                        <div>
                          <p className="font-semibold text-slate-800">{candidate.name}</p>
                          <p className="text-xs text-slate-500">{candidate.party}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-800">{candidate.votes}</p>
                        <p className="text-xs text-slate-500">{percentage}%</p>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${isLeading ? 'bg-gradient-to-r from-primary-500 to-accent-500' : 'bg-slate-300'}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
          
          <div className="mt-6 pt-4 border-t border-slate-200">
            <p className="text-center text-slate-500">
              Total Votes: <span className="font-bold text-slate-800">{election.totalVotes.toLocaleString()}</span>
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
