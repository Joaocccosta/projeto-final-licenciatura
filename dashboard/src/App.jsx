import { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";

function App() {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);

  return (
 <div className="h-screen flex flex-col bg-white">
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto bg-white">
          <MainContent />
        </div>
        <Sidebar visible={sidebarVisible} toggle={toggleSidebar} />
      </div>
    </div>
  );
}

export default App;
