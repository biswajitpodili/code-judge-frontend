import Navbar from "../components/Navbar";
import { Outlet } from "react-router";

const HomeLayout = () => {
  return (
    <div className="font-[Fira_Sans]">
      {/* Navbar */}
      <Navbar />
      <Outlet />
    </div>
  );
};

export default HomeLayout;
