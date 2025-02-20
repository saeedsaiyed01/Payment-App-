import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Home from "../icons/home";
import Money from "../icons/money";
import Setting from "../icons/setting";
import Slide from "../icons/slide";
import Wallet from "../icons/wallet";
import { SidebarItem } from "./SidebarIteams";

export function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();

  useEffect(() => {
    function handleResize() {
      setSidebarOpen(window.innerWidth >= 768);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setSidebarOpen]);

  return (
    <div
      className={`
       fixed left-0 top-0 m-0 h-screen border-r border-gray-300 bg-blue-200 shadow-lg

        ${sidebarOpen ? "w-72 p-5" : "w-16 p-2"}
        transition-all duration-300
      `}
    >
      {/* Sidebar Toggle Button */}
      <div className="flex  justify-end">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-blue-100 transition"
        >
          <Slide />
        </button>
      </div>

      {/* Sidebar Title */}
      <div className="flex items-center gap-3 px-3 py-4">
        <Wallet />
        {sidebarOpen && (
          <div className="text-2xl font-bold text-black">PayLink</div>
        )}
      </div>

      {/* Divider */}
      <hr className="border-gray-300 my-4" />

      {/* Sidebar Menu */}
      <div className="pt-2 text-lg font-medium space-y-4">
        <SidebarItem
          onClick={() => navigate("/transfer")}
          text="Transfer"
          icon={<Home />}
          sidebarOpen={sidebarOpen}
        />
        <SidebarItem
          onClick={() => navigate("/Transactions")}
          text="Transactions"
          icon={<Money />}
          sidebarOpen={sidebarOpen}
        />
        <SidebarItem text="Wallet" icon={<Home />} sidebarOpen={sidebarOpen} />
        <SidebarItem
          onClick={() => navigate("/setting")}
          text="Settings"
          icon={<Setting />}
          sidebarOpen={sidebarOpen}
        />
      </div>
    </div>
  );
}
