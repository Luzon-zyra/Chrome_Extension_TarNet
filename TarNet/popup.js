// Helper function: Format time as hh:mm:ss
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

const dashboardList = document.getElementById("dashboard-list");
const clearButton = document.getElementById("clear-data");

async function loadDashboard() {
  const data = await chrome.storage.local.get("timeData");
  const timeData = data.timeData || {};

  dashboardList.innerHTML = "";
  Object.entries(timeData).forEach(([domain, time]) => {
    const li = document.createElement("li");
    li.textContent = `${domain}: ${formatTime(time)}`;
    dashboardList.appendChild(li);
  });
}

clearButton.addEventListener("click", async () => {
  await chrome.storage.local.set({ timeData: {} });
  loadDashboard();
});

loadDashboard();
