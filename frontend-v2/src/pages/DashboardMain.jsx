import { AppBar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";

export const DashboardMain = () => {
  return (
    <div className="min-h-screen bg-blue-200 flex flex-col">
      <AppBar />

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          <Balance />
          <Users />
        </div>
      </div>
    </div>
  );
};