import ProblemStatement from "./ProblemStatement";
import CodeSection from "./CodeSection";
import { useEffect } from "react";

import { useProblem } from "../../context/ProblemContext";
import { useTimer } from "../../context/TimerContext";
import Sidebar from "../Sidebar/Sidebar";

const ContestPage = () => {
  const {
    activeProblem,
    isSidebarOpen,
    setIsSidebarOpen,
    sidebarView,
    setSidebarView,
  } = useProblem();

  const { isRunning, startTimer } = useTimer();

  // Start timer if it's not already running
  useEffect(() => {
    if (!isRunning) {
      startTimer();
    }
  }, [isRunning, startTimer]);

  return (
    <div className="h-[calc(100vh-4rem)] relative">
      {/* Sidebar */}

      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        sidebarView={sidebarView}
        setSidebarView={setSidebarView}
      />

      <div className="h-full flex items-center justify-between p-3 gap-3">
        {/* Problem Statement */}
        <ProblemStatement
          setSidebarOpen={() => setIsSidebarOpen(true)}
          activeProblem={activeProblem}
          setSidebarView={setSidebarView}
        />

        {/* Code Editor */}
        <CodeSection />
      </div>
    </div>
  );
};

export default ContestPage;
