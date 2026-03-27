import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import HeaderComponent from './components/HeaderComponent';
import FooterComponent from './components/FooterComponent';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ListEmployeeComponent from './components/ListEmployeeComponent';
import EmployeeComponent from './components/EmployeeComponent';
import EmployeeProfileComponent from './components/EmployeeProfileComponent';
import DashboardComponent from './components/DashboardComponent';
import AttendanceComponent from './components/AttendanceComponent';

const RootRedirect = () => {
  const { user, isAdmin, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Navigate to="/employees" replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes — all authenticated users */}
          <Route path="/*" element={
            <ProtectedRoute>
              <div className="app-container">
                <HeaderComponent />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<RootRedirect />} />
                    <Route path="/employees" element={<ListEmployeeComponent />} />
                    <Route path="/employees/:id" element={<EmployeeProfileComponent />} />
                    <Route path="/employees/:id/attendance" element={<AttendanceComponent />} />

                    {/* Admin-only routes */}
                    <Route path="/dashboard" element={
                      <ProtectedRoute adminOnly>
                        <DashboardComponent />
                      </ProtectedRoute>
                    } />
                    <Route path="/add-employee" element={
                      <ProtectedRoute adminOnly>
                        <EmployeeComponent />
                      </ProtectedRoute>
                    } />
                    <Route path="/edit-employee/:id" element={
                      <ProtectedRoute adminOnly>
                        <EmployeeComponent />
                      </ProtectedRoute>
                    } />
                  </Routes>
                </main>
                <FooterComponent />
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
