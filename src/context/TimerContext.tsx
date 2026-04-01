import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router";

interface TimerContextType {
  timeRemaining: number; // in seconds
  isRunning: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  formatTime: () => string;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

// const TIMER_DURATION = Math.floor((new Date(1741501325000).getTime() - new Date().getTime()) / 1000); // Time remaining in seconds
const TIMER_DURATION = 60 * 60;
const TIMER_STORAGE_KEY = "contest_timer";

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [timeRemaining, setTimeRemaining] = useState<number>(TIMER_DURATION);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isTimerComplete, setIsTimerComplete] = useState<boolean>(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Load saved timer state on mount
  useEffect(() => {
    const savedTimer = localStorage.getItem(TIMER_STORAGE_KEY);
    if (savedTimer) {
      try {
        const timerData = JSON.parse(savedTimer);
        const {
          endTime,
          timeRemaining: savedTimeRemaining,
          isRunning: wasRunning,
        } = timerData;

        if (wasRunning) {
          // Calculate remaining time if timer was running
          const now = Date.now();
          const remaining = Math.max(0, Math.floor((endTime - now) / 1000));

          if (remaining > 0) {
            setTimeRemaining(remaining);
            setIsRunning(true);
          } else {
            // Timer already expired
            setTimeRemaining(0);
            setIsTimerComplete(true);
          }
        } else {
          // Timer was paused
          setTimeRemaining(savedTimeRemaining);
        }
      } catch (error) {
        console.error("Error parsing saved timer:", error);
        localStorage.removeItem(TIMER_STORAGE_KEY);
      }
    }
  }, []);

  // Timer countdown effect
  useEffect(() => {
    let interval: number | undefined;

    if (isRunning && timeRemaining > 0) {
      interval = window.setInterval(() => {
        setTimeRemaining((prevTime) => {
          const newTime = prevTime - 1;

          // Save current timer state
          const endTime = Date.now() + newTime * 1000;
          localStorage.setItem(
            TIMER_STORAGE_KEY,
            JSON.stringify({
              endTime,
              timeRemaining: newTime,
              isRunning: true,
            })
          );

          return newTime;
        });
      }, 1000);
    } else if (timeRemaining === 0 && isRunning) {
      setIsRunning(false);
      setIsTimerComplete(true);
      localStorage.removeItem(TIMER_STORAGE_KEY);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeRemaining]);

  // Show completion modal and logout when timer completes
  useEffect(() => {
    // Define stopTimer function reference to avoid dependency cycle
    const handleStopTimer = () => {
      setIsRunning(false);
      setTimeRemaining(TIMER_DURATION);
      setIsTimerComplete(false);
      localStorage.removeItem(TIMER_STORAGE_KEY);
    };

    if (isTimerComplete) {
      // Show completion modal
      const modal = document.createElement("div");
      modal.className = "fixed inset-0 flex items-center justify-center z-50";
      modal.innerHTML = `
        <div class="absolute inset-0 bg-black/70 backdrop-blur-md"></div>
        <div class="bg-[#1e1e1e] rounded-lg p-8 shadow-xl w-full max-w-md z-10 relative border border-gray-700">
          <div class="flex flex-col items-center">
            <div class="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-white mb-2 text-center">Time's Up!</h2>
            <div class="w-16 h-1 bg-green-500 rounded mb-4"></div>
            <p class="text-gray-300 text-center mb-6">
              Thank you for participating in the contest. Your answers have been submitted.
            </p>
            <div class="flex flex-col w-full gap-3">
              <button id="leaderboard-btn" class="w-full py-3 rounded-md font-medium bg-blue-500 hover:bg-blue-600 text-white transition-colors flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                View Leaderboard
              </button>
              <button id="logout-btn" class="w-full py-3 rounded-md font-medium bg-gray-600 hover:bg-gray-700 text-white transition-colors flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      // Add event listener to leaderboard button
      document.getElementById('leaderboard-btn')?.addEventListener('click', () => {
        document.body.removeChild(modal);
        handleStopTimer();
        navigate('/leaderboard');
      });
      
      // Add event listener to logout button
      document.getElementById('logout-btn')?.addEventListener('click', () => {
        document.body.removeChild(modal);
        logout();
        handleStopTimer();
        navigate('/');
      });
      
      // Auto logout after 10 seconds
      setTimeout(() => {
        if (document.body.contains(modal)) {
          document.body.removeChild(modal);
          logout();
          handleStopTimer();
          navigate('/');
        }
      }, 10000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimerComplete, logout, navigate, TIMER_DURATION]);

  const startTimer = () => {
    if (timeRemaining > 0) {
      setIsRunning(true);

      // Save current timer state with end time
      const endTime = Date.now() + timeRemaining * 1000;
      localStorage.setItem(
        TIMER_STORAGE_KEY,
        JSON.stringify({
          endTime,
          timeRemaining,
          isRunning: true,
        })
      );
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);

    // Save current timer state as paused
    localStorage.setItem(
      TIMER_STORAGE_KEY,
      JSON.stringify({
        endTime: null,
        timeRemaining,
        isRunning: false,
      })
    );
  };

  // New function to completely stop the timer
  const stopTimer = () => {
    setIsRunning(false);
    setTimeRemaining(TIMER_DURATION);
    setIsTimerComplete(false);
    localStorage.removeItem(TIMER_STORAGE_KEY);
  };

  const resetTimer = () => {
    setTimeRemaining(TIMER_DURATION);
    setIsRunning(false);
    localStorage.removeItem(TIMER_STORAGE_KEY);
  };

  const formatTime = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <TimerContext.Provider
      value={{
        timeRemaining,
        isRunning,
        startTimer,
        pauseTimer,
        stopTimer,
        resetTimer,
        formatTime,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTimer() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error("useTimer must be used within a TimerProvider");
  }
  return context;
}
