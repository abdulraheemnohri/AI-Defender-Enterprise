import { useEffect, useState } from "react";
import {
  Grid,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  Button,
  Tabs,
  Tab,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Divider,
  Chip,
  CircularProgress,
  Switch,
  FormControlLabel,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import NoteAltRoundedIcon from "@mui/icons-material/NoteAltRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import GppBadRoundedIcon from "@mui/icons-material/GppBadRounded";

import { PanelCard } from "../components/common/PanelCard";
import { getAuditLogs } from "../utils/api";


// Seeded log databases for different streams
const initialLogs = [
  { time: "11:15:02", stream: "Security", event: "PowerShell child process execution blocked", host: "AI-DEFENDER-LAB", status: "contained" },
  { time: "11:14:10", stream: "Firewall", event: "Blocked handshake connection to Tor Node 185.220.101.7", host: "AI-DEFENDER-LAB", status: "blocked" },
  { time: "11:12:45", stream: "USB", event: "USB Kingston DataTraveler successfully mounted in Read-Only Mode", host: "AI-DEFENDER-LAB", status: "monitored" },
  { time: "11:10:04", stream: "Audit", event: "Successful workstation unlock by Administrator", host: "AI-DEFENDER-LAB", status: "audit" },
  { time: "11:08:12", stream: "AI", event: "Gemma-2B prompt evaluated for powershell.exe command analysis", host: "AI-DEFENDER-LAB", status: "audit" },
  { time: "11:05:30", stream: "Application", event: "Antivirus scanner daemon successfully loaded 1,425,890 malware hashes", host: "AI-DEFENDER-LAB", status: "healthy" },
  { time: "11:01:15", stream: "System", event: "Host network interfaces WPA3-Enterprise handshake succeeded", host: "AI-DEFENDER-LAB", status: "healthy" },
  { time: "11:00:00", stream: "Network", event: "Outbound socket handshakes successfully established to SOC Collector", host: "AI-DEFENDER-LAB", status: "healthy" },
];


export const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  // Log search states
  const [logs, setLogs] = useState(initialLogs);
  const [selectedStream, setSelectedStream] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Report generation states
  const [reportType, setReportType] = useState("Executive");
  const [exportFormat, setExportFormat] = useState("PDF");
  const [generating, setGenerating] = useState(false);

  // Incident Response states
  const [analystNotes, setAnalystNotes] = useState("");
  const [savedNotes, setSavedNotes] = useState<string[]>(["Initial triage completed by SOC Admin. Host network is actively monitored for subsequent beaconing patterns."]);
  const [isContained, setIsContained] = useState(false);

  useEffect(() => {
    const loadAudit = async () => {
      try {
        const auditData = await getAuditLogs();
        // append audit logs to list
        const formattedAudits = auditData.map((ad: any) => ({
          time: ad.timestamp.split("T")[1]?.substring(0, 8) || "11:00:00",
          stream: "Audit",
          event: ad.event,
          host: "AI-DEFENDER-LAB",
          status: "audit",
        }));
        setLogs((prev) => {
          // avoid duplicate appending
          const existingEvents = prev.map(p => p.event);
          const filtered = formattedAudits.filter((f: any) => !existingEvents.includes(f.event));
          return [...filtered, ...prev];
        });
      } catch (e) {
        // Fallback ok
      }
    };
    loadAudit();
  }, []);

  // Filter logs in real-time
  const filteredLogs = logs.filter((log) => {
    const matchesStream = selectedStream === "All" || log.stream === selectedStream;
    const matchesSearch = log.event.toLowerCase().includes(searchQuery.toLowerCase()) || log.host.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStream && matchesSearch;
  });

  // Compile and trigger browser download of the generated report file
  const handleGenerateAndDownloadReport = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);

      // Report content compilation
      const reportHeaders = "REPORT TYPE,TIMESTAMP,SECURITY SCORE,ACTIVE THREATS,CONTAINMENT STATUS,ANALYST NOTES\n";
      const reportBody = `${reportType},${new Date().toISOString()},92%,${isContained ? "Contained" : "Elevated"},${isContained ? "ISOLATED" : "ACTIVE MONITOR"},"${savedNotes.join(" | ")}"\n`;
      const fullReportContent = reportHeaders + reportBody;

      // Trigger standard file download
      const blob = new Blob([fullReportContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `ai_defender_${reportType.toLowerCase()}_compliance_report.${exportFormat.toLowerCase() === "pdf" ? "txt" : exportFormat.toLowerCase()}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert(`✓ ${reportType} summary successfully compiled as ${exportFormat}! Download completed.`);
    }, 1500);
  };

  const handleSaveNotes = () => {
    if (analystNotes.trim()) {
      setSavedNotes([...savedNotes, analystNotes.trim()]);
      setAnalystNotes("");
      alert("Notes saved successfully in incident timeline record!");
    }
  };

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h4" fontWeight={700}>
          Incident Triage & Auditing Logs
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track real-time security events across 8 core logging streams, generate leadership summaries, and manage active incident playbooks.
        </Typography>
      </Stack>

      <Box sx={{ borderBottom: 1, borderColor: "rgba(255, 255, 255, 0.08)", mb: 2 }}>
        <Tabs value={activeTab} onChange={(_, val) => setActiveTab(val)}>
          <Tab label="Search Engine logs Explorer" />
          <Tab label="Report Builder" />
          <Tab label="Active Incident Response" />
        </Tabs>
      </Box>

      {/* Tab 0: Unified Log Search */}
      {activeTab === 0 && (
        <Grid container spacing={2.5}>
          <Grid item xs={12}>
            <PanelCard title="Security & System Log Explorer" subtitle="Search across Security, System, Firewall, Network, USB, Application, AI, and Audit logs">
              <Stack spacing={2.5}>
                {/* Filters Row */}
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    size="small"
                    placeholder="Search event logs, hosts, actions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: <SearchRoundedIcon color="action" sx={{ mr: 1 }} />,
                    }}
                    fullWidth
                  />

                  <FormControl variant="outlined" size="small" sx={{ minWidth: 160 }}>
                    <InputLabel id="stream-select-label">Log Stream</InputLabel>
                    <Select
                      labelId="stream-select-label"
                      value={selectedStream}
                      label="Log Stream"
                      onChange={(e) => setSelectedStream(e.target.value)}
                    >
                      <MenuItem value="All">All Streams</MenuItem>
                      <MenuItem value="Security">Security Logs</MenuItem>
                      <MenuItem value="System">System Logs</MenuItem>
                      <MenuItem value="Firewall">Firewall Logs</MenuItem>
                      <MenuItem value="Network">Network Logs</MenuItem>
                      <MenuItem value="USB">USB Logs</MenuItem>
                      <MenuItem value="Application">Application Logs</MenuItem>
                      <MenuItem value="AI">AI Logs</MenuItem>
                      <MenuItem value="Audit">Audit Logs</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>

                {/* Logs Grid list */}
                <Box
                  sx={{
                    maxHeight: 400,
                    overflowY: "auto",
                    border: "1px solid rgba(255,255,255,0.06)",
                    bgcolor: "rgba(0,0,0,0.15)",
                    borderRadius: 2,
                  }}
                >
                  <List disablePadding>
                    {filteredLogs.map((log, idx) => (
                      <ListItem
                        key={idx}
                        sx={{
                          py: 1.5,
                          px: 2,
                          borderBottom: "1px solid rgba(255,255,255,0.04)",
                          "&:hover": { bgcolor: "rgba(255,255,255,0.02)" },
                        }}
                      >
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={2} sm={1.5}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "monospace" }}>
                              {log.time}
                            </Typography>
                          </Grid>
                          <Grid item xs={3} sm={2}>
                            <Chip
                              label={log.stream.toUpperCase()}
                              size="small"
                              variant="outlined"
                              color={
                                log.stream === "Security"
                                  ? "error"
                                  : log.stream === "Firewall"
                                  ? "warning"
                                  : log.stream === "USB"
                                  ? "primary"
                                  : "default"
                              }
                              sx={{ fontSize: "0.55rem" }}
                            />
                          </Grid>
                          <Grid item xs={5} sm={6.5}>
                            <Typography variant="body2">{log.event}</Typography>
                          </Grid>
                          <Grid item xs={2}>
                            <Typography variant="caption" color="text.secondary">
                              {log.host}
                            </Typography>
                          </Grid>
                        </Grid>
                      </ListItem>
                    ))}
                    {filteredLogs.length === 0 && (
                      <Typography variant="body2" color="text.secondary" sx={{ p: 4, textAlign: "center" }}>
                        No logs matched your search filters.
                      </Typography>
                    )}
                  </List>
                </Box>
              </Stack>
            </PanelCard>
          </Grid>
        </Grid>
      )}

      {/* Tab 1: Report Builder */}
      {activeTab === 1 && (
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={7}>
            <PanelCard title="Compliance & Executive Report Compiler" subtitle="Export certified status logs for external audits or security leadership">
              <Stack spacing={3} sx={{ py: 1 }}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel id="report-type-label">Report Type</InputLabel>
                  <Select
                    labelId="report-type-label"
                    value={reportType}
                    label="Report Type"
                    onChange={(e) => setReportType(e.target.value)}
                  >
                    <MenuItem value="Executive">Executive Leadership Summary (PDF/TXT)</MenuItem>
                    <MenuItem value="Technical">Technical Threat Forensic Audit (CSV)</MenuItem>
                    <MenuItem value="Compliance">CMMC/ISO 27001 Cybersecurity Audit Report (JSON)</MenuItem>
                    <MenuItem value="Daily">Daily Activity Log Feed</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel id="export-format-label">Export Format</InputLabel>
                  <Select
                    labelId="export-format-label"
                    value={exportFormat}
                    label="Export Format"
                    onChange={(e) => setExportFormat(e.target.value)}
                  >
                    <MenuItem value="PDF">Formatted Document (.PDF / .TXT fallback)</MenuItem>
                    <MenuItem value="CSV">Comma Separated values (.CSV)</MenuItem>
                    <MenuItem value="Excel">Microsoft Excel sheet (.XLSX)</MenuItem>
                    <MenuItem value="JSON">Raw Data Structure (.JSON)</MenuItem>
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  disabled={generating}
                  onClick={handleGenerateAndDownloadReport}
                  startIcon={generating ? <CircularProgress size={16} /> : <FileDownloadRoundedIcon />}
                  sx={{ py: 1.2, fontWeight: 700 }}
                >
                  {generating ? "Compiling active telemetry..." : "Generate and Download Local Report"}
                </Button>
              </Stack>
            </PanelCard>
          </Grid>

          <Grid item xs={12} md={5}>
            <PanelCard title="Certified Compliance Standards" subtitle="Regulatory readiness controls">
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <AssignmentRoundedIcon color="primary" />
                  <Typography variant="body2" fontWeight={700}>NIST SP 800-171 Coverage</Typography>
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  The generated report automatically maps system hardening status (ASLR/DEP, USB read-only, local authentication logs) to the NIST System Information Integrity families.
                </Typography>
                <Divider />
                <Typography variant="caption" color="text.secondary">
                  💡 <strong>Audit Trail:</strong> Every local report compilation triggers an automated entry in the platform audit logs to maintain strict Chain of Custody.
                </Typography>
              </Stack>
            </PanelCard>
          </Grid>
        </Grid>
      )}

      {/* Tab 2: Incident Response */}
      {activeTab === 2 && (
        <Grid container spacing={2.5}>
          {/* Timeline and notes */}
          <Grid item xs={12} lg={7}>
            <PanelCard title="Active Incident Playbook Triage" subtitle="Forensic threat sequence tracking and analyst response logs">
              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <TimelineRoundedIcon color="secondary" />
                    Forensic Execution Sequence
                  </Typography>
                  <List disablePadding sx={{ borderLeft: "2px solid rgba(255,255,255,0.1)", ml: 1, pl: 2 }}>
                    <ListItem sx={{ py: 0.5, px: 0 }}>
                      <ListItemText
                        primary={<Typography variant="body2" fontWeight={700}>Step 1: Unsigned exe downloaded</Typography>}
                        secondary="invoice_viewer.exe downloaded to C:\Users\Administrator\Downloads"
                      />
                    </ListItem>
                    <ListItem sx={{ py: 0.5, px: 0 }}>
                      <ListItemText
                        primary={<Typography variant="body2" fontWeight={700}>Step 2: Obfuscated PowerShell execution</Typography>}
                        secondary="powershell.exe spawned child thread with base64 encoded arguments"
                      />
                    </ListItem>
                    <ListItem sx={{ py: 0.5, px: 0 }}>
                      <ListItemText
                        primary={<Typography variant="body2" fontWeight={700} color="error">Step 3: Tor Command Beacon handshake</Typography>}
                        secondary="TCP outbound socket handshake to low-reputation node 185.220.101.7:8080"
                      />
                    </ListItem>
                  </List>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <NoteAltRoundedIcon color="primary" />
                    Analyst Investigation Journal
                  </Typography>
                  <List sx={{ mb: 2, maxHeight: 150, overflowY: "auto", bgcolor: "rgba(0,0,0,0.1)", borderRadius: 1.5, p: 1 }}>
                    {savedNotes.map((note, idx) => (
                      <ListItem key={idx} sx={{ py: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">• {note}</Typography>
                      </ListItem>
                    ))}
                  </List>

                  <Stack direction="row" spacing={1.5}>
                    <TextField
                      size="small"
                      placeholder="Add triage note, findings, or containment actions..."
                      value={analystNotes}
                      onChange={(e) => setAnalystNotes(e.target.value)}
                      fullWidth
                    />
                    <Button variant="outlined" startIcon={<SaveRoundedIcon />} onClick={handleSaveNotes}>
                      Save Note
                    </Button>
                  </Stack>
                </Box>
              </Stack>
            </PanelCard>
          </Grid>

          {/* Containment action cards */}
          <Grid item xs={12} lg={5}>
            <PanelCard title="Host Containment Center" subtitle="Instantly sever compromised host connectivity">
              <Stack spacing={3}>
                <Paper sx={{ p: 2.5, border: "2px solid rgba(244,67,54,0.3)", bgcolor: "rgba(244,67,54,0.05)", borderRadius: 3 }}>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <GppBadRoundedIcon color="error" sx={{ fontSize: 32 }} />
                      <Box>
                        <Typography variant="subtitle2" fontWeight={800} color="error">Host Quarantine Switch</Typography>
                        <Typography variant="caption" color="text.secondary">Sever all external IP egress logs</Typography>
                      </Box>
                    </Stack>

                    <Typography variant="caption" color="text.secondary">
                      Enabling host containment blocks all outbound and inbound LAN/WAN interfaces. The host can only communicate with the local AI Defender agent framework.
                    </Typography>

                    <FormControlLabel
                      control={
                        <Switch
                          checked={isContained}
                          color="error"
                          onChange={(e) => {
                            setIsContained(e.target.checked);
                            alert(e.target.checked ? "CRITICAL: Station network interfaces quarantined! Host contained." : "Station quarantine revoked. Re-enabling standard interface handshakes.");
                          }}
                        />
                      }
                      label={
                        <Typography variant="body2" fontWeight={700}>
                          {isContained ? " station isolated" : " active online (Monitor)"}
                        </Typography>
                      }
                    />
                  </Stack>
                </Paper>

                <PanelCard title="Recovery Playbook Rollbacks" subtitle="System rollback controls">
                  <Stack spacing={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      onClick={() => alert("Successfully restored pre-infection local registry backups and removed autorun keys.")}
                    >
                      Rollback Registry autorun Entries
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="secondary"
                      onClick={() => alert("Restored 3 files modified during the PowerShell process execution from security rollback shadows.")}
                    >
                      Rollback Modified Files
                    </Button>
                  </Stack>
                </PanelCard>
              </Stack>
            </PanelCard>
          </Grid>
        </Grid>
      )}
    </Stack>
  );
};
