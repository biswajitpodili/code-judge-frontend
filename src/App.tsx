import "./App.css";

import { BrowserRouter } from "react-router";
import AppRoutes from "./AppRoutes";
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import { TimerProvider } from './context/TimerContext';
import LoginModal from './components/LoginModal';

// Wrapper component to conditionally render LoginModal
const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const leaderboard = window.location.pathname === "/leaderboard";
  return (
    <>
      {!isAuthenticated && !leaderboard && <LoginModal />}
      <AppRoutes />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <TimerProvider>
          <AppContent />
        </TimerProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
