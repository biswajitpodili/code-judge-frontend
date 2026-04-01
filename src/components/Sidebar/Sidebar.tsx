import { useRef, useEffect } from "react";
import { useProblem } from "../../context/ProblemContext";
import { HiX, HiCheckCircle } from "react-icons/hi";
import { LANGUAGE_LABELS } from "../CodeEditor";
import { useAuth } from "../../context/AuthContext";

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  sidebarView: "problems" | "submissions";
  setSidebarView: (view: "problems" | "submissions") => void;
}

const Sidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  sidebarView,
  setSidebarView,
}: SidebarProps) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { problems, submissions, activeProblem, setActiveProblem } =
    useProblem();
  const { user } = useAuth();

  const sortedProblems = problems
    .sort((a, b) => Number(b.problemId) - Number(a.problemId))
    .reverse();

  console.log(activeProblem);

  const sortedSubmissions = submissions
    .filter((data) => {
      return (
        data.problemId === activeProblem?.problemId &&
        data?.submissionType === "submit"
      );
    })
    .reverse();

  useEffect(() => {
    // Only add the event listener if the sidebar is open
    if (!isSidebarOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click was on the backdrop element specifically
      const target = event.target as HTMLElement;
      if (target.classList.contains("sidebar-backdrop")) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen, setIsSidebarOpen]);

  const userSubmissions = submissions.filter((submission) => {
    return (
      submission.userId === user?.userId &&
      submission.submissionType === "submit"
    );
  });

  console.log("User Submission", userSubmissions);

  const finalProblems = sortedProblems.map((problem) => {
    const isSolved = userSubmissions.some(
      (submission) =>
        submission.isAccepted && submission.problemId === problem.problemId
    );

    return {
      ...problem,
      isSolved,
    };
  });

  console.log("Final Problems", finalProblems);

  return (
    <>
      {/* Backdrop with fade transition */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 sidebar-backdrop transition-opacity duration-300 ease-in-out ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Sidebar with slide transition */}
      <div
        ref={sidebarRef}
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-80 bg-[#1e1e1e] border-r border-[#313131] z-50 transition-all duration-300 ease-in-out transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button */}
        <button
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-[#333333] text-gray-400 hover:text-white transition-colors"
          onClick={() => setIsSidebarOpen(false)}
        >
          <HiX size={20} />
        </button>

        {/* Sidebar content */}
        <div className="h-full pt-2">
          {sidebarView === "problems" ? (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-[#313131]">
                <h2 className="text-lg font-semibold text-white">Problems</h2>
              </div>
              <div className="flex-1 overflow-y-auto">
                {finalProblems.map((problem) => (
                  <div
                    key={problem?.problemId}
                    className={`p-4 border-b flex justify-between border-[#313131] cursor-pointer hover:bg-[#252525] hover:bg-opacity-50 transition-colors ${
                      activeProblem?.problemId === problem?.problemId
                        ? "bg-[#252525] bg-opacity-50"
                        : ""
                    }`}
                    onClick={() => {
                      setActiveProblem(problem);
                      setIsSidebarOpen(false);
                    }}
                  >
                    <h3 className="font-medium text-white">
                      {problem?.problemId}. {problem?.problemName}
                    </h3>

                    {problem?.isSolved && (
                      <span className="text-gray-400 text-sm">
                        <HiCheckCircle className="w-6 h-6 text-green-500" />
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-[#313131]">
                <h2 className="text-lg font-semibold text-white">
                  Submissions
                </h2>
                <button
                  onClick={() => setSidebarView("problems")}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  Back to Problems
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {sortedSubmissions.length === 0 ? (
                  <div className="p-4 text-center text-gray-400">
                    No submissions yet
                  </div>
                ) : (
                  sortedSubmissions.map((submission) => (
                    <div
                      key={submission.submissionId}
                      className="p-4 border-b border-[#313131] hover:bg-[#252525] transition-colors"
                    >
                      <div className="flex justify-between">
                        <span
                          className={
                            submission.isAccepted
                              ? "text-green-500"
                              : "text-red-500"
                          }
                        >
                          {submission.isAccepted ? "Accepted" : "Wrong Answer"}
                        </span>
                        <span className="text-gray-400 text-sm">
                          {new Date(submission.submissionTime).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-300 mt-1">
                        Language:{" "}
                        {
                          LANGUAGE_LABELS[
                            submission.language as keyof typeof LANGUAGE_LABELS
                          ]
                        }
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
