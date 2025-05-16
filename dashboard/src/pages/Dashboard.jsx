import { useState } from 'react';
import Header from '../components/Header';
import MainContent from '../components/MainContent';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [selectedLinha, setSelectedLinha] = useState("");
  const { user, isGuest } = useAuth();

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Only show sidebar for authenticated users who are not guests
  const showSidebar = user && !isGuest;

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col overflow-auto">
          <MainContent
            onLineaChange={(linhaId) => setSelectedLinha(linhaId)}
            selectedLinha={selectedLinha}
          />
        </div>
        {showSidebar && (
          <Sidebar
            visible={sidebarVisible}
            toggle={toggleSidebar}
            selectedLinha={selectedLinha}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;