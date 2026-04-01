import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { SupportedLanguage } from "../components/CodeEditor";
import api from "../api/axios";
import { defaultCode } from "../assets/default_code";

interface Problem {
  problemId: string;
  problemName: string;
  problemStatement: string;
  sampleInput: string;
  sampleOutput: string;
  defaultCode: string;
  isSolved?: boolean;
}

// const data: Problem[] = [
//   {
//     problemId: 1,
//     problemName: "Find the second largest element in the array",
//     problemStatement:
//       "Given an array of integers, find the second largest element in the array. The array will have at least two elements. The array will be sorted in ascending order.",
//     inputFormat:
//       "The first line of the input contains an integer N, the size of the array.",
//     outputFormat:
//       "The second line of the input contains N space-separated integers.",
//     constraints: "1 <= N <= 10^5",
//     sampleInput: "5 1 2 3 4 5",
//     sampleOutput: "4",
//     defaultCode: "",
//   },
//   {
//     problemId: 2,
//     problemName: "Fibonacci Series",
//     problemStatement:
//       "Given an integer N, print the first N Fibonacci numbers.",
//     inputFormat: "Integer N",
//     outputFormat: "First N Fibonacci numbers",
//     constraints: "1 <= N <= 10^5",
//     sampleInput: "5",
//     sampleOutput: "0 1 1 2 3",
//     defaultCode: "",
//   },
//   {
//     problemId: 3,
//     problemName: "Reverse the array",
//     problemStatement: "Given an array of integers, reverse the array.",
//     inputFormat: "Integer N",
//     outputFormat: "Reversed array",
//     constraints: "1 <= N <= 10^5",
//     sampleInput: "5 1 2 3 4 5",
//     sampleOutput: "5 4 3 2 1",
//     defaultCode: "",
//   },
// ];

interface ProblemContextType {
  problems: Problem[];
  activeProblem: Problem;
  setActiveProblem: (problem: Problem) => void;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  code: string;
  setCode: (code: string) => void;
  customInput: string;
  setCustomInput: (input: string) => void;
  getProblems: () => void;
  getProblem: (problemId: number) => void;
  runCode: () => void;
  submitCode: () => void;
  getSubmissionStatus: (submissionId: string) => void;
  submissions: Array<{
    submissionId: string;
    problemId: string;
    code: string;
    language: string;
    isAccepted: boolean;
    submissionTime: Date;
    submissionType: string;
    userId?: string;
  }>;
  getSubmissions: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  sidebarView: 'problems' | 'submissions';
  setSidebarView: (view: 'problems' | 'submissions') => void;
  error: string;
  setError: (error: string) => void;
  output: string;
  setOutput: (output: string) => void;
  isAccepted: boolean;
  setIsAccepted: (isAccepted: boolean) => void;
  users: Array<{
    userName: string,
    userId: string
  }>

  getUsers: () => void;
}

const ProblemContext = createContext<ProblemContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export function useProblem() {
    const context = useContext(ProblemContext);
    if (context === undefined) {
    throw new Error("useProblem must be used within a ProblemProvider");
  }
  return context;
}

