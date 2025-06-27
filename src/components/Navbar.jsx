import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-sm py-4 px-6 flex justify-between items-center relative">
      <div>
        <Link to="/" className="text-xl font-bold text-gray-800">
          🍽️ RestoReserve
        </Link>
      </div>

      {user && (
        <div className="absolute left-1/2 transform -translate-x-1/2 text-indigo-600 font-serif text-lg">
          Welcome, {user.name || user.email}
        </div>
      )}

      <div className="flex items-center space-x-4">
        {user && (
          <Link
            to="/"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Home
          </Link>
        )}

        {user ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
