import { useState } from 'react';
import Header from '../components/Header';
import MainContent from '../components/MainContent';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [selectedLinha, setSelectedLinha] = useState("");

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-grow overflow-hidden relative">
          <MainContent
            onLineaChange={(linhaId) => setSelectedLinha(linhaId)}
            selectedLin
            ha={selectedLinha}
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
};

export default Dashboard;