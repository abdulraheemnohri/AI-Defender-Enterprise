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

export const getIsolationStatus = async () => {
  const response = await api.get("/system/isolation");
  return response.data;
};

export const toggleIsolationStatus = async () => {
  const response = await api.post("/system/isolation/toggle");
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

export const promoteSuggestedRule = async (rule: {
  name: string;
  action: string;
  target: string;
  protocol?: string;
  enabled?: boolean;
}) => {
  const response = await api.post("/firewall/rules/promote", rule);
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

// --- NEW MODULES API ENDPOINTS ---

// 1. AI Models Management
export const fetchModels = async () => {
  const response = await api.get("/models");
  return response.data;
};

export const toggleActiveModel = async (id: string) => {
  const response = await api.post(`/models/${id}/toggle`);
  return response.data;
};

export const fetchModelConfig = async () => {
  const response = await api.get("/models/config");
  return response.data;
};

export const updateModelConfig = async (config: any) => {
  const response = await api.post("/models/config", config);
  return response.data;
};

export const runModelBenchmark = async (id: string) => {
  const response = await api.post("/models/benchmark", { model_id: id });
  return response.data;
};

export const registerModel = async (data: {
  name: string;
  weights_path: string;
  size_gb: number;
  accelerator: string;
}) => {
  const response = await api.post("/models/register", data);
  return response.data;
};

// 2. User & Access Session controls
export const fetchUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const createNewUser = async (data: {
  username: string;
  password?: string;
  role: string;
  email: string;
  department: string;
}) => {
  const response = await api.post("/users", data);
  return response.data;
};

export const deleteUser = async (username: string) => {
  const response = await api.delete(`/users/${username}`);
  return response.data;
};

export const fetchActiveSessions = async () => {
  const response = await api.get("/users/sessions");
  return response.data;
};

export const revokeSession = async (sessId: string) => {
  const response = await api.post(`/users/sessions/${sessId}/revoke`);
  return response.data;
};

export const fetchAuditLogs = async () => {
  const response = await api.get("/users/audit-logs");
  return response.data;
};

// 3. Signature & Behavioral Rules
export const fetchRules = async () => {
  const response = await api.get("/rules");
  return response.data;
};

export const createRule = async (data: {
  name: string;
  type: string;
  content: string;
  description: string;
  tags: string[];
}) => {
  const response = await api.post("/rules", data);
  return response.data;
};

export const toggleRule = async (id: string) => {
  const response = await api.post(`/rules/${id}/toggle`);
  return response.data;
};

export const compileRule = async (data: { content: string; type: string }) => {
  const response = await api.post("/rules/compile", data);
  return response.data;
};

export const deleteRule = async (id: string) => {
  const response = await api.delete(`/rules/${id}`);
  return response.data;
};

export default api;
