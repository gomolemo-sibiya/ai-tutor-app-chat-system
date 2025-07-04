import React from "react";
import { Link, useLocation } from "react-router-dom";
import type { UserRole } from "../types";

interface NavigationProps {
  currentRole: UserRole;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentRole, onLogout }) => {
  const location = useLocation();

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case "student":
        return "Student";
      default:
        return "";
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case "student":
        return "bg-green-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <nav className={`${getRoleColor(currentRole)} text-white shadow-lg`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <Link
              to={`/${currentRole}`}
              className="text-xl font-bold hover:opacity-80 transition-opacity"
            >
              AI Tutor Platform
            </Link>
            <span className="text-sm opacity-75">
              ({getRoleDisplayName(currentRole)} View)
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <span className="opacity-75">Switch to:</span>

              {currentRole !== "student" && (
                <Link
                  to="/student"
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 px-2 py-1 rounded transition-colors"
                >
                  Student
                </Link>
              )}
            </div>
            <button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
