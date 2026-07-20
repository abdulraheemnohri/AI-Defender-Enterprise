import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Divider,
} from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import TerminateIcon from "@mui/icons-material/CancelRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import { useNavigate } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { MetricCard } from "../components/common/MetricCard";
import { PanelCard } from "../components/common/PanelCard";
import { getDashboard, killProcess, suspendProcess, explainThreat } from "../utils/api";


type DashboardState = {
  security_score: number;
  threat_level: string;
  metrics: Array<{ label: string; value: string; delta: string; status: string }>;
  alerts: Array<{
    id: number;
    title: string;
    severity: string;
    source: string;
    status: string;
    created_at: string;
    description?: string;
  }>;
  timeline: Array<{ time: string; value: number }>;
  processes: Array<{ pid: number; name: string; cpu: number; memory: number; risk: string }>;
};


const fallbackDashboard: DashboardState = {
  security_score: 92,
  threat_level: "Elevated",
  metrics: [
    { label: "CPU Usage", value: "27%", delta: "-3%", status: "healthy" },
    { label: "Memory Usage", value: "61%", delta: "+4%", status: "warning" },
    { label: "Disk Usage", value: "48%", delta: "+1%", status: "healthy" },
    { label: "Network Traffic", value: "124 Mbps", delta: "+12%", status: "active" },
  ],
  alerts: [
    {
      id: 1001,
      title: "Suspicious PowerShell chain detected",
      severity: "high",
      source: "Behavior Engine",
      status: "investigating",
      created_at: new Date().toISOString(),
      description: "An encoded PowerShell command execution was triggered by an Office child process. This represents a potential persistence or initial access technique.",
    },
    {
      id: 1002,
      title: "Unsigned executable downloaded",
      severity: "medium",
      source: "File Defender",
      status: "queued",
      created_at: new Date().toISOString(),
      description: "The file 'invoice_viewer.exe' was downloaded to the Downloads directory. The file lacks a valid cryptographic digital signature and contains high entropy.",
    },
    {
      id: 1003,
      title: "Untrusted USB device attached",
      severity: "medium",
      source: "USB Defender",
      status: "contained",
      created_at: new Date().toISOString(),
      description: "An unknown USB mass storage device was plugged in. Auto-containment policies applied a read-only filter to prevent HID injection.",
    },
  ],
  timeline: [
    { time: "08:00", value: 2 },
    { time: "10:00", value: 4 },
    { time: "12:00", value: 3 },
    { time: "14:00", value: 6 },
    { time: "16:00", value: 5 },
    { time: "18:00", value: 7 },
  ],
  processes: [
    { pid: 1884, name: "powershell.exe", cpu: 6.2, memory: 2.9, risk: "high" },
    { pid: 4120, name: "chrome.exe", cpu: 12.8, memory: 8.4, risk: "low" },
    { pid: 2456, name: "MsMpEng.exe", cpu: 4.1, memory: 6.8, risk: "trusted" },
    { pid: 5228, name: "onedrive.exe", cpu: 2.7, memory: 3.2, risk: "medium" },
  ],
};


