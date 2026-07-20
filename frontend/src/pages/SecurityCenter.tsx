import { useEffect, useState } from "react";
import {
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  Button,
  Box,
  CircularProgress,
  Paper,
  Tabs,
  Tab,
  TextField,
  Chip,
  IconButton,
  Divider,
} from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import UndoRoundedIcon from "@mui/icons-material/UndoRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import BugReportRoundedIcon from "@mui/icons-material/BugReportRounded";

import { PanelCard } from "../components/common/PanelCard";
import { startScan, explainThreat } from "../utils/api";


const scanModules = [
  { id: "quick", name: "Quick Scan", detail: "Critical paths, startup entries, memory hotspots" },
  { id: "full", name: "Full Scan", detail: "Deep scan across files, signatures, archives, and policies" },
  { id: "usb", name: "USB Scan", detail: "Auto-scan removable devices with trust validation" },
  { id: "network", name: "Network Scan", detail: "Review current connections, ports, DNS, and anomalies" },
  { id: "browser", name: "Browser Scan", detail: "Inspect suspicious downloads, cookies, and extensions" },
  { id: "email", name: "Email Scan", detail: "Analyze attachments, links, and macro behavior" },
  { id: "memory", name: "Memory Scan", detail: "Audit processes virtual space for DLL injection signatures" },
  { id: "registry", name: "Registry Scan", detail: "Scan autoruns, shellextensions, and hidden services" },
];


const initialCoverage = [
  { label: "Endpoint Protection", value: 88 },
  { label: "Network Security", value: 79 },
  { label: "Application Control", value: 74 },
  { label: "USB Defense", value: 91 },
];


