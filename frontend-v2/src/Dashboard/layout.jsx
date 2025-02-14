// Layout.jsx
import React, { useState } from "react";
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";

export const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main
        className={`
          flex-1 p-6 lg:p-8 transition-all duration-300
          ${sidebarOpen ? "ml-72" : "ml-16"}
        `}
      >
        <Navbar />
        {children}
      </main>
    </div>
  );
};
