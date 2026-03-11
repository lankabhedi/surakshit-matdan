import { Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import VoterDashboard from './pages/VoterDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Vote from './pages/Vote';
import Results from './pages/Results';
import VotedModal from './components/VotedModal';

function ProtectedRoute({ children, requireAdmin = false }: { 
  children: React.ReactNode; 
  requireAdmin?: boolean;
}) {
  const { isAuthenticated, user } = useStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  const showVotedModal = useStore(state => state.showVotedModal);
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <VoterDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/vote/:electionId" 
          element={
            <ProtectedRoute>
              <Vote />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/results" 
          element={
            <ProtectedRoute>
              <Results />
            </ProtectedRoute>
          } 
        />
      </Routes>
      {showVotedModal && <VotedModal />}
    </>
  );
}

export default App;
