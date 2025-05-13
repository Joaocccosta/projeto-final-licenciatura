import { useState } from 'react';
import Header from './components/Header';
import MainContent from './components/MainContent';
import Sidebar from './components/Sidebar';

function App() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [selectedLinha, setSelectedLinha] = useState("");

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-grow overflow-hidden relative">
          <MainContent 
            onLineaChange={(linhaId) => setSelectedLinha(linhaId)} 
            selectedLinha={selectedLinha}
          />
        </div>
        <Sidebar 
          visible={sidebarVisible} 
          toggle={toggleSidebar} 
          selectedLinha={selectedLinha} 
        />
      </div>
    </div>
  );
}

export default App;
