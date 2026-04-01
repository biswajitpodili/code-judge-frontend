import codebreakersLogo from "../assets/images/codebreakers.png";
import inspranoLogo from "../assets/images/insprano2k25.png";
import { useAuth } from "../context/AuthContext";
import { useTimer } from "../context/TimerContext";

const Navbar = () => {
  const { user } = useAuth();
  const { timeRemaining, formatTime } = useTimer();


  // Calculate percentage for timer progress
  const timerPercentage = (timeRemaining / 60) * 100;
  
  // Determine timer color based on remaining time
  const getTimerColor = () => {
    if (timeRemaining <= 10) return 'bg-red-500';
    if (timeRemaining <= 20) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="flex items-center justify-between px-10 h-16 bg-[#282828] border-b border-[#313131]">
      <div className="w-1/3 flex items-center gap-2">
        <img src={codebreakersLogo} alt="Codebreakers Logo" className="h-12" />
        <h1 className="text-white text-2xl  font-[Source_Code_Pro_SemiBold] ">
          Codebreakers
        </h1>
      </div>
      <img
        src={inspranoLogo}
        alt="Insprano Logo"
        className="h-16 object-contain"
      />
      <div className="flex items-center justify-end gap-4 w-1/3">
        {/* Timer display with progress bar */}
        <div className="flex items-center gap-3">
          <div className="relative w-24 h-8 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`absolute left-0 top-0 h-full ${getTimerColor()} transition-all duration-1000 ease-linear`} 
              style={{ width: `${timerPercentage}%` }}
            ></div>
            <div className={`absolute inset-0 flex items-center justify-center font-mono font-bold text-white ${timeRemaining <= 10 ? 'animate-pulse' : ''}`}>
              {formatTime()}
            </div>
          </div>
          
         
        </div>
        
        {/* User info and logout */}
        <div className="flex items-center gap-2">
          <span className=" text-white tracking-wide"> Welcome, <span className="font-semibold">{user?.userName}</span> </span>
         
        </div>
      </div>
    </div>
  );
};

export default Navbar;
