// src/components/Navbar.js
import React from 'react';

function Navbar() {
  return (
    <nav className="flex items-center justify-between bg-white shadow px-[24px] py-[16px]">
      <div className="text-[24px] font-bold">Dashboard</div>
      <div>
        {/* Additional navbar elements (e.g., search, avatar) can be added here */}
        <button className="bg-blue-500 text-white px-[16px] py-[8px] rounded hover:bg-blue-600">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
