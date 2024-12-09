const dashboardList = document.getElementById("dashboard-list");
const clearButton = document.getElementById("clear-data");

async function loadDashboard() {
  const data = await chrome.storage.local.get("timeData");
  const timeData = data.timeData || {};

  dashboardList.innerHTML = "";
  Object.entries(timeData).forEach(([domain, time]) => {
    const li = document.createElement("li");
    li.textContent = `${domain}: ${time}s`;
    dashboardList.appendChild(li);
  });
}

clearButton.addEventListener("click", async () => {
  await chrome.storage.local.set({ timeData: {} });
  loadDashboard();
});

loadDashboard();
