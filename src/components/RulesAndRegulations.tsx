import { useState } from "react";
import { useNavigate } from "react-router";
import { useTimer } from "../context/TimerContext";
import codebreakersLogo from "../assets/images/codebreakers.png";
const RulesAndRegulations = () => {
  const [isAccepted, setIsAccepted] = useState(false);
  const navigate = useNavigate();
  const { startTimer } = useTimer();

  const handleStartContest = () => {
    if (isAccepted) {
      // Start the timer
      startTimer();
      // Navigate to contest page
      navigate("/contest");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] text-white p-4">
      <img
        src={codebreakersLogo}
        alt="Codebreakers Logo"
        className="h-19 my-4"
      />

      <h1 className="text-4xl font-bold mb-6 text-center">CodeChef 2K25</h1>
      <div className="max-w-3xl w-full bg-[#1e1e1e] p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Rules and Regulations
        </h1>
        <div className="mb-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          <h2 className="text-xl font-semibold mb-2">General Rules</h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              The contest duration is{" "}
              <span className="font-bold text-blue-400">60 minute</span>.
            </li>
            <li>Once the timer starts, it cannot be paused or extended.</li>
            <li>
              You will be automatically logged out when the timer reaches zero.
            </li>
            <li>
              You must solve the given programming problems within the time
              limit.
            </li>
            <li>Each problem has its own scoring criteria and test cases.</li>
          </ul>

          <h2 className="text-xl font-semibold mb-2">Code of Conduct</h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Do not attempt to cheat or use unauthorized resources.</li>
            <li>Do not share your solutions with others during the contest.</li>
            <li>Your code will be checked for plagiarism.</li>
            <li>Violation of rules may result in disqualification.</li>
          </ul>

          <h2 className="text-xl font-semibold mb-2">Technical Requirements</h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              Ensure you dont change the wifi connection during the contest.
            </li>
            <li>Do not refresh or close the browser during the contest.</li>
            <li>Your submission is automatically saved.</li>
            <li>
              If you face any technical issues, contact the CodeBreakers team
              immediately.
            </li>
          </ul>
        </div>
        <div className="w-full">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="rules"
              id="rules"
              checked={isAccepted}
              onChange={() => setIsAccepted(!isAccepted)}
            />
            <label htmlFor="rules">I accept the rules and regulations</label>
          </div>

          <div className="flex justify-center items-center gap-2 w-full">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer mt-4 hover:bg-blue-600 transition-all duration-300 "
              onClick={handleStartContest}
              disabled={!isAccepted}
            >
              Start Contest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RulesAndRegulations;
