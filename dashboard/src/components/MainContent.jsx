import { useEffect, useState } from "react";
import CardUpgraded from './CardUpgraded'; // Import the new Card component

const MainContent = () => {
  const [linhas, setLinhas] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);
  const [selectedLinha, setSelectedLinha] = useState("");
  const [oeeData, setOeeData] = useState([
    { title: "Parts Goal View", status: "37s - Active", performancePercentage: 98, performanceLabel: "PARTS GOAL", performanceValue: "374 PARTS", additionalInfo: "FAU248: 7 parts behind", showChart: true },
    { title: "OEE View", status: "1m - Active", performancePercentage: 102, performanceLabel: "OEE", performanceValue: "374 PARTS", additionalInfo: "FAU248: 8 parts ahead", showChart: true },
    { title: "Utilization View", status: "1m - Active", performancePercentage: 95, performanceLabel: "UTILIZATION", showChart: true },
    { title: "Downtime View", status: "3m - Active", performancePercentage: 92, performanceLabel: "IN-CYCLE", isDowntimeView: true },
  ]);

  useEffect(() => {
    fetch("/api/linhas")
      .then((res) => res.json())
      .then((data) => setLinhas(data))
      .catch((err) => console.error("Erro ao carregar linhas:", err));

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (selectedLinha) {
      console.log(`Fetching OEE data for linha: ${selectedLinha}`);
      const fetchedData = [
        { title: "CNC " + selectedLinha + " - Parts", status: "Fetching...", performancePercentage: 0, performanceLabel: "PARTS GOAL", performanceValue: "0 PARTS", additionalInfo: "Fetching...", showChart: true },
        { title: "CNC " + selectedLinha + " - OEE", status: "Fetching...", performancePercentage: 0, performanceLabel: "OEE", performanceValue: "0 PARTS", additionalInfo: "Fetching...", showChart: true },
        { title: "CNC " + selectedLinha + " - Utilization", status: "Fetching...", performancePercentage: 0, performanceLabel: "UTILIZATION", showChart: true },
        { title: "CNC " + selectedLinha + " - Downtime", status: "Fetching...", performancePercentage: 0, performanceLabel: "IN-CYCLE", isDowntimeView: true },
      ];
      setOeeData(fetchedData);
    } else {
      const placeholderData = [
        { title: "Parts Goal View", status: "N/A", performancePercentage: 0, performanceLabel: "PARTS GOAL", performanceValue: "N/A", additionalInfo: "Select a line", showChart: true },
        { title: "OEE View", status: "N/A", performancePercentage: 0, performanceLabel: "OEE", performanceValue: "N/A", additionalInfo: "Select a line", showChart: true },
        { title: "Utilization View", status: "N/A", performancePercentage: 0, performanceLabel: "UTILIZATION", showChart: true },
        { title: "Downtime View", status: "N/A", performancePercentage: 0, performanceLabel: "IN-CYCLE", isDowntimeView: true },
      ];
      setOeeData(placeholderData);
    }
  }, [selectedLinha]);

  const handleRefresh = () => {
    window.location.reload();
  };

  const enterFullscreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };

  return (
    <div className="pl-8 pt-4 pr-8 pb-4 relative h-full bg-white overflow-y-auto">
      <div className="absolute top-4 right-4 flex space-x-2 z-10">
        <button
          onClick={handleRefresh}
          className="p-2 rounded hover:bg-gray-200"
          title="Refresh Page"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6 text-gray-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        </button>
        <button
          onClick={!isFullscreen ? enterFullscreen : exitFullscreen}
          className="p-2 rounded hover:bg-gray-200"
          title={!isFullscreen ? "Enter Fullscreen" : "Exit Fullscreen"}
        >
          {!isFullscreen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 4H6v4m8 0V4h4m0 8v4h-4m-8 0H6v-4"
              />
            </svg>
          )}
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 mb-2 text-2xl font-bold">Linha</label>
        <select
          className="p-4 border-2 border-gray-300 rounded shadow-md w-72 text-base focus:outline-none focus:border-blue-500 text-black"
          value={selectedLinha}
          onChange={(e) => setSelectedLinha(e.target.value)}
        >
          <option value="">Selecione a Linha</option>
          {linhas.map((linha) => (
            <option key={linha.id} value={linha.id}>
              {linha.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {oeeData.map((data, index) => (
          <CardUpgraded
            key={index}
            title={data.title}
            status={data.status}
            performancePercentage={data.performancePercentage}
            performanceLabel={data.performanceLabel}
            performanceValue={data.performanceValue}
            additionalInfo={data.additionalInfo}
            showChart={data.showChart}
            isDowntimeView={data.isDowntimeView}
          />
        ))}
      </div>
    </div>
  );
};

export default MainContent;
