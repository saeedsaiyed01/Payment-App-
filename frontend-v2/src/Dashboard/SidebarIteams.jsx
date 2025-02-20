export function SidebarItem({ text, icon, onClick, sidebarOpen }) {
  return (
    <div
      onClick={onClick}
      className={`
        flex items-center p-3 rounded-lg cursor-pointer transition-all duration-300
        hover:bg-blue-100
        ${sidebarOpen ? "justify-start px-4 w-full" : "justify-center w-12"}
      `}
    >
      <div className="text-2xl text-gray-600">{icon}</div>

      {sidebarOpen && <span className="ml-3 text-gray-800">{text}</span>}
    </div>
  );
}
