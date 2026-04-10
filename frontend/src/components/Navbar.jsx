import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiBox, FiLogOut } from 'react-icons/fi';

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/dashboard" className="navbar-brand">
          <FiBox size={22} /> Activity17
        </Link>
        {user && (
          <div className="navbar-links">
            <Link to="/dashboard" className="nav-link">Products</Link>
            <Link to="/profile" className="nav-link">
              {user.profile_picture ? (
                <img src={`${API_BASE}${user.profile_picture}`} alt="" className="nav-avatar" />
              ) : (
                <FiUser size={18} />
              )}
              {user.name}
            </Link>
            <button onClick={handleLogout} className="nav-link btn-link">
              <FiLogOut size={18} /> Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
