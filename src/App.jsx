import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useStore from './store/useStore';
import Auth from './components/Auth';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import { Store, LogOut } from 'lucide-react';

function Navbar() {
  const { user, logout } = useStore();
  
  if (!user) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-lg border-b border-gray-200 z-50 flex items-center justify-between px-6">
      <div className="flex items-center gap-2 text-primary font-bold text-xl">
        <Store size={24} />
        CoopGrocery
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-600 hidden md:block">
          Welcome, {user.name}
        </span>
        <button 
          onClick={logout}
          className="btn btn-outline text-sm py-1.5 px-3"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </nav>
  );
}

function ProtectedRoute({ children, role }) {
  const user = useStore(state => state.user);
  
  if (!user) return <Navigate to="/" replace />;
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/portal'} replace />;
  }
  
  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen">
      {children}
    </div>
  );
}

function RootRedirect() {
  const user = useStore(state => state.user);
  if (!user) return <Auth />;
  return <Navigate to={user.role === 'admin' ? '/admin' : '/portal'} replace />;
}

export default function App() {
  const init = useStore(state => state.init);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background font-sans text-gray-900 selection:bg-primary/20">
        <Navbar />
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route 
            path="/admin" 
            element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} 
          />
          <Route 
            path="/portal" 
            element={<ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>} 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
