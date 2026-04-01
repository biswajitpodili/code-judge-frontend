import { useNavigate } from "react-router";
import { useTimer } from "../../context/TimerContext";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";

const StopTimerFunction = () => {
  const { stopTimer } = useTimer();
  stopTimer();

  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    logout();
    navigate("/");
    stopTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
};

export default StopTimerFunction;
