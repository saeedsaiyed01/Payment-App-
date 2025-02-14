// src/components/SidebarItem.js
import React from 'react';

function SidebarItem({ icon, label }) {
  return (
    <div className="flex items-center p-[8px] my-[8px] hover:bg-gray-700 rounded cursor-pointer">
      <span className="text-[20px] mr-[12px]">{icon}</span>
      <span className="text-[16px]">{label}</span>
    </div>
  );
}

export default SidebarItem;
