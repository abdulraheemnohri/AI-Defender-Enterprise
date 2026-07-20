import axios from "axios";


const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});


export const getDashboard = async () => {
  const response = await api.get("/dashboard");
  return response.data;
};

export const getProcesses = async () => {
  const response = await api.get("/scan/processes");
  return response.data;
};

export const getProcess = async (pid: number) => {
  const response = await api.get(`/scan/processes/${pid}`);
  return response.data;
};

export const getSystemInfo = async () => {
  const response = await api.get("/system/info");
  return response.data;
};

export const getFirewallRules = async () => {
  const response = await api.get("/firewall/rules");
  return response.data;
};

export const addFirewallRule = async (rule: {
  name: string;
  action: string;
  target: string;
  protocol?: string;
  enabled?: boolean;
}) => {
  const response = await api.post("/firewall/rules", rule);
  return response.data;
};

export const explainThreat = async (query: string) => {
  const response = await api.post("/ai/explain", { query });
  return response.data;
};

export const chatWithAI = async (messages: Array<{ role: string; content: string }>) => {
  const response = await api.post("/ai/chat", { messages });
  return response.data;
};

export const getUSBDevices = async () => {
  const response = await api.get("/usb/devices");
  return response.data;
};

export const getNetworkConnections = async () => {
  const response = await api.get("/network/connections");
  return response.data;
};

export default api;
