import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function DashboardHeader({ title }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center bg-amber-100 p-4 rounded-lg shadow mb-6">
      <h1 className="text-xl font-semibold text-amber-700">{title}</h1>
      <div className="flex items-center gap-4">
        <span className="text-gray-600 text-sm">Hi, {user?.name}</span>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
