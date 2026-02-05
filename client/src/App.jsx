import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm';
import SuccessPage from './components/SuccessPage';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Profile from './components/Profile';
import WorkerDashboard from './components/dashboards/WorkerDashboard';
import ManagerDashboard from './components/dashboards/ManagerDashboard';
import AdminDashboard from './components/dashboards/AdminDashboard';
import GrievanceForm from './components/GrievanceForm';
import ManagerGrievanceView from './components/ManagerGrievanceView';
import WorkerGrievanceView from './components/WorkerGrievanceView';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import './App.css';

import { FiShield } from 'react-icons/fi';

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLanding = location.pathname === '/';
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  const token = localStorage.getItem('token');
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;
  const isLoggedIn = !!token && !!user;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="App">
      {!isLanding && (
        <header>
          <h1 onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiShield style={{ fontSize: '1.2em', color: 'var(--primary-color)' }} />
            SafeHands
          </h1>
          {isLoggedIn && !isAuthPage ? (
            <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <button
                onClick={() => {
                  if (user?.role === 'worker') navigate('/dashboard/worker');
                  else if (user?.role === 'manager') navigate('/dashboard/manager');
                  else if (user?.role === 'admin') navigate('/dashboard/admin');
                  else navigate('/');
                }}
                className="nav-item-btn"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="nav-item-btn"
              >
                My Profile
              </button>
              <button
                onClick={handleLogout}
                className="btn-primary"
                style={{ padding: '0.6rem 1.5rem', borderRadius: '99px', width: 'auto' }}
              >
                Logout
              </button>
            </nav>
          ) : (
            <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Migrant Worker Welfare Portal</p>
          )}
        </header>
      )}
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          {/* Public Routes - Only accessible if NOT logged in */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Registration is accessible to both guests and logged-in managers */}
          <Route path="/register" element={<RegistrationForm />} />

          {/* Protected Routes - Only accessible if logged in */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/file-grievance" element={<GrievanceForm />} />
          </Route>

          {/* Role-based Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['worker']} />}>
            <Route path="/dashboard/worker" element={<WorkerDashboard />} />
            <Route path="/worker/grievances" element={<WorkerGrievanceView />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['manager']} />}>
            <Route path="/dashboard/manager" element={<ManagerDashboard />} />
            <Route path="/manager/grievances" element={<ManagerGrievanceView />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isLanding && (
        <footer>
          <p>&copy; {new Date().getFullYear()} SafeHands Initiative • Government of India</p>
        </footer>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
