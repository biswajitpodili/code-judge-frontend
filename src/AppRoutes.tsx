import { Routes, Route, Navigate } from "react-router";
import RulesAndRegulations from "./components/RulesAndRegulations";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import LoginModal from "./components/LoginModal";
import HomeLayout from "./layout/HomeLayout";
import ContestPage from "./components/ContestPage";
import StopTimerFunction from "./components/test/StopTimerFunction";
import LeaderBoard from "./components/LeaderBoard";

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Root route - show login or redirect to rules */}
      <Route path="/" element={isAuthenticated && <Navigate to="/rules" />} />

      <Route path="/" element={<HomeLayout />}>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/rules" />
            ) : (
              <div className="h-screen w-full flex items-center justify-center bg-[#121212]">
                <LoginModal />
              </div>
            )
          }
        />
        <Route
          path="/rules"
          element={
            <ProtectedRoute>
              <RulesAndRegulations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contest"
          element={
            <ProtectedRoute>
              <ContestPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Leaderboard route - unprotected */}
      <Route path="/leaderboard" element={<LeaderBoard />} />

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" />} />

      <Route path="/stop-timer" element={<StopTimerFunction />} />
    </Routes>
  );
};

export default AppRoutes;
