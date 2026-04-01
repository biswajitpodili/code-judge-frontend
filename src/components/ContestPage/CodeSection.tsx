import { useEffect } from "react";
import { CodeEditor, LANGUAGE_LABELS, SupportedLanguage } from "../CodeEditor";
import { FaPlay, FaPaperPlane } from "react-icons/fa";
import { useProblem } from "../../context/ProblemContext";
import { useAuth } from "../../context/AuthContext";

const LANGUAGES: SupportedLanguage[] = ["c", "cpp", "java", "py", "js"];

const CodeSection = () => {
  const {
    activeProblem,
    language,
    setLanguage,
    code,
    setCode,
    customInput,
    setCustomInput,
    runCode,
    submitCode,
    error,
    isAccepted,
    output,
    submissions,
  } = useProblem();

  console.log(activeProblem);

  useEffect(() => {
    setCustomInput(activeProblem?.sampleInput || "");
    setCode(activeProblem?.defaultCode || "");
  }, [activeProblem, setCustomInput, setCode, language]);
  const { user } = useAuth();

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

  console.log("Is Problem Solved", isProblemSolved);

  return (
    <div className="flex flex-col flex-1 h-full bg-[#202020] border-[#3d3d3d] border-2 rounded-lg">
      <div className="w-full bg-[#333333] h-10 flex items-center gap-2 px-4">
        <label className="text-gray-300 text-sm">Select Language:</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
          className="bg-[#202020] text-white border border-[#313131] rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#6d6d6d]"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {LANGUAGE_LABELS[lang as keyof typeof LANGUAGE_LABELS]}
            </option>
          ))}
        </select>
      </div>

      <CodeEditor
        key={`${activeProblem?.problemId}-${language}`}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        initialCode={code[language]}
        language={language}
        onChange={setCode}
      />
      <div className="w-full flex justify-between items-start gap-4 p-4">
        <div className="flex flex-col justify-center gap-2 w-full">
          <label className="text-gray-300 text-sm">Custom Input:</label>
          <textarea
            className="w-full bg-[#202020] text-white border border-[#313131] rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#6d6d6d]"
            value={customInput}
            placeholder="Enter Input"
            rows={3}
            onChange={(e) => setCustomInput(e.target.value)}
          />
          {error && (
            <div className="mt-3 p-3 bg-red-900/70 border border-red-600 rounded-md shadow-md h-30 overflow-y-scroll">
              <div className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-red-300 mr-2 mt-0.5 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="text-red-100 text-sm font-medium whitespace-pre-wrap break-words">
                  {error}
                </div>
              </div>
            </div>
          )}
          {output && (
            <div className="mt-3 p-3 rounded-md shadow-md h-30 overflow-y-scroll">
              <div className="flex items-start">
                <div className="text-green-100 text-sm font-medium whitespace-pre-wrap break-words">
                  Output: {output}
                </div>
              </div>
            </div>
          )}

          {output === "" && isAccepted && (
            <div className="mt-3 p-3 bg-green-900/70 border border-green-600 rounded-md shadow-md h-10 overflow-y-scroll">
              <div className="flex items-start">
                <div className="text-green-100 text-sm font-medium whitespace-pre-wrap break-words">
                  Accepted
                </div>
              </div>
            </div>
          )}

          {!isAccepted && error !== "" && (
            <div className="mt-3 p-3 bg-red-900/70 border border-red-600 rounded-md shadow-md h-10 overflow-y-scroll">
              <div className="flex items-start">
                <div className="text-red-100 text-sm font-medium whitespace-pre-wrap break-words">
                  Rejected: Some test cases failed
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 mt-6">
          <button
            className="flex items-center gap-2 bg-[#1e1e1e] text-[#4ec9b0] hover:bg-[#2d2d2d] border border-[#3d3d3d] rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#4ec9b0] focus:ring-opacity-50 cursor-pointer"
            title="Run code (Ctrl+Enter)"
            onClick={runCode}
          >
            <FaPlay className="text-xs" />
            Run
          </button>
          <button
            className="flex items-center gap-2 bg-[#1e1e1e] text-[#569cd6] hover:bg-[#2d2d2d] border border-[#3d3d3d] rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#569cd6] focus:ring-opacity-50 cursor-pointer"
            title={`Submit code ${isProblemSolved ? "(Already Solved)" : ""}`}
            style={{ cursor: isProblemSolved ? "not-allowed" : "pointer" }}
            onClick={submitCode}
            disabled={isProblemSolved}
          >
            <FaPaperPlane className="text-xs" />
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodeSection;
