import { BiEdit } from "react-icons/bi";
import { TfiReload } from "react-icons/tfi";
import { HiCheckCircle } from "react-icons/hi";
import { useProblem } from "../../context/ProblemContext";
import MarkdownIt from "markdown-it";

import "./style.css";
import { useAuth } from "../../context/AuthContext";

interface ProblemStatementProps {
  setSidebarOpen: (open: boolean) => void;
  activeProblem: {
    problemId: string;
    problemName: string;
    problemStatement: string;
    sampleInput: string;
    sampleOutput: string;
  };
  setSidebarView: (view: "problems" | "submissions") => void;
}

const ProblemStatement = ({
  setSidebarOpen,
  activeProblem,
  setSidebarView,
}: ProblemStatementProps) => {
  const { submissions } = useProblem();
  const { user } = useAuth();

  const handleShowSubmissions = () => {
    setSidebarView("submissions");
    setSidebarOpen(true);
  };

  const handleShowProblems = () => {
    setSidebarView("problems");
    setSidebarOpen(true);
  };

  // Check if the current problem has been solved
  const userSubmissions = submissions.filter((submission) => {
    return (
      submission.userId === user?.userId &&
      submission.submissionType === "submit"
    );
  });

  console.log("User Submission", userSubmissions);

  const isProblemSolved = userSubmissions.some((submission) => {
    return (
      submission.isAccepted && submission.problemId === activeProblem?.problemId
    );
  });

  // Initialize markdown-it
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
  });

  // Render markdown to HTML, ensuring input is a string
  const renderMarkdown = (
    content: string | undefined | null
  ): { __html: string } => {
    // Ensure content is a string
    const markdownContent = typeof content === "string" ? content : "";

    try {
      return { __html: md.render(markdownContent) };
    } catch (error) {
      console.error("Error rendering markdown:", error);
      return { __html: "<p>Error rendering content</p>" };
    }
  };

  return (
    <div className="flex flex-col h-full w-[40%] bg-[#202020] border-[#3d3d3d] border-2 rounded-lg">
      <div className="w-full bg-[#333333] h-10 flex items-center px-4">
        <button
          className="flex items-center gap-1 hover:bg-[#2d2d2d] px-2 rounded-md cursor-pointer py-2 text-sm font-medium transition-colors duration-200 focus:outline-none"
          onClick={handleShowProblems}
        >
          <BiEdit />
          Change Question
        </button>
        <span className="text-gray-400 w-[2px] h-4 mx-2 bg-gray-400 rounded-full"></span>
        <button
          className="flex items-center gap-1 hover:bg-[#2d2d2d] px-2 rounded-md cursor-pointer py-2 text-sm font-medium transition-colors duration-200 focus:outline-none"
          onClick={handleShowSubmissions}
        >
          <TfiReload />
          Submissions
        </button>
      </div>
      <div className="p-4 flex flex-col gap-4 overflow-y-auto">
        <h1 className="text-3xl font-bold text-white flex items-center justify-between gap-2">
          {activeProblem?.problemId}. {activeProblem?.problemName}
          {/* Checkmark with transition */}
          <div
            className={`transition-all duration-300 ease-in-out transform ${
              isProblemSolved ? "opacity-100 scale-100" : "opacity-0 scale-0"
            }`}
          >
            <HiCheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </h1>

        {/* Problem Statement with markdown rendering */}
        <div
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={renderMarkdown(
            activeProblem?.problemStatement
          )}
        />

        <h2 className="text-lg font-bold text-white mt-2">Sample Input</h2>
        <div className="flex flex-col gap-2">
          <pre className="bg-[#282828] p-3 rounded-md text-gray-300 overflow-x-auto whitespace-pre-wrap">
            {activeProblem?.sampleInput || ""}
          </pre>
        </div>
        <h2 className="text-lg font-bold text-white mt-2">Sample Output</h2>
        <div className="flex flex-col gap-2">
          <pre className="bg-[#282828] p-3 rounded-md text-gray-300 overflow-x-auto whitespace-pre-wrap">
            {activeProblem?.sampleOutput || ""}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ProblemStatement;
