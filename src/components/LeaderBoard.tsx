import { useState, useEffect } from "react";
import { useProblem } from "../context/ProblemContext";
import { useAuth } from "../context/AuthContext";
import { HiLogout } from "react-icons/hi";

import { MdBarChart } from "react-icons/md";

interface LeaderboardEntry {
  userId: string;
  userName: string;
  problemsSolved: number;
  lastSubmissionTime: string;
  rank: number;
}

// Define the submission type based on ProblemContext
interface Submission {
  submissionId: string;
  problemId: string;
  code: string;
  language: string;
  isAccepted: boolean;
  submissionTime: Date | string;
  submissionType: string;
  userId?: string;
  userName?: string;
}

const LeaderBoard = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { isAuthenticated, logout } = useAuth();
  const { submissions, getSubmissions, users, getUsers } = useProblem();

  useEffect(() => {
    // Fetch submissions and users when component mounts
    getSubmissions();
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Process submissions to create leaderboard data
    try {
      setIsLoading(true);

      // Group submissions by user
      const userSubmissions: Record<string, Submission[]> = {};

      submissions.forEach((submission) => {
        const userId = submission.userId || '';

        // Skip entries without userId
        if (!userId) return;

        if (!userSubmissions[userId]) {
          userSubmissions[userId] = [];
        }

        userSubmissions[userId].push(submission as Submission);
      });

      // Create leaderboard entries
      const leaderboardEntries: LeaderboardEntry[] = Object.keys(
        userSubmissions
      ).map((userId) => {
        const userSubs = userSubmissions[userId];

        // Count unique solved problems
        const solvedProblems = new Set<string>();
        userSubs.forEach((sub) => {
          if (sub.isAccepted && sub.submissionType === 'submit') {
            solvedProblems.add(sub.problemId);
          }
        });

        // Find the latest submission time
        const lastSubmission = userSubs.reduce((latest, current) => {
          if (!latest) return current;

          const latestTime = new Date(latest.submissionTime).getTime();
          const currentTime = new Date(current.submissionTime).getTime();

          return (currentTime > latestTime) ? current : latest;
        }, userSubs[0]);

        // Find user in users array or generate a fallback username
        const user = Array.isArray(users) ? users.find(u => u.userId === userId) : null;
        const userName = user?.userName || `User-${userId.substring(0, 5)}`;

        // Format the submission time
        let lastSubmissionTimeStr = "";
        if (lastSubmission?.submissionTime) {
          const submissionDate = new Date(lastSubmission.submissionTime);
          if (!isNaN(submissionDate.getTime())) {
            lastSubmissionTimeStr = submissionDate.toISOString();
          }
        }

        return {
          userId,
          userName,
          problemsSolved: solvedProblems.size,
          lastSubmissionTime: lastSubmissionTimeStr,
          rank: 0,
        };
      });

      // Sort by problems solved (descending) and then by submission time (ascending)
      const sortedEntries = leaderboardEntries.sort((a, b) => {
        if (b.problemsSolved !== a.problemsSolved) {
          return b.problemsSolved - a.problemsSolved;
        }

        const timeA = new Date(a.lastSubmissionTime).getTime() || 0;
        const timeB = new Date(b.lastSubmissionTime).getTime() || 0;

        if (isNaN(timeA) && isNaN(timeB)) return 0;
        if (isNaN(timeA)) return 1;
        if (isNaN(timeB)) return -1;

        return timeA - timeB;
      });

      // Assign ranks
      sortedEntries.forEach((entry, index) => {
        entry.rank = index + 1;
      });

      setLeaderboardData(sortedEntries);
      setError("");
    } catch (err) {
      console.error("Error processing leaderboard data:", err);
      setError("Failed to load leaderboard data. Please try again later.");

      // For development: create mock data if no submissions
      if (submissions.length === 0) {
        createMockData();
      }
    } finally {
      setIsLoading(false);
    }
  }, [submissions, users]);

  // Create mock data for development/testing
  const createMockData = () => {
    const mockData: LeaderboardEntry[] = [];

    for (let i = 0; i < 20; i++) {
      // Generate random date within the last 24 hours
      const hours = Math.floor(Math.random() * 24);
      const minutes = Math.floor(Math.random() * 60);
      const seconds = Math.floor(Math.random() * 60);
      const submissionDate = new Date();
      submissionDate.setHours(submissionDate.getHours() - hours);
      submissionDate.setMinutes(submissionDate.getMinutes() - minutes);
      submissionDate.setSeconds(submissionDate.getSeconds() - seconds);

      mockData.push({
        userId: `user${i + 1}`,
        userName: `User ${i + 1}`,
        problemsSolved: Math.floor(Math.random() * 5), // 0-4 problems solved
        lastSubmissionTime: submissionDate.toISOString(),
        rank: 0,
      });
    }

    // Sort by problems solved (descending) and then by submission time (ascending)
    const sortedMockData = mockData.sort((a, b) => {
      if (b.problemsSolved !== a.problemsSolved) {
        return b.problemsSolved - a.problemsSolved;
      }

      const timeA = new Date(a.lastSubmissionTime).getTime();
      const timeB = new Date(b.lastSubmissionTime).getTime();
      return timeA - timeB;
    });

    // Assign ranks
    sortedMockData.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    setLeaderboardData(sortedMockData);
  };

  // Format the submission time in a readable format
  const formatSubmissionTime = (dateString: string) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "N/A";
      }

      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      };

      return date.toLocaleString(undefined, options);
    } catch {
      return "N/A";
    }
  };

  const handleLogout = () => {
    logout();
    // Redirect to home page will be handled by the auth context
  };

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col">
      <div className="flex-1 p-6">
        <div className="bg-[#1e1e1e] rounded-lg p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white flex  flex-row items-center gap-2">
              <MdBarChart />
              Leaderboard
            </h1>

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
              >
                <HiLogout className="w-5 h-5" />
                Logout
              </button>
            ) : (
              <div className="bg-blue-900/30 text-blue-300 px-4 py-2 rounded-md text-sm border border-blue-800">
                Login to participate in the contest and appear on the
                leaderboard
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 p-4 bg-red-900/20 border border-red-800 rounded-md">
              {error}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#282828] text-left">
                    <th className="p-4 text-gray-300 font-semibold rounded-tl-md">
                      Rank
                    </th>
                    <th className="p-4 text-gray-300 font-semibold">User</th>
                    <th className="p-4 text-gray-300 font-semibold">
                      Problems Solved
                    </th>
                    <th className="p-4 text-gray-300 font-semibold rounded-tr-md">
                      Last Submission
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-gray-400">
                        No data available yet
                      </td>
                    </tr>
                  ) : (
                    leaderboardData.map((entry, index) => (
                      <tr
                        key={entry.userId}
                        className={`border-b border-[#333333] ${
                          index % 2 === 0 ? "bg-[#252525]" : "bg-[#2a2a2a]"
                        } hover:bg-[#303030] transition-colors`}
                      >
                        <td className="p-4 text-white">
                          <div className="flex items-center">
                            {entry.rank <= 3 ? (
                              <span
                                className={`inline-block w-6 h-6 rounded-full mr-2 flex items-center justify-center text-black font-bold ${
                                  entry.rank === 1
                                    ? "bg-yellow-400"
                                    : entry.rank === 2
                                    ? "bg-gray-300"
                                    : "bg-amber-600"
                                }`}
                              >
                                {entry.rank}
                              </span>
                            ) : (
                              <span className="inline-block w-6 text-center mr-2">
                                {entry.rank}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-white font-medium">
                          {entry.userName}
                        </td>
                        <td className="p-4 text-blue-400 font-bold">
                          {entry.problemsSolved}
                        </td>
                        <td className="p-4 text-gray-300">
                          {formatSubmissionTime(entry.lastSubmissionTime)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;