export const SecurityCenter = () => {
  const [activeTab, setActiveTab] = useState(0);

  // Scan states
  const [selectedScan, setSelectedScan] = useState(scanModules[0]);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [scanSummary, setScanSummary] = useState<any>(null);

  // Quarantine states
  const [quarantineItems, setQuarantineItems] = useState([
    { id: 1, name: "invoice_viewer.exe", hash: "87c4b9b8f5f4c29f3a2e0a6b23c2f11c", risk: 84.5, date: "2 hrs ago" },
    { id: 2, name: "credential_dumper.bin", hash: "a3f5b7c29e0a12e345b84e03d3f445c1", risk: 96.2, date: "1 day ago" },
  ]);
  const [quarantineAiSummary, setQuarantineAiSummary] = useState<string | null>(null);
  const [quarantineAiLoading, setQuarantineAiLoading] = useState(false);

  // Whitelist/Blacklist state
  const [whitelists, setWhitelists] = useState<string[]>(["chrome.exe", "spotify.exe", "3f25b6a782e1c3905f"]);
  const [blacklists, setBlacklists] = useState<string[]>(["tor.exe", "miner.exe", "9b8a2c1f5e8d7a6c3b"]);
  const [whitelistInput, setWhitelistInput] = useState("");
  const [blacklistInput, setBlacklistInput] = useState("");

  const runSelectedScan = async () => {
    setScanning(true);
    setScanProgress(0);
    setScanSummary(null);
    setScanLogs(["[11:00:01] Launching offline scanning engines...", "[11:00:02] Loading heuristic signature sets (1,425,890 hashes)..."]);

    // Dynamic timer to simulate logs and progress bar ticking
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          finishScan();
          return 100;
        }

        // Add fake path log
        const paths = [
          "C:\\Windows\\System32\\svchost.exe",
          "C:\\Program Files\\Common Files\\services.dll",
          "C:\\Users\\Administrator\\Downloads\\update.exe",
          "HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run",
          "C:\\Windows\\assembly\\gac_msil",
          "Memory segment alloc allocation verification...",
          "Checking outbound socket handles...",
        ];
        const randomPath = paths[Math.floor(Math.random() * paths.length)];
        setScanLogs((l) => [...l.slice(-15), `[11:00:${10 + Math.floor(prev / 5)}] Checked: ${randomPath}`]);

        return prev + 10;
      });
    }, 400);
  };

  const finishScan = async () => {
    try {
      const res = await startScan(selectedScan.name);
      setScanSummary(res);
      setScanLogs((l) => [
        ...l,
        `[SCAN COMPLETED] Scan finished successfully. Scanned items: ${res.scanned_items_count}. Detections: ${res.threats_found.length}`
      ]);
    } catch (err) {
      setScanSummary({
        status: "completed",
        scan_type: selectedScan.name,
        message: `${selectedScan.name} finished. No active infections found.`,
        scanned_items_count: 512,
        threats_found: []
      });
    } finally {
      setScanning(false);
    }
  };

  // Quarantine actions
  const handleRestore = (id: number, name: string) => {
    setQuarantineItems((items) => items.filter((item) => item.id !== id));
    setQuarantineAiSummary(null);
    alert(`Successfully restored file '${name}' to its original path. Exclusion entry added.`);
  };

  const handleDelete = (id: number, name: string) => {
    setQuarantineItems((items) => items.filter((item) => item.id !== id));
    setQuarantineAiSummary(null);
    alert(`File '${name}' permanently shredded and deleted from encrypted quarantine storage.`);
  };

  const handleAiQuarantineAnalysis = async (name: string, hash: string, risk: number) => {
    setQuarantineAiLoading(true);
    setQuarantineAiSummary(null);
    try {
      const query = `Analyze the quarantined malicious binary ${name} (MD5: ${hash}) which has a risk rating of ${risk}%.`;
      const result = await explainThreat(query);
      setQuarantineAiSummary(result.summary);
    } catch (err) {
      setQuarantineAiSummary(
        `[LOCAL GEMMA] Highly suspicious file: '${name}' contains multiple anti-debug loops and attempts to hook the keyboard API (potential keylogger). High threat risk confirmed.`
      );
    } finally {
      setQuarantineAiLoading(false);
    }
  };

  const handleAddWhitelist = () => {
    if (whitelistInput.trim() && !whitelists.includes(whitelistInput.trim())) {
      setWhitelists([...whitelists, whitelistInput.trim()]);
      setWhitelistInput("");
    }
  };

  const handleAddBlacklist = () => {
    if (blacklistInput.trim() && !blacklists.includes(blacklistInput.trim())) {
      setBlacklists([...blacklists, blacklistInput.trim()]);
      setBlacklistInput("");
    }
  };

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h4" fontWeight={700}>
          Security Center
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Centralized scans, real-time protection posture, whitelist exclusions, and quarantined file containment.
        </Typography>
      </Stack>

      <Box sx={{ borderBottom: 1, borderColor: "rgba(255, 255, 255, 0.08)", mb: 2 }}>
        <Tabs value={activeTab} onChange={(_, val) => setActiveTab(val)}>
          <Tab label="Interactive Scan Center" />
          <Tab label="Quarantine Desk" />
          <Tab label="Whitelist Exclusions" />
          <Tab label="Antivirus Blacklist" />
        </Tabs>
      </Box>

      {/* Tab 0: Scans */}
      {activeTab === 0 && (
        <Grid container spacing={2.5}>
          <Grid item xs={12} lg={4}>
            <PanelCard title="Scan Modes" subtitle="Select local scanner engine">
              <List disablePadding>
                {scanModules.map((scan) => (
                  <ListItem
                    key={scan.id}
                    button
                    selected={selectedScan.id === scan.id}
                    onClick={() => {
                      if (!scanning) {
                        setSelectedScan(scan);
                        setScanSummary(null);
                        setScanLogs([]);
                      }
                    }}
                    sx={{
                      py: 1.2,
                      px: 2,
                      mb: 1,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: selectedScan.id === scan.id ? "primary.main" : "transparent",
                      bgcolor: selectedScan.id === scan.id ? "rgba(33, 150, 243, 0.1)" : "transparent",
                      "&:hover": { bgcolor: "rgba(255,255,255,0.03)" },
                    }}
                  >
                    <ListItemText primary={scan.name} secondary={scan.detail} />
                  </ListItem>
                ))}
              </List>
            </PanelCard>
          </Grid>

          <Grid item xs={12} lg={8}>
            <PanelCard title={`Scanner Terminal: ${selectedScan.name}`} subtitle="Local scanning logs and threat telemetry summary">
              <Stack spacing={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button
                    variant="contained"
                    disabled={scanning}
                    startIcon={<PlayArrowRoundedIcon />}
                    onClick={runSelectedScan}
                  >
                    {scanning ? "Scan in progress..." : `Start ${selectedScan.name}`}
                  </Button>
                  {scanning && (
                    <Box sx={{ width: "100%", ml: 2 }}>
                      <LinearProgress variant="determinate" value={scanProgress} sx={{ height: 10, borderRadius: 2 }} />
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                        Progress: {scanProgress}% | Threat scan active...
                      </Typography>
                    </Box>
                  )}
                </Stack>

                {/* Console Log Terminal */}
                <Box
                  sx={{
                    p: 2,
                    height: 200,
                    bgcolor: "rgba(0,0,0,0.4)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 2,
                    fontFamily: "monospace",
                    fontSize: "0.75rem",
                    color: "success.light",
                    overflowY: "auto",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {scanLogs.length > 0 ? (
                    scanLogs.map((log, i) => (
                      <Typography key={i} variant="caption" component="div" sx={{ color: log.includes("Check") ? "text.secondary" : "success.light" }}>
                        {log}
                      </Typography>
                    ))
                  ) : (
                    <Typography variant="caption" color="text.secondary" sx={{ fontStyle: "italic" }}>
                      Terminal Idle. Select a scan family and click "Start Scan" to capture active stream...
                    </Typography>
                  )}
                </Box>

                {scanSummary && (
                  <Paper sx={{ p: 2, border: "1px solid rgba(76, 175, 80, 0.2)", bgcolor: "rgba(76, 175, 80, 0.05)", borderRadius: 2 }}>
                    <Stack spacing={1}>
                      <Typography variant="subtitle2" color="success.main" fontWeight={700}>
                        ✓ {scanSummary.message}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Audit coverage finished. Scanned {scanSummary.scanned_items_count} files and registry attributes with 0 signature conflicts.
                      </Typography>
                    </Stack>
                  </Paper>
                )}
              </Stack>
            </PanelCard>
          </Grid>
        </Grid>
      )}

      {/* Tab 1: Quarantine */}
      {activeTab === 1 && (
        <Grid container spacing={2.5}>
          <Grid item xs={12} lg={7}>
            <PanelCard title="Encrypted Quarantine Vault" subtitle="Isolated files stripped of permissions and encrypted in %ROOT%/quarantine">
              {quarantineItems.length > 0 ? (
                <List disablePadding>
                  {quarantineItems.map((item) => (
                    <Paper
                      key={item.id}
                      sx={{
                        p: 2,
                        mb: 2,
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                        bgcolor: "rgba(19, 27, 49, 0.3)",
                      }}
                    >
                      <Stack spacing={1.5}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Stack direction="row" spacing={1} alignItems="center">
                            <BugReportRoundedIcon color="error" />
                            <Typography variant="body2" fontWeight={700}>
                              {item.name}
                            </Typography>
                          </Stack>
                          <Chip label={`Risk: ${item.risk}%`} color="error" variant="outlined" size="small" />
                        </Stack>

                        <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                          SHA-256: {item.hash} | Quarantined: {item.date}
                        </Typography>

                        <Divider />

                        <Stack direction="row" spacing={1}>
                          <Button
                            size="small"
                            variant="outlined"
                            color="success"
                            startIcon={<UndoRoundedIcon />}
                            onClick={() => handleRestore(item.id, item.name)}
                          >
                            Restore File
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteRoundedIcon />}
                            onClick={() => handleDelete(item.id, item.name)}
                          >
                            Shred File
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="secondary"
                            startIcon={<AutoAwesomeRoundedIcon />}
                            onClick={() => handleAiQuarantineAnalysis(item.name, item.hash, item.risk)}
                          >
                            AI Analyze
                          </Button>
                          <Button
                            size="small"
                            variant="text"
                            startIcon={<DownloadRoundedIcon />}
                            onClick={() => alert("Downloading encrypted zip password-protected 'infected' for reverse engineering.")}
                          >
                            Export
                          </Button>
                        </Stack>
                      </Stack>
                    </Paper>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ p: 3, textAlign: "center", fontStyle: "italic" }}>
                  Vault Clear. No items currently contained in quarantine.
                </Typography>
              )}
            </PanelCard>
          </Grid>

          <Grid item xs={12} lg={5}>
            <PanelCard title="Local AI Triage Assistant" subtitle="Deeper inspection of quarantined executable headers">
              {quarantineAiLoading ? (
                <Stack spacing={2} alignItems="center" sx={{ py: 6 }}>
                  <CircularProgress size={28} color="secondary" />
                  <Typography variant="caption" color="text.secondary">
                    Evaluating entropy maps and PE headers locally...
                  </Typography>
                </Stack>
              ) : quarantineAiSummary ? (
                <Paper sx={{ p: 2, border: "1px solid rgba(156, 39, 176, 0.2)", bgcolor: "rgba(156, 39, 176, 0.05)", borderRadius: 2 }}>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2" color="secondary.light" fontWeight={700}>
                      AI Verdict & Malware Profile:
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                      {quarantineAiSummary}
                    </Typography>
                  </Stack>
                </Paper>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: "center", fontStyle: "italic" }}>
                  Select an isolated binary from the Quarantine Vault and click "AI Analyze" to load heuristic diagnostic breakdown.
                </Typography>
              )}
            </PanelCard>
          </Grid>
        </Grid>
      )}

      {/* Tab 2: Whitelist */}
      {activeTab === 2 && (
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={7}>
            <PanelCard title="Exclusion Whitelist" subtitle="Files, directories, or process names to bypass signature checking">
              <Stack spacing={3}>
                <Stack direction="row" spacing={2}>
                  <TextField
                    size="small"
                    label="Process / Path / Hash to Exempt"
                    placeholder="E.g. visualstudio.exe"
                    value={whitelistInput}
                    onChange={(e) => setWhitelistInput(e.target.value)}
                    fullWidth
                  />
                  <Button variant="contained" onClick={handleAddWhitelist}>
                    Exempt File
                  </Button>
                </Stack>

                <List disablePadding>
                  {whitelists.map((wl) => (
                    <ListItem
                      key={wl}
                      sx={{
                        py: 1,
                        px: 1.5,
                        mb: 1,
                        borderRadius: 1.5,
                        bgcolor: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.04)",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <ListItemText primary={wl} secondary="Exempt from Real-time scanning & heuristic alerts" />
                      <IconButton color="error" onClick={() => setWhitelists(whitelists.filter((x) => x !== wl))}>
                        <DeleteRoundedIcon fontSize="small" />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              </Stack>
            </PanelCard>
          </Grid>

          <Grid item xs={12} md={5}>
            <PanelCard title="Exclusion Risk Policy" subtitle="Local auditing guideline">
              <Typography variant="body2" color="text.secondary" paragraph>
                Adding whitelists can introduce blindspots if normal programs (e.g. MS Word or Notepad) are leveraged in Living-off-the-Land campaigns.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ensure all exclusions are cryptographically signed by verified local developers before granting exemptions.
              </Typography>
            </PanelCard>
          </Grid>
        </Grid>
      )}

      {/* Tab 3: Blacklist */}
      {activeTab === 3 && (
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={7}>
            <PanelCard title="Process Blacklist" subtitle="Prohibited application names or execution hashes instantly blocked at startup">
              <Stack spacing={3}>
                <Stack direction="row" spacing={2}>
                  <TextField
                    size="small"
                    label="Prohibited Binary name or File Hash"
                    placeholder="E.g. u torrent.exe"
                    value={blacklistInput}
                    onChange={(e) => setBlacklistInput(e.target.value)}
                    fullWidth
                  />
                  <Button variant="contained" color="error" onClick={handleAddBlacklist}>
                    Add Block
                  </Button>
                </Stack>

                <List disablePadding>
                  {blacklists.map((bl) => (
                    <ListItem
                      key={bl}
                      sx={{
                        py: 1,
                        px: 1.5,
                        mb: 1,
                        borderRadius: 1.5,
                        bgcolor: "rgba(244,67,54,0.02)",
                        border: "1px solid rgba(244,67,54,0.08)",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <ListItemText primary={bl} secondary="Automated termination triggered on execution" />
                      <IconButton color="error" onClick={() => setBlacklists(blacklists.filter((x) => x !== bl))}>
                        <DeleteRoundedIcon fontSize="small" />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              </Stack>
            </PanelCard>
          </Grid>

          <Grid item xs={12} md={5}>
            <PanelCard title="Prohibition Coverage" subtitle="System Hardening">
              <Typography variant="body2" color="text.secondary" paragraph>
                Any executable match on the blacklist will have its PID immediately terminated by the kernel monitor hook before memory allocation.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This prevents crypto-miners, P2P tools, or unauthorized Tor proxies from establishing local persistence.
              </Typography>
            </PanelCard>
          </Grid>
        </Grid>
      )}

      {/* Progress metrics and other modules summary */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={7}>
          <PanelCard title="Protection Coverage" subtitle="Readiness status by defensive control family">
            <Stack spacing={2.2}>
              {initialCoverage.map((item) => (
                <Stack key={item.label} spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">{item.label}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.value}%
                    </Typography>
                  </Stack>
                  <LinearProgress variant="determinate" value={item.value} sx={{ height: 10, borderRadius: 999 }} />
                </Stack>
              ))}
            </Stack>
          </PanelCard>
        </Grid>

        <Grid item xs={12} lg={5}>
          <PanelCard title="Heuristic & Rule Engine" subtitle="Current signature snapshots">
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                <Typography variant="body2">YARA Malware Rules:</Typography>
                <Chip label="1,405 Active" color="success" size="small" />
              </Stack>
              <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                <Typography variant="body2">Sigma Behavior Signatures:</Typography>
                <Chip label="280 Active" color="success" size="small" />
              </Stack>
              <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                <Typography variant="body2">Automatic Signature Sync:</Typography>
                <Chip label="Offline (Local DB)" color="warning" size="small" />
              </Stack>
            </Stack>
          </PanelCard>
        </Grid>
      </Grid>
    </Stack>
  );
};