export const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardState>(fallbackDashboard);
  const [loading, setLoading] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);

  // Detail Dialogs States
  const [selectedProcess, setSelectedProcess] = useState<any>(null);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);

  // AI analysis state for the process details
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Live ticking metrics
  const [liveCpu, setLiveCpu] = useState(27);
  const [liveRam, setLiveRam] = useState(61);
  const [liveNetwork, setLiveNetwork] = useState(124);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const payload = await getDashboard();
        // If success, store
        setData(payload);
        if (payload.metrics) {
          // parse numerical values for live ticking baseline
          setLiveCpu(parseInt(payload.metrics[0]?.value) || 27);
          setLiveRam(parseInt(payload.metrics[1]?.value) || 61);
        }
      } catch (error) {
        setOfflineMode(true);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();

    // Ticker to simulate real-time performance data activity
    const interval = setInterval(() => {
      setLiveCpu((prev) => {
        const delta = Math.floor(Math.random() * 7) - 3; // -3 to +3
        const val = prev + delta;
        return Math.max(10, Math.min(95, val));
      });
      setLiveNetwork((prev) => {
        const delta = Math.floor(Math.random() * 15) - 7;
        const val = prev + delta;
        return Math.max(50, Math.min(450, val));
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Update dynamic metrics with live ticking values
  const dynamicMetrics = useMemo(() => {
    return [
      { label: "CPU Usage", value: `${liveCpu}%`, delta: liveCpu > 40 ? "+5%" : "-2%", status: liveCpu > 80 ? "warning" : "healthy" },
      { label: "Memory Usage", value: `${liveRam}%`, delta: "+1%", status: liveRam > 80 ? "warning" : "healthy" },
      { label: "Disk Usage", value: "48%", delta: "0%", status: "healthy" },
      { label: "Network Traffic", value: `${liveNetwork} Mbps`, delta: "+8%", status: "active" },
    ];
  }, [liveCpu, liveRam, liveNetwork]);

  const scoreTone = useMemo(() => {
    if (data.security_score >= 90) {
      return "success";
    }
    if (data.security_score >= 70) {
      return "warning";
    }
    return "error";
  }, [data.security_score]);

  // Handle killing a process
  const handleKillProcess = async (pid: number) => {
    try {
      await killProcess(pid);
      setData((prev) => ({
        ...prev,
        processes: prev.processes.filter((p) => p.pid !== pid),
      }));
      setSelectedProcess(null);
      setAiAnalysisResult(null);
    } catch (err) {
      // Offline fallback
      setData((prev) => ({
        ...prev,
        processes: prev.processes.filter((p) => p.pid !== pid),
      }));
      setSelectedProcess(null);
      setAiAnalysisResult(null);
    }
  };

  // Handle suspending a process
  const handleSuspendProcess = async (pid: number) => {
    try {
      await suspendProcess(pid);
      setData((prev) => ({
        ...prev,
        processes: prev.processes.map((p) => (p.pid === pid ? { ...p, risk: "suspended" } : p)),
      }));
      if (selectedProcess) {
        setSelectedProcess({ ...selectedProcess, risk: "suspended" });
      }
    } catch (err) {
      // Offline fallback
      setData((prev) => ({
        ...prev,
        processes: prev.processes.map((p) => (p.pid === pid ? { ...p, risk: "suspended" } : p)),
      }));
      if (selectedProcess) {
        setSelectedProcess({ ...selectedProcess, risk: "suspended" });
      }
    }
  };

  // Run local AI query to analyze the chosen process behavior
  const handleAIAnalyzeProcess = async (procName: string, pid: number) => {
    setAiLoading(true);
    setAiAnalysisResult(null);
    try {
      const query = `Analyze the potential threat risks for active process ${procName} (PID ${pid}). Is it malicious?`;
      const result = await explainThreat(query);
      setAiAnalysisResult(result);
    } catch (err) {
      // Mocked AI analyst backup response
      setAiAnalysisResult({
        summary: `Local Gemma-2B analysis of ${procName} flags unexpected parenting. Legitimate applications are not normally spawned from temp paths.`,
        actions: [
          "Cross-reference process image hash on internal threat feed.",
          "Check the system security logs for related file-write events.",
          "Enable network block rule for remote host connectivity."
        ],
        confidence: "high"
      });
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Executive Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Unified visibility across endpoint, network, AI orchestration, and containment playbooks.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5}>
          <Button
            variant="contained"
            startIcon={<PlayArrowRoundedIcon />}
            onClick={() => navigate("/security-center")}
          >
            Run Scan Center
          </Button>
          <Button
            variant="outlined"
            startIcon={<AutoAwesomeRoundedIcon />}
            onClick={() => navigate("/ai-defender")}
          >
            AI Assistant
          </Button>
        </Stack>
      </Stack>

      {offlineMode ? (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          Unified network backend is offline. Local telemetry dashboard simulation enabled.
        </Alert>
      ) : null}

      {/* Metrics Row */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} md={3}>
          <PanelCard title="Security Posture" subtitle="Overall security score">
            {loading ? (
              <CircularProgress size={28} />
            ) : (
              <Stack spacing={1.5}>
                <Typography variant="h2" sx={{ fontWeight: 800 }}>
                  {data.security_score}
                </Typography>
                <Chip label={data.threat_level} color={scoreTone} variant="outlined" />
              </Stack>
            )}
          </PanelCard>
        </Grid>
        {dynamicMetrics.map((metric) => (
          <Grid item xs={12} md={3} key={metric.label}>
            <MetricCard {...metric} />
          </Grid>
        ))}
      </Grid>

      {/* Interactive Live Threat Map Graphic & Alerts */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={7}>
          <PanelCard
            title="Live Workstation Threat Map"
            subtitle="Local network interfaces & contained attack vectors"
            minHeight={380}
          >
            {/* SVG Interactive Threat Topology map */}
            <Box
              sx={{
                width: "100%",
                height: 280,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "rgba(0,0,0,0.2)",
                borderRadius: 3,
                border: "1px dashed rgba(255,255,255,0.08)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <svg width="100%" height="100%" viewBox="0 0 500 250">
                {/* Connections Lines */}
                <line x1="100" y1="125" x2="250" y2="125" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                <path d="M 250 125 Q 320 60 380 70" fill="none" stroke="#4CAF50" strokeWidth="2" strokeDasharray="5,5" />
                <path d="M 250 125 Q 320 190 380 180" fill="none" stroke="#F44336" strokeWidth="2" />

                {/* Local Node */}
                <circle cx="250" cy="125" r="28" fill="rgba(33, 150, 243, 0.2)" stroke="#2196F3" strokeWidth="2" />
                <text x="250" y="129" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">HOST</text>

                {/* Gateway Node */}
                <circle cx="100" cy="125" r="18" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                <text x="100" y="128" textAnchor="middle" fill="#9CA8C3" fontSize="8">LAN</text>

                {/* Trusted External Node */}
                <circle cx="380" cy="70" r="18" fill="rgba(76, 175, 80, 0.1)" stroke="#4CAF50" strokeWidth="1.5" />
                <text x="380" y="73" textAnchor="middle" fill="#4CAF50" fontSize="8">SOC CLOUD</text>

                {/* Suspicious External IP Node */}
                <circle cx="380" cy="180" r="20" fill="rgba(244, 67, 54, 0.15)" stroke="#F44336" strokeWidth="1.5" />
                <text x="380" y="183" textAnchor="middle" fill="#F44336" fontSize="8" fontWeight="bold">TOR C2</text>

                {/* Floating telemetry alerts */}
                <text x="310" y="215" fill="#F44336" fontSize="8" fontWeight="bold">⚠️ BLOCKED: Outbound to Tor Node</text>
              </svg>
              <Box sx={{ position: "absolute", top: 12, left: 12 }}>
                <Chip size="small" label="Live Endpoint Topology" color="primary" variant="outlined" />
              </Box>
            </Box>
          </PanelCard>
        </Grid>

        <Grid item xs={12} lg={5}>
          <PanelCard title="Latest Alerts Queue" subtitle="Interactive high signal events requiring triage" minHeight={380}>
            <List disablePadding>
              {data.alerts.map((alert) => (
                <ListItem
                  key={alert.id}
                  button
                  onClick={() => setSelectedAlert(alert)}
                  sx={{
                    py: 1.25,
                    px: 1.5,
                    borderRadius: 2,
                    mb: 1,
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    bgcolor: alert.severity === "high" ? "rgba(244, 67, 54, 0.05)" : "rgba(255, 152, 0, 0.03)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.04)" },
                  }}
                >
                  <ListItemText
                    primary={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body2" fontWeight={700}>
                          {alert.title}
                        </Typography>
                        <Chip
                          label={alert.severity.toUpperCase()}
                          color={alert.severity === "high" ? "error" : "warning"}
                          size="small"
                          sx={{ height: 16, fontSize: "0.65rem" }}
                        />
                      </Stack>
                    }
                    secondary={`${alert.source} • Status: ${alert.status}`}
                  />
                </ListItem>
              ))}
            </List>
          </PanelCard>
        </Grid>
      </Grid>

      {/* Threat Timeline Chart */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={8}>
          <PanelCard
            title="Hourly Threat Timeline"
            subtitle="Risk metrics mapped dynamically throughout the daily operations"
          >
            <Box sx={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <AreaChart data={data.timeline}>
                  <defs>
                    <linearGradient id="threatGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2196F3" stopOpacity={0.7} />
                      <stop offset="95%" stopColor="#2196F3" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="time" stroke="#9CA8C3" />
                  <YAxis stroke="#9CA8C3" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#2196F3"
                    fillOpacity={1}
                    fill="url(#threatGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </PanelCard>
        </Grid>

        {/* Quick Actions Panel */}
        <Grid item xs={12} lg={4}>
          <PanelCard title="Quick Actions Console" subtitle="Enforce defense triggers">
            <Stack spacing={1.8}>
              <Button
                variant="outlined"
                fullWidth
                color="primary"
                onClick={() => navigate("/security-center")}
              >
                Launch Custom Scan Family
              </Button>
              <Button
                variant="outlined"
                fullWidth
                color="secondary"
                onClick={() => navigate("/security-center")}
              >
                Review Quarantine Vault
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate("/reports")}
              >
                Generate Compliance Report
              </Button>
              <Button
                variant="contained"
                fullWidth
                color="secondary"
                startIcon={<AutoAwesomeRoundedIcon />}
                onClick={() => navigate("/ai-defender")}
              >
                Open AI Security Assistant
              </Button>
            </Stack>
          </PanelCard>
        </Grid>
      </Grid>

      {/* Processes List */}
      <Grid container spacing={2.5}>
        <Grid item xs={12}>
          <PanelCard title="Endpoint Active Processes" subtitle="Live active threads and behavioral risk assessments. Click any process to triage.">
            <Grid container spacing={2}>
              {data.processes.map((process) => (
                <Grid item xs={12} sm={6} md={3} key={process.pid}>
                  <Paper
                    onClick={() => {
                      setSelectedProcess(process);
                      setAiAnalysisResult(null);
                    }}
                    sx={{
                      p: 2,
                      cursor: "pointer",
                      borderRadius: 3,
                      border: "1px solid rgba(255,255,255,0.06)",
                      bgcolor: "rgba(19, 27, 49, 0.4)",
                      "&:hover": {
                        bgcolor: "rgba(33, 150, 243, 0.05)",
                        borderColor: "rgba(33, 150, 243, 0.2)",
                      },
                    }}
                  >
                    <Stack spacing={1}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" fontWeight={800}>
                          {process.name}
                        </Typography>
                        <Chip
                          label={process.risk.toUpperCase()}
                          color={
                            process.risk === "high"
                              ? "error"
                              : process.risk === "medium"
                              ? "warning"
                              : process.risk === "suspended"
                              ? "default"
                              : "success"
                          }
                          size="small"
                          sx={{ fontSize: "0.6rem", height: 16 }}
                        />
                      </Stack>
                      <Typography variant="caption" color="text.secondary">
                        PID: {process.pid}
                      </Typography>
                      <Stack direction="row" spacing={2}>
                        <Typography variant="caption" color="text.secondary">
                          CPU: {process.cpu}%
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          RAM: {process.memory}%
                        </Typography>
                      </Stack>
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </PanelCard>
        </Grid>
      </Grid>

      {/* Process Detail Dialog Modal */}
      <Dialog
        open={!!selectedProcess}
        onClose={() => {
          setSelectedProcess(null);
          setAiAnalysisResult(null);
        }}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            bgcolor: "background.paper",
            borderRadius: 3,
            border: "1px solid rgba(255,255,255,0.1)",
          },
        }}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight={700}>
            Process Triage: {selectedProcess?.name} (PID: {selectedProcess?.pid})
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Parent Process</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {selectedProcess?.name === "powershell.exe" ? "winword.exe (Word child!)" : "explorer.exe"}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Digital Signature</Typography>
                <Typography variant="body2" fontWeight={600} color={selectedProcess?.risk === "high" ? "error.main" : "success.main"}>
                  {selectedProcess?.risk === "high" ? "Unsigned / Failed Verification" : "Verified Microsoft Corp."}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">File Entropy</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {selectedProcess?.name === "powershell.exe" ? "6.82 (Medium)" : "4.12 (Normal)"}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Open Handles</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {selectedProcess?.name === "powershell.exe" ? "428 threads" : "185 threads"}
                </Typography>
              </Grid>
            </Grid>

            <Divider />

            <Stack direction="row" spacing={1.5}>
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<TerminateIcon />}
                onClick={() => handleKillProcess(selectedProcess.pid)}
              >
                Kill Process
              </Button>
              <Button
                variant="outlined"
                color="warning"
                size="small"
                startIcon={<PauseRoundedIcon />}
                disabled={selectedProcess?.risk === "suspended"}
                onClick={() => handleSuspendProcess(selectedProcess.pid)}
              >
                {selectedProcess?.risk === "suspended" ? "Suspended" : "Suspend Process"}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                size="small"
                startIcon={<AutoAwesomeRoundedIcon />}
                onClick={() => handleAIAnalyzeProcess(selectedProcess.name, selectedProcess.pid)}
                disabled={aiLoading}
              >
                {aiLoading ? "Consulting local AI..." : "AI Explain Behavior"}
              </Button>
            </Stack>

            {aiAnalysisResult && (
              <Paper sx={{ p: 2, bgcolor: "rgba(156, 39, 176, 0.05)", border: "1px solid rgba(156, 39, 176, 0.2)", borderRadius: 2 }}>
                <Typography variant="subtitle2" color="secondary.light" fontWeight={700} gutterBottom>
                  Local AI Diagnostic Summary ({aiAnalysisResult.confidence.toUpperCase()} confidence):
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {aiAnalysisResult.summary}
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>
                  Recommended Remediation Steps:
                </Typography>
                <List dense disablePadding sx={{ mt: 0.5 }}>
                  {aiAnalysisResult.actions.map((action: string, idx: number) => (
                    <ListItem key={idx} sx={{ py: 0.2, px: 0 }}>
                      <Typography variant="caption" color="text.secondary">• {action}</Typography>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setSelectedProcess(null);
            setAiAnalysisResult(null);
          }}>Close Triage</Button>
        </DialogActions>
      </Dialog>

      {/* Alert Detail Dialog Modal */}
      <Dialog
        open={!!selectedAlert}
        onClose={() => setSelectedAlert(null)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            bgcolor: "background.paper",
            borderRadius: 3,
            border: "1px solid rgba(255,255,255,0.1)",
          },
        }}
      >
        <DialogTitle>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="h6" fontWeight={700}>
              Security Alert #{selectedAlert?.id}
            </Typography>
            <Chip label={selectedAlert?.severity.toUpperCase()} color={selectedAlert?.severity === "high" ? "error" : "warning"} size="small" />
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Typography variant="subtitle1" fontWeight={700}>
              {selectedAlert?.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedAlert?.description}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Source module: {selectedAlert?.source} | Timestamp: {selectedAlert?.created_at}
            </Typography>
            <Box sx={{ p: 1.5, bgcolor: "rgba(255,255,255,0.03)", borderRadius: 2, border: "1px solid rgba(255,255,255,0.06)" }}>
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                MITRE ATT&CK Matrix Mapping:
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                • Execution (T1059.001) - Command and Scripting Interpreter: PowerShell
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              // Simulate isolating threat
              setData((prev) => ({
                ...prev,
                alerts: prev.alerts.map((a) => a.id === selectedAlert.id ? { ...a, status: "contained" } : a)
              }));
              setSelectedAlert(null);
            }}
            variant="contained"
            color="error"
          >
            Quarantine & Contain
          </Button>
          <Button onClick={() => setSelectedAlert(null)}>Dismiss Alert</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};
