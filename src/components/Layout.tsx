import { Outlet, Link, useNavigate ,useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Layout = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
 const location = useLocation();
  const handleLogout = async () => {
    await logout();
    navigate("/medicines"); // Redirect to login page
  };

  const isLoginPage = location.pathname === '/login';

  return (
    <div className="app-container">
      <header className="app-header">
  <div className="container header-container">
    {/* Empty placeholder to balance nav width */}
    <div className="header-side-placeholder" />

    <Link to="/" className="app-logo">
      <img
        src="/rams-logo.png"
        alt="Medicine Keeper"
        className="logo-img"
      />
    </Link>

    <nav className="app-nav">
      {isAuthenticated ? (
        <div className="user-controls flex items-center gap-4">
          <span className="welcome-message">
            Welcome,  {isAdmin && 'Admin'}
          </span>
          <button
            onClick={handleLogout}
            className="btn btn-secondary logout-btn"
          >
            Logout
          </button>
        </div>
      ) : (
        !isLoginPage && (
          <Link to="/login" className="btn btn-primary login-nav-btn">
            Admin Login
          </Link>
        )
      )}
    </nav>
  </div>
</header>

      
      <main className="app-main">
        <Outlet />
      </main>
      
      <footer className="app-footer">
        <div className="container">
          <p>© {new Date().getFullYear()} RAMS App</p>
        </div>
      </footer>
    </div>
  );
};
