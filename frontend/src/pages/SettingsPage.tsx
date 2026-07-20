import { useState } from "react";
import {
  Grid,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  Tabs,
  Tab,
  Box,
  Switch,
  FormControlLabel,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import ComputerRoundedIcon from "@mui/icons-material/ComputerRounded";
import FolderSharedRoundedIcon from "@mui/icons-material/FolderSharedRounded";
import CloudSyncRoundedIcon from "@mui/icons-material/CloudSyncRounded";
import KeyboardRoundedIcon from "@mui/icons-material/KeyboardRounded";
import SettingsInputHdmiRoundedIcon from "@mui/icons-material/SettingsInputHdmiRounded";
import BugReportRoundedIcon from "@mui/icons-material/BugReportRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

import { PanelCard } from "../components/common/PanelCard";


// Mock Asset Inventory
const initialAssets = [
  { id: "ast-101", hostname: "AI-DEFENDER-LAB", department: "SOC Research", os: "Windows 11 Enterprise", tag: "Primary Workstation" },
  { id: "ast-102", hostname: "HR-SECURE-STATION", department: "Human Resources", os: "Windows 11 Pro", tag: "Restricted Data" },
  { id: "ast-103", hostname: "SOC-GATEWAY-04", department: "Infrastructure", os: "Ubuntu Server 22.04", tag: "Egress Proxy" },
];


export const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  // General States
  const [toastAlerts, setToastAlerts] = useState(true);
  const [auditingDepth, setAuditingDepth] = useState("Detailed");

  // User RBAC States
  const [activeRole, setActiveRole] = useState(() => {
    const saved = localStorage.getItem("ai_defender_session");
    if (saved) {
      try { return JSON.parse(saved).role; } catch (e) {}
    }
    return "Administrator";
  });

  // USB Policy States
  const [usbMode, setUsbMode] = useState("ReadOnly");
  const [rubberDuckyDefense, setRubberDuckyDefense] = useState(true);
  const [passwordComplexity, setPasswordComplexity] = useState(true);

  // Device Lockdowns (Kernel Controls)
  const [lockCamera, setLockCamera] = useState(false);
  const [lockMicrophone, setLockMicrophone] = useState(false);
  const [lockBluetooth, setLockBluetooth] = useState(true);
  const [lockPrinter, setLockPrinter] = useState(false);
  const [lockWiFi, setLockWiFi] = useState(false);

  // Vulnerability states
  const [scanningVulnerabilities, setScanningVulnerabilities] = useState(false);
  const [vulnScanResults, setVulnScanResults] = useState<any[] | null>(null);
  const [patchApprovalStatus, setPatchApprovalStatus] = useState<Record<string, string>>({
    "KB5035853": "Pending Approval",
    "KB5036122": "Pending Approval",
    "Realtek Audio v6.0": "Approved",
  });

  // Asset states
  const [assets, setAssets] = useState(initialAssets);

  // Handle local Role switching simulation
  const handleRoleSwitch = (newRole: string) => {
    setActiveRole(newRole);
    const saved = localStorage.getItem("ai_defender_session");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        parsed.role = newRole;
        localStorage.setItem("ai_defender_session", JSON.stringify(parsed));
        alert(`Workstation context changed to role: '${newRole}'. Permissions updated. Please refresh page if layout changes are required.`);
        window.location.reload();
      } catch (e) {}
    } else {
      localStorage.setItem("ai_defender_session", JSON.stringify({ username: "administrator", role: newRole, token: "demo-token" }));
      window.location.reload();
    }
  };

  // Run Vulnerability Scan simulation
  const runVulnerabilityScan = () => {
    setScanningVulnerabilities(true);
    setVulnScanResults(null);

    setTimeout(() => {
      setScanningVulnerabilities(false);
      setVulnScanResults([
        { id: "vuln-01", type: "Windows Update", item: "KB5035853 Security Patch", severity: "HIGH", description: "Missing critical cumulative local privilege escalation security update" },
        { id: "vuln-02", type: "Weak Passwords", item: "Guest Account password", severity: "CRITICAL", description: "Standard default Guest user password length less than 8 characters" },
        { id: "vuln-03", type: "Open Ports", item: "Port 445 (SMB) Active Listener", severity: "MEDIUM", description: "SMB shares listener is accessible. Suggest blocking via local Firewall policy" },
        { id: "vuln-04", type: "Drivers Version", item: "Realtek Audio Driver v6.0.9", severity: "LOW", description: "Vulnerable audio driver stack allowing arbitrary heap buffer overflows" },
        { id: "vuln-05", type: "Windows Update", item: "KB5036122 Hyper-V Patch", severity: "HIGH", description: "Hyper-V Escape vulnerability allowing sandbox container bypass" },
      ]);
    }, 1200);
  };

  // Handle patch approval workflows
  const handlePatchStatusUpdate = (patchId: string, status: string) => {
    setPatchApprovalStatus((prev) => ({
      ...prev,
      [patchId]: status,
    }));
    alert(`Patch update '${patchId}' status updated to '${status}' immediately!`);
  };

  // Export backups
  const handleBackupConfig = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      platform: "AI Defender Enterprise",
      usb_policy: usbMode,
      ducky_defense: rubberDuckyDefense,
      password_complexity: passwordComplexity,
      auditing: auditingDepth,
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "ai_defender_platform_backup.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    alert("Platform configuration backed up successfully!");
  };

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h4" fontWeight={700}>
          Platform Settings & Governance
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Configure security baselines, simulate role switching (RBAC), lock down kernel devices, scan for system vulnerabilities, and manage backups.
        </Typography>
      </Stack>

      <Box sx={{ borderBottom: 1, borderColor: "rgba(255, 255, 255, 0.08)", mb: 2 }}>
        <Tabs value={activeTab} onChange={(_, val) => setActiveTab(val)}>
          <Tab label="General & User RBAC Switcher" />
          <Tab label="Device & Password Policies" />
          <Tab label="Vulnerability & Patch Center" />
          <Tab label="Workstation Assets" />
          <Tab label="Backup & Hotkeys Guide" />
        </Tabs>
      </Box>

      {/* Tab 0: General and RBAC User Selector */}
      {activeTab === 0 && (
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={7}>
            <PanelCard title="Role-Based Access Control (RBAC) Switcher" subtitle="Simulate user privilege switching to observe dashboard limitations">
              <Stack spacing={3} sx={{ py: 1 }}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel id="active-role-label">Active Workstation Role Context</InputLabel>
                  <Select
                    labelId="active-role-label"
                    value={activeRole}
                    label="Active Workstation Role Context"
                    onChange={(e) => handleRoleSwitch(e.target.value)}
                  >
                    <MenuItem value="Administrator">Administrator (Full Write & Triage Access)</MenuItem>
                    <MenuItem value="Security Analyst">Security Analyst (Threat Scans & AI Chat)</MenuItem>
                    <MenuItem value="SOC Operator">SOC Operator (Read Sockets & Log Audits)</MenuItem>
                    <MenuItem value="Auditor">Compliance Auditor (Logs and Export Reports Only)</MenuItem>
                    <MenuItem value="Read Only">Read Only (Telemetry Views Only)</MenuItem>
                  </Select>
                </FormControl>

                <Paper sx={{ p: 2, bgcolor: "rgba(0,0,0,0.15)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={700} display="block" gutterBottom>
                    Active Permissions Profile:
                  </Typography>
                  <Typography variant="body2">
                    {activeRole === "Administrator" && "• Full authority to write firewall policies, terminate active processes, mount USB policies, lock down kernel device peripherals, and run all scanners."}
                    {activeRole === "Security Analyst" && "• Authority to run quick/full scans, quarantine files, consult local AI chat, and manage whitelists."}
                    {activeRole === "SOC Operator" && "• Authority to monitor active network sockets, processes list, and view log events. Process terminations are restricted."}
                    {activeRole === "Auditor" && "• Read-only access to compiled logs and automated report generation sheets. No scanning or firewall modifications are allowed."}
                    {activeRole === "Read Only" && "• Visual telemetry monitoring only. Edit capabilities are disabled across the environment."}
                  </Typography>
                </Paper>
              </Stack>
            </PanelCard>
          </Grid>

          <Grid item xs={12} md={5}>
            <PanelCard title="General Workstation Preferences" subtitle="Platform monitoring depths">
              <Stack spacing={3} sx={{ py: 1 }}>
                <FormControlLabel
                  control={<Switch checked={toastAlerts} onChange={(e) => setToastAlerts(e.target.checked)} />}
                  label={
                    <Box sx={{ ml: 1 }}>
                      <Typography variant="body2" fontWeight={700}>Toast Notification Alerts</Typography>
                      <Typography variant="caption" color="text.secondary">Show in-app toaster popups for blocked threads</Typography>
                    </Box>
                  }
                />

                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel id="auditing-depth-label">Auditing Logs Depth</InputLabel>
                  <Select
                    labelId="auditing-depth-label"
                    value={auditingDepth}
                    label="Auditing Logs Depth"
                    onChange={(e) => setAuditingDepth(e.target.value)}
                  >
                    <MenuItem value="Minimal">Minimal (Threat alerts only)</MenuItem>
                    <MenuItem value="Detailed">Detailed (Handshakes + Hash lookups)</MenuItem>
                    <MenuItem value="Verbose">Verbose (All API callbacks + ETW)</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </PanelCard>
          </Grid>
        </Grid>
      )}

      {/* Tab 1: Device and Password Policies */}
      {activeTab === 1 && (
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={7}>
            <PanelCard title="USB & Peripherals Media Policies" subtitle="Hardware controller baseline configurations">
              <Stack spacing={3} sx={{ py: 1 }}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel id="usb-mode-label">USB Storage Enforcement Mode</InputLabel>
                  <Select
                    labelId="usb-mode-label"
                    value={usbMode}
                    label="USB Storage Enforcement Mode"
                    onChange={(e) => setUsbMode(e.target.value)}
                  >
                    <MenuItem value="AllowAll">Allow Read & Write (Unrestricted)</MenuItem>
                    <MenuItem value="ReadOnly">Enforce Mount as Read-Only (Safe Mode)</MenuItem>
                    <MenuItem value="BlockAll">Block and Disconnect Mass Storage Devices</MenuItem>
                  </Select>
                </FormControl>

                <FormControlLabel
                  control={<Switch checked={rubberDuckyDefense} onChange={(e) => setRubberDuckyDefense(e.target.checked)} />}
                  label={
                    <Box sx={{ ml: 1 }}>
                      <Typography variant="body2" fontWeight={700}>Rubber Ducky & BadUSB Prevention</Typography>
                      <Typography variant="caption" color="text.secondary">Terminate any USB device simulating keystroke inputs faster than 50 chars/sec</Typography>
                    </Box>
                  }
                />

                <Divider />

                <Typography variant="caption" color="text.secondary" fontWeight={700}>
                  KERNEL DEVICE ACCESS LOCKDOWNS (DEVICE CONTROL)
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={<Switch checked={lockCamera} onChange={(e) => setLockCamera(e.target.checked)} />}
                      label={<Typography variant="body2">Disable Web Camera</Typography>}
                    />
                    <FormControlLabel
                      control={<Switch checked={lockMicrophone} onChange={(e) => setLockMicrophone(e.target.checked)} />}
                      label={<Typography variant="body2">Disable Microphone</Typography>}
                    />
                    <FormControlLabel
                      control={<Switch checked={lockBluetooth} onChange={(e) => setLockBluetooth(e.target.checked)} />}
                      label={<Typography variant="body2">Block Bluetooth Access</Typography>}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={<Switch checked={lockPrinter} onChange={(e) => setLockPrinter(e.target.checked)} />}
                      label={<Typography variant="body2">Block Printer Spools</Typography>}
                    />
                    <FormControlLabel
                      control={<Switch checked={lockWiFi} onChange={(e) => setLockWiFi(e.target.checked)} />}
                      label={<Typography variant="body2">Strict Wi-Fi Lockouts</Typography>}
                    />
                  </Grid>
                </Grid>

                <Paper sx={{ p: 2, border: "1px dashed rgba(255,255,255,0.1)", bgcolor: "rgba(0,0,0,0.1)" }}>
                  <Typography variant="caption" color="text.secondary">
                    ℹ️ <strong>Policy Enforced:</strong> Device controls are pushed directly to the Windows driver stack immediately, safely sandboxing external hardware channels.
                  </Typography>
                </Paper>
              </Stack>
            </PanelCard>
          </Grid>

          <Grid item xs={12} md={5}>
            <PanelCard title="Workstation Password Policies" subtitle="Local account lockouts">
              <Stack spacing={2} sx={{ py: 1 }}>
                <FormControlLabel
                  control={<Switch checked={passwordComplexity} onChange={(e) => setPasswordComplexity(e.target.checked)} />}
                  label={
                    <Box sx={{ ml: 1 }}>
                      <Typography variant="body2" fontWeight={700}>Enforce Password Complexity</Typography>
                      <Typography variant="caption" color="text.secondary">Requires minimum 12 chars, uppercase, digit, special symbol</Typography>
                    </Box>
                  }
                />

                <Box>
                  <Typography variant="caption" color="text.secondary">LOCAL ACCOUNT LOCKOUT THRESHOLD</Typography>
                  <Typography variant="body2" fontWeight={700} sx={{ mt: 0.5 }}>
                    {"3 Failed Lock attempts -> Lock workstation for 15 minutes"}
                  </Typography>
                </Box>
              </Stack>
            </PanelCard>
          </Grid>
        </Grid>
      )}

      {/* Tab 2: Vulnerability Scanner & Patch Management */}
      {activeTab === 2 && (
        <Grid container spacing={2.5}>
          {/* Vulnerability scan trigger */}
          <Grid item xs={12} lg={7}>
            <PanelCard title="Windows Vulnerability Inspector" subtitle="Scan for open ports, missing Windows Updates, weak registry hashes, and outdated software">
              <Stack spacing={2}>
                <Button
                  variant="contained"
                  color="secondary"
                  disabled={scanningVulnerabilities}
                  onClick={runVulnerabilityScan}
                  startIcon={<RefreshRoundedIcon />}
                  sx={{ alignSelf: "flex-start" }}
                >
                  {scanningVulnerabilities ? "Scanning drivers & registries..." : "Start Vulnerability Scan"}
                </Button>

                {scanningVulnerabilities && (
                  <Box sx={{ width: "100%", my: 1 }}>
                    <LinearProgress color="secondary" />
                  </Box>
                )}

                {vulnScanResults ? (
                  <TableContainer component={Paper} sx={{ bgcolor: "transparent", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700 }}>Severity</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Check Family</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Target / Vulnerability</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {vulnScanResults.map((v) => (
                          <TableRow key={v.id}>
                            <TableCell>
                              <Chip
                                label={v.severity}
                                size="small"
                                color={v.severity === "CRITICAL" ? "error" : v.severity === "HIGH" ? "warning" : "primary"}
                              />
                            </TableCell>
                            <TableCell>{v.type}</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>{v.item}</TableCell>
                            <TableCell sx={{ fontSize: "0.75rem", color: "text.secondary" }}>{v.description}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ p: 4, fontStyle: "italic", textAlign: "center" }}>
                    No scan results loaded yet. Click "Start Vulnerability Scan" to audit local workstation registries and missing patches.
                  </Typography>
                )}
              </Stack>
            </PanelCard>
          </Grid>

          {/* Patch Approval Workflow */}
          <Grid item xs={12} lg={5}>
            <PanelCard title="Patch Management approval Desk" subtitle="Verify and deploy Microsoft Cumulative KBs or device drivers">
              <Stack spacing={2.5}>
                <Typography variant="caption" color="text.secondary">
                  Manage the deployment cycle of missing operating system security updates. Approved patches will build and execute during the next Scheduled task.
                </Typography>

                <Paper sx={{ p: 2, border: "1px solid rgba(255,255,255,0.06)", bgcolor: "rgba(0,0,0,0.15)" }}>
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" fontWeight={700}>KB5035853 Security Update</Typography>
                      <Chip label={patchApprovalStatus["KB5035853"]} size="small" color={patchApprovalStatus["KB5035853"] === "Approved" ? "success" : "warning"} />
                    </Stack>
                    <Typography variant="caption" color="text.secondary">Protects against local kernel privilege escalations.</Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      <Button size="small" variant="outlined" color="success" onClick={() => handlePatchStatusUpdate("KB5035853", "Approved")}>Approve</Button>
                      <Button size="small" variant="outlined" color="error" onClick={() => handlePatchStatusUpdate("KB5035853", "Declined")}>Decline</Button>
                    </Stack>
                  </Stack>
                </Paper>

                <Paper sx={{ p: 2, border: "1px solid rgba(255,255,255,0.06)", bgcolor: "rgba(0,0,0,0.15)" }}>
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" fontWeight={700}>KB5036122 Hyper-V Patch</Typography>
                      <Chip label={patchApprovalStatus["KB5036122"]} size="small" color={patchApprovalStatus["KB5036122"] === "Approved" ? "success" : "warning"} />
                    </Stack>
                    <Typography variant="caption" color="text.secondary">Prevents sandbox virtual container breakout vectors.</Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      <Button size="small" variant="outlined" color="success" onClick={() => handlePatchStatusUpdate("KB5036122", "Approved")}>Approve</Button>
                      <Button size="small" variant="outlined" color="error" onClick={() => handlePatchStatusUpdate("KB5036122", "Declined")}>Decline</Button>
                    </Stack>
                  </Stack>
                </Paper>

                <Paper sx={{ p: 2, border: "1px solid rgba(255,255,255,0.06)", bgcolor: "rgba(0,0,0,0.15)" }}>
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" fontWeight={700}>Realtek Audio Device driver v6.0</Typography>
                      <Chip label={patchApprovalStatus["Realtek Audio v6.0"] || "Approved"} size="small" color="success" />
                    </Stack>
                    <Typography variant="caption" color="text.secondary">Vulnerable Audio driver stack update.</Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      <Button size="small" variant="outlined" color="warning" onClick={() => handlePatchStatusUpdate("Realtek Audio v6.0", "Rolled Back")}>Rollback Update</Button>
                    </Stack>
                  </Stack>
                </Paper>
              </Stack>
            </PanelCard>
          </Grid>
        </Grid>
      )}

      {/* Tab 3: Assets */}
      {activeTab === 3 && (
        <Grid container spacing={2.5}>
          <Grid item xs={12}>
            <PanelCard title="Enterprise Computer Assets Inventory" subtitle="Workstations monitored by this local platform agent">
              <TableContainer component={Paper} sx={{ bgcolor: "transparent", border: "1px solid rgba(255,255,255,0.06)" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Hostname</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Department</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Operating System</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Classification Tag</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assets.map((ast) => (
                      <TableRow key={ast.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                        <TableCell component="th" scope="row">
                          <Stack direction="row" spacing={1} alignItems="center">
                            <ComputerRoundedIcon color="primary" />
                            <Typography variant="body2" fontWeight={600}>{ast.hostname}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>{ast.department}</TableCell>
                        <TableCell>{ast.os}</TableCell>
                        <TableCell>
                          <Chip label={ast.tag} size="small" variant="outlined" color={ast.tag.includes("Primary") ? "primary" : "secondary"} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </PanelCard>
          </Grid>
        </Grid>
      )}

      {/* Tab 4: Backups & Keyboard Shortcuts */}
      {activeTab === 4 && (
        <Grid container spacing={2.5}>
          {/* Backup */}
          <Grid item xs={12} md={6}>
            <PanelCard title="Platform Backups & Restorations" subtitle="Download rules, logs, and policies configuration files">
              <Stack spacing={3} sx={{ py: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Create a localized configuration snapshot containing all whitelists, firewall rules, and password complexity options.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<CloudSyncRoundedIcon />}
                  onClick={handleBackupConfig}
                >
                  Backup Platform Configuration
                </Button>
                <Divider />
                <Button
                  variant="outlined"
                  component="label"
                >
                  Upload Restoration File
                  <input
                    type="file"
                    hidden
                    onChange={() => alert("Restoring platform settings from JSON. Policies re-enforced successfully!")}
                  />
                </Button>
              </Stack>
            </PanelCard>
          </Grid>

          {/* Hotkeys */}
          <Grid item xs={12} md={6}>
            <PanelCard title="Workstation Hotkeys Guide" subtitle="Global search and assistant shortcuts">
              <List disablePadding>
                <ListItem sx={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <Stack direction="row" spacing={2} width="100%" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <KeyboardRoundedIcon color="secondary" />
                      <Typography variant="body2" fontWeight={700}>Ctrl + K</Typography>
                    </Stack>
                    <Typography variant="caption" color="text.secondary">Unified Global Search Everywhere</Typography>
                  </Stack>
                </ListItem>
                <ListItem sx={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <Stack direction="row" spacing={2} width="100%" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <KeyboardRoundedIcon color="secondary" />
                      <Typography variant="body2" fontWeight={700}>Ctrl + Shift + S</Typography>
                    </Stack>
                    <Typography variant="caption" color="text.secondary">Trigger Quick Workstation Scan</Typography>
                  </Stack>
                </ListItem>
                <ListItem>
                  <Stack direction="row" spacing={2} width="100%" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <KeyboardRoundedIcon color="secondary" />
                      <Typography variant="body2" fontWeight={700}>Ctrl + Shift + A</Typography>
                    </Stack>
                    <Typography variant="caption" color="text.secondary">Open Quick AI Co-Pilot bubble</Typography>
                  </Stack>
                </ListItem>
              </List>
            </PanelCard>
          </Grid>
        </Grid>
      )}
    </Stack>
  );
};
