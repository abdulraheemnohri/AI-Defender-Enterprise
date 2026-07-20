# API Client for Frontend
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000", // Backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Process endpoints
export const getProcesses = () => api.get("/scan/processes");
export const getProcess = (pid: number) => api.get(`/scan/processes/${pid}`);

// System endpoints
export const getSystemInfo = () => api.get("/system/info");

// Firewall endpoints
export const getFirewallRules = () => api.get("/firewall/rules");
export const addFirewallRule = (rule: any) => api.post("/firewall/rules", rule);

// AI endpoints
export const explainThreat = (query: string) => api.post("/ai/explain", { query });
export const chatWithAI = (messages: any[]) => api.post("/ai/chat", { messages });

// USB endpoints
export const getUSBDevices = () => api.get("/usb/devices");

// Network endpoints
export const getNetworkConnections = () => api.get("/network/connections");

export default api;