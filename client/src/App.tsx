import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import type { UserRole } from "./types";
import Navigation from "./components/Navigation";
import StudentView from "./views/StudentView";
import RoleSelector from "./views/RoleSelector";
import "./App.css";

function AppContent() {
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleRoleSelect = (role: UserRole) => {
    setCurrentRole(role);
    // Navigate to the role-specific route
    navigate(`/${role}`, { replace: true });
  };

  const handleLogout = () => {
    setCurrentRole(null);
    // Navigate back to role selection
    navigate("/role-select", { replace: true });
  };

  // Check if we're on a role-specific route and update the current role accordingly
  useEffect(() => {
    const path = location.pathname;
    if (path === "/student" && currentRole !== "student") {
      setCurrentRole("student");
    }
  }, [location.pathname, currentRole]);

  return (
    <div className="min-h-screen bg-gray-100">
      {currentRole && (
        <Navigation currentRole={currentRole} onLogout={handleLogout} />
      )}
      <main className="container mx-auto px-4">
        <Routes>
          <Route
            path="/"
            element={
              currentRole ? (
                <Navigate to={`/${currentRole}`} replace />
              ) : (
                <Navigate to="/role-select" replace />
              )
            }
          />
          <Route
            path="*"
            element={<Navigate to="/role-select" replace />}
          />
        <Route
          path="/role-select"
          element={<RoleSelector onRoleSelect={handleRoleSelect} />}
        />
        <Route
          path="/student"
          element={
            currentRole === "student" ? (
              <StudentView />
            ) : (
              <Navigate to="/role-select" replace />
            )
          }
        />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;
