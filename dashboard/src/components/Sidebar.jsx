import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Sidebar = ({ visible, toggle }) => (
  <div className={`transition-all duration-300 ${visible ? "w-64" : "w-6"} bg-white border-l shadow h-full`}>
    <button onClick={toggle} className="absolute top-2 right-2">
      {visible ? <ChevronRight /> : <ChevronLeft />}
    </button>
    {visible && (
      <div className="p-4">
        {/* Sidebar content */}
        <p>Sidebar</p>
      </div>
    )}
  </div>
);

export default Sidebar;