export function ProblemProvider({ children }: { children: ReactNode }) {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [activeProblem, setActiveProblem] = useState<Problem>(problems[0]);
  const [users, setUsers] = useState({userName: "", userId:  ""})
  const [language, setLanguage] = useState<SupportedLanguage>("c");
  const [code, setCode] = useState(problems[0]?.defaultCode || "");
  const [customInput, setCustomInput] = useState(
    problems[0]?.sampleInput || ""
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarView, setSidebarView] = useState<'problems' | 'submissions'>('problems');
  const [error, setError] = useState("");
  const [output, setOutput] = useState("");
  const [isAccepted, setIsAccepted] = useState(false);
  const [submissions, setSubmissions] = useState<
    Array<{
      submissionId: string;
      problemId: string;
      code: string;
      language: string;
      isAccepted: boolean;
      submissionTime: Date;
      submissionType: string;
      userId?: string;
    }>
  >([]);

  useEffect(() => {
    getUsers()
    getProblems();
    getSubmissions();
  }, []);

  useEffect(() => {
    setActiveProblem(problems[0]);
  }, [problems]);


  useEffect(() => {
    setOutput("");
    setIsAccepted(false);
    setError("");
  }, [activeProblem, code, customInput, language]);


  const getUsers = async () => {
    try {
      const response = await api.get("/users");
            
      setUsers(response.data.map((user: {
        name: string,
        user_id: string
      }) => ({
        userName: user.name,
        userId: user.user_id
      }) )
    )

    } catch (error) {
      console.log("error fetching users", error);
      
    }
  }

  const getProblems = async () => {
    try {
      const response = await api.get("/problems");
      setProblems(
        response.data.map(
          (problem: {
            problem_id: string;
            title: string;
            description: string;
            default_testcase: string;
            default_output: string;
            default_code: string;
          }) => ({
            problemId: problem.problem_id,
            problemName: problem.title,
            problemStatement: (problem.description).replace(/\\n/g, '\n'),
            sampleInput: problem.default_testcase,
            sampleOutput: problem.default_output || "",
            defaultCode: defaultCode[problem.problem_id as keyof typeof defaultCode],
          })
        )
      );
      
    } catch (error) {
      console.error("Error fetching problems:", error);
    } 
    finally {
      setActiveProblem(problems[0]);
    }
  };

  // Not required for now
  const getProblem = async (problemId: number) => {
    try {
      const response = await api.get(`/problems/${problemId}`);
      setActiveProblem(response.data);
    } catch (error) {
      console.error("Error fetching problem:", error);
    }
  };

  const runCode = async () => {
    const submissionId = Math.random().toString(36).substring(2, 15);
    try {
      const response = await api.post(`/submission/${submissionId}`, {
        submission_type: "run",
        language,
        problem_id: activeProblem.problemId,
        code,
        custom_testcase: customInput,
      });
      setError(""); // Clear any previous errors
      setOutput(response.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error running code:", error);

      // Handle different types of Axios errors
      if (error.response) {
        const errorMessage =
          error.response.data?.message || `Error: ${error.response.data}`;
        setError(errorMessage);
      } else if (error.request) {
        // The request was made but no response was received
        setError("Network error: No response received from server");
      } else {
        // Something happened in setting up the request
        setError(error.message || "An unknown error occurred");
      }

      return null;
    }
  };

  const submitCode = async () => {
    const submissionId = Math.random().toString(36).substring(2, 15);
    try {
      await api.post(`/submission/${submissionId}`, {
        submission_type: "submit",
        language,
        problem_id: activeProblem.problemId,
        code,
        custom_testcase: customInput,
      });
      setError(""); // Clear any previous errors
      setOutput("");
      setIsAccepted(true);
      getSubmissions();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error submitting code:", error);
      setIsAccepted(false);
      // Handle different types of Axios errors
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const errorMessage =
          error.response.data?.message || `Error: ${error.response.data}`;
        setError(errorMessage);
      } else if (error.request) {
        // The request was made but no response was received
        setError("Network error: No response received from server");
      } else {
        // Something happened in setting up the request
        setError(error.message || "An unknown error occurred");
      }

      return null;
    }
  };

  const getSubmissionStatus = async (submissionId: string) => {
    try {
      const response = await api.get(`/submissions/${submissionId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching submission status:", error);
      return null;
    }
  };

  const getSubmissions = async () => {
    try {
      const response = await api.get(`/submissions`);
      setSubmissions(response.data.map((submission: {
        submission_id: string;
        problem_id: string;
        code: string;
        language: string;
        is_accepted: boolean;
        submission_time: Date;
        submission_type: string;
        user_id: string;
        user_name: string
      }) => ({
        submissionId: submission.submission_id,
        problemId: submission.problem_id,
        code: submission.code,
        language: submission.language,
        isAccepted: submission.is_accepted,
        submissionTime: submission.submission_time,
        submissionType: submission.submission_type,
        userId: submission.user_id,
        userName: submission.user_name
      }))
    );
    } catch (error) {
      console.error("Error fetching submissions:", error);
      return null;
    }
  };

  const value = {
    users,
    getUsers,
    problems,
    activeProblem,
    setActiveProblem,
    language,
    setLanguage,
    code,
    setCode,
    customInput,
    setCustomInput,
    isSidebarOpen,
    setIsSidebarOpen,
    sidebarView,
    setSidebarView,
    getProblems,
    getProblem,
    runCode,
    submitCode,
    getSubmissionStatus,
    getSubmissions,
    submissions,
    error,
    setError,
    output,
    setOutput,
    isAccepted,
    setIsAccepted,
  };
  return (
    <ProblemContext.Provider value={value as unknown as ProblemContextType}>{children}</ProblemContext.Provider>
  );
}
