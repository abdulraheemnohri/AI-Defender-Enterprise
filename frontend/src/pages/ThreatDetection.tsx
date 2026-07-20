import { useState } from "react";
import {
  Grid,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  Switch,
  Slider,
  FormControlLabel,
  Divider,
  Paper,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@mui/material";
import RadarRoundedIcon from "@mui/icons-material/RadarRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import SettingsInputComponentRoundedIcon from "@mui/icons-material/SettingsInputComponentRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";

import { PanelCard } from "../components/common/PanelCard";
import { explainThreat } from "../utils/api";


const initialEngines = [
  { id: "behavior", name: "Behavior Engine", status: true, desc: "Monitors child-parent execution flows and anomalous APIs" },
  { id: "file", name: "File Engine", status: true, desc: "Inspects file entropy, digital signatures, and extension anomalies" },
  { id: "memory", name: "Memory Engine", status: true, desc: "Scans virtual threads allocation for DLL injections" },
  { id: "registry", name: "Registry Engine", status: true, desc: "Audits system autorun registry entries and persistence keys" },
  { id: "network", name: "Network Engine", status: true, desc: "Tracks port scanning, malicious connections, and DNS leaks" },
  { id: "kernel", name: "Kernel ETW Monitor", status: false, desc: "Receives raw Windows kernel tracing logs (requires admin reboot)" },
];


export const ThreatDetection = () => {
  // Engines status
  const [engines, setEngines] = useState(initialEngines);

  // Hardening Switches
  const [hardening, setHardening] = useState({
    appWhitelisting: true,
    codeIntegrity: true,
    processIsolation: true,
    exploitProtection: true,
    credentialProtection: true,
    folderAccess: false,
    tamperProtection: true,
  });

  // Slider levels
  const [heuristicSensitivity, setHeuristicSensitivity] = useState(75);

  // IDS alerts state
  const [idsAlerts, setIdsAlerts] = useState([
    {
      id: "ids-001",
      title: "Reverse Shell Signature Detected",
      category: "Reverse Shell",
      mitre: "Persistence (T1059)",
      severity: "critical",
      ip: "185.220.101.7:4444",
      desc: "Legitimate shell command cmd.exe established an active TCP handshaking on external port 4444 to low-reputation IP.",
    },
    {
      id: "ids-002",
      title: "Potential Port Scan Triggered",
      category: "Port Scan",
      mitre: "Discovery (T1046)",
      severity: "medium",
      ip: "10.0.0.124",
      desc: "Incoming host 10.0.0.124 probed 50 TCP ports in under 3 seconds. Blocked by active temporary firewall rule.",
    },
    {
      id: "ids-003",
      title: "Local Privilege Escalation attempt",
      category: "Privilege Escalation",
      mitre: "Privilege Escalation (T1068)",
      severity: "high",
      ip: "Localhost",
      desc: "Unsigned service binary attempted to write to system driver hive.",
    }
  ]);

  const [selectedIds, setSelectedIds] = useState<any>(null);
  const [aiRule, setAiRule] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const toggleEngine = (id: string) => {
    setEngines(engines.map((eng) => (eng.id === id ? { ...eng, status: !eng.status } : eng)));
  };

  const handleHardeningChange = (field: string) => {
    setHardening({
      ...hardening,
      [field]: !((hardening as any)[field]),
    });
  };

  const handleGenerateAiRuleForIds = async (alert: any) => {
    setAiLoading(true);
    setAiRule("");
    try {
      const query = `Write a defensive firewall or YARA rule to block this intrusion pattern: ${alert.title} targeting ${alert.ip}`;
      const res = await explainThreat(query);
      if (res.suggested_rules && res.suggested_rules.length > 0) {
        setAiRule(res.suggested_rules[0]);
      } else {
        setAiRule(
          `rule Detect_${alert.category.replace(" ", "_")} {\n  meta:\n    description = "AI Generated block for ${alert.title}"\n  strings:\n    $addr = "${alert.ip}"\n  condition:\n    any of them\n}`
        );
      }
    } catch (err) {
      setAiRule(
        `rule Detect_${alert.category.replace(" ", "_")} {\n  meta:\n    description = "AI Generated rule for ${alert.title}"\n  strings:\n    $addr = "${alert.ip}"\n  condition:\n    any of them\n}`
      );
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h4" fontWeight={700}>
          Threat Detection & Heuristics
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Configure real-time behavioral heuristic sensitivities, manage kernel engine monitors, and triage live intrusion detection (IDS) alarms.
        </Typography>
      </Stack>

      <Grid container spacing={2.5}>
        {/* Detection Engines Panel */}
        <Grid item xs={12} md={6}>
          <PanelCard title="Detection Engines Status" subtitle="Kernel-level hooks and telemetry collectors">
            <List disablePadding>
              {engines.map((engine) => (
                <ListItem
                  key={engine.id}
                  sx={{
                    py: 1.5,
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <ListItemText primary={engine.name} secondary={engine.desc} />
                  <Switch
                    checked={engine.status}
                    onChange={() => toggleEngine(engine.id)}
                    color="primary"
                  />
                </ListItem>
              ))}
            </List>
          </PanelCard>
        </Grid>

        {/* Endpoint Hardening Panel */}
        <Grid item xs={12} md={6}>
          <PanelCard title="Endpoint Exploit hardeners" subtitle="Windows OS vulnerability shielding configurations">
            <Stack spacing={2}>
              <FormControlLabel
                control={<Switch checked={hardening.appWhitelisting} onChange={() => handleHardeningChange("appWhitelisting")} />}
                label={
                  <Box>
                    <Typography variant="body2" fontWeight={700}>Application Whitelisting</Typography>
                    <Typography variant="caption" color="text.secondary">Allows only verified signed binaries to load</Typography>
                  </Box>
                }
                sx={{ mb: 1 }}
              />
              <FormControlLabel
                control={<Switch checked={hardening.codeIntegrity} onChange={() => handleHardeningChange("codeIntegrity")} />}
                label={
                  <Box>
                    <Typography variant="body2" fontWeight={700}>Code Integrity Verification</Typography>
                    <Typography variant="caption" color="text.secondary">Enforces cryptographic signature checks before thread scheduling</Typography>
                  </Box>
                }
                sx={{ mb: 1 }}
              />
              <FormControlLabel
                control={<Switch checked={hardening.processIsolation} onChange={() => handleHardeningChange("processIsolation")} />}
                label={
                  <Box>
                    <Typography variant="body2" fontWeight={700}>Process Memory Isolation (LSA Guard)</Typography>
                    <Typography variant="caption" color="text.secondary">Bypasses LSASS memory access from unsigned code</Typography>
                  </Box>
                }
                sx={{ mb: 1 }}
              />
              <FormControlLabel
                control={<Switch checked={hardening.exploitProtection} onChange={() => handleHardeningChange("exploitProtection")} />}
                label={
                  <Box>
                    <Typography variant="body2" fontWeight={700}>Exploit Protection (DEP/ASLR)</Typography>
                    <Typography variant="caption" color="text.secondary">Mitigates buffer overflows and memory address leaks</Typography>
                  </Box>
                }
                sx={{ mb: 1 }}
              />
              <FormControlLabel
                control={<Switch checked={hardening.credentialProtection} onChange={() => handleHardeningChange("credentialProtection")} />}
                label={
                  <Box>
                    <Typography variant="body2" fontWeight={700}>Credential Guard protection</Typography>
                    <Typography variant="caption" color="text.secondary">Isolates system hashes under virtual secure environment</Typography>
                  </Box>
                }
                sx={{ mb: 1 }}
              />
              <FormControlLabel
                control={<Switch checked={hardening.tamperProtection} onChange={() => handleHardeningChange("tamperProtection")} />}
                label={
                  <Box>
                    <Typography variant="body2" fontWeight={700}>Anti-Tampering Enforcement</Typography>
                    <Typography variant="caption" color="text.secondary">Prevents external scripts from stopping the AI Defender monitor service</Typography>
                  </Box>
                }
              />
            </Stack>
          </PanelCard>
        </Grid>
      </Grid>

      {/* Sensitivities and IDS Alarms */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={4}>
          <PanelCard title="Heuristic Model Tuning" subtitle="Self-learning rule sensitivity thresholds">
            <Stack spacing={4} sx={{ p: 1 }}>
              <Box>
                <Typography id="sensitivity-slider-label" variant="body2" fontWeight={700} gutterBottom>
                  Anomaly Detector Sensitivity: {heuristicSensitivity}%
                </Typography>
                <Slider
                  value={heuristicSensitivity}
                  onChange={(_, val) => setHeuristicSensitivity(val as number)}
                  aria-labelledby="sensitivity-slider-label"
                  color="secondary"
                  min={10}
                  max={99}
                />
                <Typography variant="caption" color="text.secondary">
                  {heuristicSensitivity > 80
                    ? "Extreme Mode: High-signal capture. May trigger false-positives on internal developer build tools."
                    : heuristicSensitivity > 50
                    ? "Standard Enterprise Baseline: Highly stable with balanced AI behavioral triage."
                    : "Relaxed Mode: Low auditing overhead. Recommended only for offline test sandboxes."}
                </Typography>
              </Box>

              <Paper sx={{ p: 2, border: "1px dashed rgba(255,255,255,0.1)", bgcolor: "rgba(0,0,0,0.2)" }}>
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <ShieldRoundedIcon color="secondary" />
                    <Typography variant="body2" fontWeight={700}>Local AI Sandbox Status</Typography>
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    Any executable failing hash signature lookup is automatically run in our isolated local sandbox environment to record behavioral registry footprint before execution.
                  </Typography>
                </Stack>
              </Paper>
            </Stack>
          </PanelCard>
        </Grid>

        <Grid item xs={12} lg={8}>
            <PanelCard title="Live Intrusion Detection System (IDS) Logs" subtitle="Unusual network handshake and pivoting activity alerts. Click any event to triage.">
              <List disablePadding>
                {idsAlerts.map((alert) => (
                  <Paper
                    key={alert.id}
                    onClick={() => {
                      setSelectedIds(alert);
                      setAiRule("");
                    }}
                    sx={{
                      p: 2,
                      mb: 1.5,
                      cursor: "pointer",
                      border: "1px solid rgba(255,255,255,0.06)",
                      bgcolor: "rgba(19, 27, 49, 0.3)",
                      "&:hover": {
                        bgcolor: "rgba(156, 39, 176, 0.05)",
                        borderColor: "rgba(156, 39, 176, 0.3)",
                      },
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Stack spacing={0.5}>
                        <Typography variant="body2" fontWeight={700}>
                          {alert.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Category: {alert.category} | MITRE: {alert.mitre}
                        </Typography>
                      </Stack>
                      <Chip
                        label={alert.severity.toUpperCase()}
                        color={alert.severity === "critical" ? "error" : "warning"}
                        size="small"
                      />
                    </Stack>
                  </Paper>
                ))}
              </List>
            </PanelCard>
          </Grid>
        </Grid>

        {/* IDS Event Triage Dialog Modal */}
        <Dialog
          open={!!selectedIds}
          onClose={() => {
            setSelectedIds(null);
            setAiRule("");
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
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" fontWeight={700}>
                IDS Incident Investigation: {selectedIds?.category}
              </Typography>
              <Chip label={selectedIds?.severity.toUpperCase()} color={selectedIds?.severity === "critical" ? "error" : "warning"} size="small" />
            </Stack>
          </DialogTitle>
          <DialogContent dividers sx={{ pb: 3 }}>
            <Stack spacing={2.5}>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>
                  Alarm Trigger Summary:
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {selectedIds?.desc}
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Target / Source IP</Typography>
                  <Typography variant="body2" fontWeight={600}>{selectedIds?.ip}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">MITRE ATT&CK Mapping</Typography>
                  <Typography variant="body2" fontWeight={600} color="secondary.light">{selectedIds?.mitre}</Typography>
                </Grid>
              </Grid>

              <Divider />

              <Stack direction="row" spacing={1.5}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  startIcon={<AutoAwesomeRoundedIcon />}
                  onClick={() => handleGenerateAiRuleForIds(selectedIds)}
                  disabled={aiLoading}
                >
                  {aiLoading ? "Generating Code..." : "AI Generate Block Rule"}
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => {
                    alert(`Host telemetry isolated. Local connections to IP ${selectedIds?.ip} blocked on the kernel firewall.`);
                    setSelectedIds(null);
                  }}
                >
                  Isolate Interface
                </Button>
              </Stack>

              {aiRule && (
                <Paper sx={{ p: 2, bgcolor: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 2 }}>
                  <Typography variant="caption" color="secondary.light" fontWeight={700} display="block" sx={{ mb: 1 }}>
                    Generated Block Rule (YARA/Sigma compatible):
                  </Typography>
                  <Box
                    component="pre"
                    sx={{
                      m: 0,
                      p: 1.5,
                      bgcolor: "rgba(0,0,0,0.4)",
                      borderRadius: 1.5,
                      fontFamily: "monospace",
                      fontSize: "0.75rem",
                      color: "primary.light",
                      overflowX: "auto",
                    }}
                  >
                    {aiRule}
                  </Box>
                  <Button
                    size="small"
                    color="primary"
                    sx={{ mt: 1.5, textTransform: "none" }}
                    onClick={() => {
                      alert("Rule promoted and loaded into active heuristics database.");
                      setSelectedIds(null);
                    }}
                  >
                    ✓ Load & Enforce Rule Locally
                  </Button>
                </Paper>
              )}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setSelectedIds(null);
              setAiRule("");
            }}>Dismiss Alarm</Button>
          </DialogActions>
        </Dialog>
    </Stack>
  );
};
