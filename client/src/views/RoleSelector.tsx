import React from "react";
import { Link } from "react-router-dom";
import type { UserRole } from "../types";

interface RoleSelectorProps {
  onRoleSelect: (role: UserRole) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ onRoleSelect }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-8">
          AI Tutor Platform
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Select your role to continue:
        </p>

        <div className="space-y-4">
          <button
            onClick={() => onRoleSelect("student")}
            className="w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
          >
            <span className="mr-2">👨‍🎓</span>
            Student
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Or use direct links:</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link to="/student" className="text-green-600 hover:underline">
              Student
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;
