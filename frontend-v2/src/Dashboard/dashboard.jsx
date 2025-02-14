// Main Dashboard Component
import { BalanceCard } from "./balance";
import { Layout } from "./layout";
import { TransactionsList } from "./transactionList";

export const HeroDashboard = () => {
  const dashboardData = {
    balance: 24563.0,
    growth: 2.5,
    income: 12150.0,
    expenses: 4320.0,
  };

  return (
    <Layout>
      <div className="flex flex-col h-screen max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <hr className="border-gray-300 my-6 mt-1" />
        <BalanceCard
          balance={dashboardData.balance}
          growth={dashboardData.growth}
        />
        <TransactionsList />
      </div>
    </Layout>
  );
};

export default HeroDashboard;