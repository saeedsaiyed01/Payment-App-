import { ArrowUpRight, CreditCard, History, SendHorizontal, Shield, Wallet } from 'lucide-react';
import React from 'react';



function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
      <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
        <Icon className="text-blue-700 w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 text-gray-900">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-8 h-8 text-blue-700" />
            <span className="text-2xl font-bold">PayLink</span>
          </div>

          <a href="/signup">
            <button className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors">
              Get Started
            </button>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 pt-20 pb-24">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Send Money Instantly, <span className="text-blue-700">Securely</span>
            </h1>
            <p className="text-lg mb-8 max-w-2xl text-gray-700">
              Experience seamless money transfers with PayLink. Send money, track transactions, and manage your wallet - all in one secure platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="/signup">
                <button className="bg-blue-700 text-white px-8 py-3 rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center gap-2">
                  Start Sending <ArrowUpRight className="w-5 h-5" />
                </button>
              </a>
              <button className="bg-white text-blue-700 px-8 py-3 rounded-lg hover:bg-blue-200 transition-colors border-2 border-blue-700">
                Learn More
              </button>
            </div>
          </div>

          {/* Stats/Features Cards */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
            <FeatureCard
              icon={SendHorizontal}
              title="Instant Transfers"
              description="Send money to anyone, anywhere, instantly with zero hassle"
            />
            <FeatureCard
              icon={Shield}
              title="Secure Payments"
              description="Bank-grade encryption and security for your peace of mind"
            />
            <FeatureCard
              icon={History}
              title="Transfer History"
              description="Track all your transactions with detailed history"
            />
            <FeatureCard
              icon={Wallet}
              title="Digital Wallet"
              description="Manage your money with our easy-to-use digital wallet"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;
