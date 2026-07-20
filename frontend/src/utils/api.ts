import axios from "axios";


const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});


export const loginUser = async (credentials: {
  username: string;
  password?: string;
  pin?: string;
  role: string;
  remember_me: boolean;
}) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const verifyMFA = async (verification: { token: string; code: string }) => {
  const response = await api.post("/auth/verify-2fa", verification);
  return response.data;
};

export const getAuditLogs = async () => {
  const response = await api.get("/auth/audit-logs");
  return response.data;
};

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

export const killProcess = async (pid: number) => {
  const response = await api.post(`/scan/processes/${pid}/kill`);
  return response.data;
};

export const suspendProcess = async (pid: number) => {
  const response = await api.post(`/scan/processes/${pid}/suspend`);
  return response.data;
};

export const startScan = async (scanType: string) => {
  const response = await api.post("/scan/start-scan", { scan_type: scanType });
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

export const deleteFirewallRule = async (id: number) => {
  const response = await api.delete(`/firewall/rules/${id}`);
  return response.data;
};

export const toggleFirewallRule = async (id: number) => {
  const response = await api.post(`/firewall/rules/${id}/toggle`);
  return response.data;
};

export const importFirewallRules = async (rules: Array<any>) => {
  const response = await api.post("/firewall/rules/import", rules);
  return response.data;
};

export const explainThreat = async (query: string, model: string = "gemma") => {
  const response = await api.post("/ai/explain", { query, model });
  return response.data;
};

export const chatWithAI = async (messages: Array<{ role: string; content: string }>, model: string = "gemma") => {
  const response = await api.post("/ai/chat", { messages, model });
  return response.data;
};

export const getUSBDevices = async () => {
  const response = await api.get("/usb/devices");
  return response.data;
};

export const toggleUSBDevice = async (name: string) => {
  const response = await api.post("/usb/devices/toggle", { name });
  return response.data;
};

export const getNetworkConnections = async () => {
  const response = await api.get("/network/connections");
  return response.data;
};

export default api;
