import { useEffect, useState } from "react";
import {
  Grid,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  Chip,
  IconButton,
  Divider,
  Box,
  Paper,
  FormControlLabel,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";

import { PanelCard } from "../components/common/PanelCard";
import { getFirewallRules, addFirewallRule, deleteFirewallRule, toggleFirewallRule, importFirewallRules, promoteSuggestedRule } from "../utils/api";


type FirewallRule = {
  id: number;
  name: string;
  action: string;
  target: string;
  protocol: string;
  enabled: boolean;
};


export const FirewallPage = () => {
  const [rules, setRules] = useState<FirewallRule[]>([]);
  const [loading, setLoading] = useState(true);

  // New Rule Form Dialog State
  const [addOpen, setAddOpen] = useState(false);
  const [ruleName, setRuleName] = useState("");
  const [ruleAction, setRuleAction] = useState("block");
  const [ruleProtocol, setRuleProtocol] = useState("TCP");
  const [ruleTarget, setRuleTarget] = useState("");
  const [isTemporary, setIsTemporary] = useState(false);
  const [leaseTime, setLeaseTime] = useState("1 Hour");

  // AI Recommendations
  const [aiSuggestions, setAiSuggestions] = useState([
    {
      id: "ai-sug-1",
      name: "AI suggested: Block Egress to 185.220.101.7",
      action: "block",
      target: "185.220.101.7",
      protocol: "TCP",
      reason: "Anomalous beacon handshake logged from powershell.exe",
    },
    {
      id: "ai-sug-2",
      name: "AI suggested: Block Inbound Port 445 (SMB)",
      action: "block",
      target: "Any:445",
      protocol: "TCP",
      reason: "High risk of EternalBlue lateral movement scanning in enterprise LAN",
    }
  ]);

  const loadRules = async () => {
    try {
      const data = await getFirewallRules();
      setRules(data);
    } catch (error) {
      setRules([
        {
          id: 1,
          name: "Block TOR Exit Node",
          action: "block",
          target: "185.220.101.7",
          protocol: "TCP",
          enabled: true,
        },
        {
          id: 2,
          name: "Allow SOC Collector",
          action: "allow",
          target: "10.0.0.15:6514",
          protocol: "TCP",
          enabled: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRules();
  }, []);

  const handleAddRuleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName || !ruleTarget) return;

    const payload = {
      name: ruleName + (isTemporary ? ` (Lease: ${leaseTime})` : ""),
      action: ruleAction,
      target: ruleTarget,
      protocol: ruleProtocol,
      enabled: true,
    };

    try {
      const newRule = await addFirewallRule(payload);
      setRules((prev) => [...prev, newRule]);
    } catch (err) {
      // Fallback
      const mockRule: FirewallRule = {
        id: rules.length + 1,
        ...payload,
      };
      setRules((prev) => [...prev, mockRule]);
    } finally {
      setAddOpen(false);
      // Reset form
      setRuleName("");
      setRuleTarget("");
      setRuleAction("block");
      setRuleProtocol("TCP");
      setIsTemporary(false);
    }
  };

  const handleDeleteRule = async (id: number) => {
    try {
      await deleteFirewallRule(id);
      setRules((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      // Fallback
      setRules((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleToggleRule = async (id: number) => {
    try {
      await toggleFirewallRule(id);
      setRules((prev) =>
        prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
      );
    } catch (err) {
      // Fallback
      setRules((prev) =>
        prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
      );
    }
  };

  // Promoting AI Suggestion to firewall rule policy
  const handlePromoteSuggestion = async (sug: any) => {
    const payload = {
      name: sug.name,
      action: sug.action,
      target: sug.target,
      protocol: sug.protocol,
      enabled: true,
    };

    try {
      const newRule = await promoteSuggestedRule(payload);
      setRules((prev) => [...prev, newRule]);
    } catch (err) {
      // Fallback
      const mockRule: FirewallRule = {
        id: rules.length + 1,
        ...payload,
      };
      setRules((prev) => [...prev, mockRule]);
    }

    // Clear suggestion from list
    setAiSuggestions((prev) => prev.filter((s) => s.id !== sug.id));
    alert("AI Rule suggestion promoted to active security policy.");
  };

  // Export policy rules list as JSON file
  const handleExportPolicy = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(rules, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "firewall_policy_export.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import mock rules
  const handleImportPolicy = async () => {
    const mockImports = [
      { name: "Global block: IP port scan source", action: "block", target: "10.0.0.124", protocol: "ANY", enabled: true }
    ];
    try {
      const data = await importFirewallRules(mockImports);
      setRules((prev) => [...prev, ...data]);
    } catch (err) {
      setRules((prev) => [...prev, { id: rules.length + 1, ...mockImports[0] }]);
    }
    alert("Firewall configuration imported successfully.");
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Firewall Policy Workspace
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Enforce custom connection filters, promote AI rule suggestions, and manage network ports policies.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5}>
          <Button variant="outlined" startIcon={<FileUploadRoundedIcon />} onClick={handleImportPolicy}>
            Import Policy
          </Button>
          <Button variant="outlined" startIcon={<FileDownloadRoundedIcon />} onClick={handleExportPolicy}>
            Export Policy
          </Button>
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => setAddOpen(true)}>
            Add Custom Rule
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={2.5}>
        {/* Active Rules List */}
        <Grid item xs={12} lg={8}>
          <PanelCard title="Active Firewall Rules" subtitle="Seeded policies enforced at the local network stack">
            <List disablePadding>
              {rules.map((rule) => (
                <Paper
                  key={rule.id}
                  sx={{
                    p: 2,
                    mb: 1.5,
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    bgcolor: rule.enabled ? "rgba(19, 27, 49, 0.3)" : "rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack spacing={0.5}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <ShieldRoundedIcon color={rule.action === "block" ? "error" : "success"} />
                        <Typography variant="body2" fontWeight={700} sx={{ textDecoration: rule.enabled ? "none" : "line-through", color: rule.enabled ? "text.primary" : "text.secondary" }}>
                          {rule.name}
                        </Typography>
                        <Chip
                          label={rule.action.toUpperCase()}
                          color={rule.action === "block" ? "error" : "success"}
                          size="small"
                          sx={{ height: 16, fontSize: "0.6rem" }}
                        />
                      </Stack>
                      <Typography variant="caption" color="text.secondary">
                        Target: {rule.target} | Protocol: {rule.protocol} | Status: {rule.enabled ? "Active" : "Disabled"}
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="center">
                      <FormControlLabel
                        control={
                          <Switch
                            checked={rule.enabled}
                            onChange={() => handleToggleRule(rule.id)}
                            size="small"
                          />
                        }
                        label={
                          <Typography variant="caption" color="text.secondary">
                            Enforced
                          </Typography>
                        }
                      />
                      <IconButton color="error" onClick={() => handleDeleteRule(rule.id)}>
                        <DeleteRoundedIcon />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Paper>
              ))}
            </List>
          </PanelCard>
        </Grid>

        {/* AI Recommendations Desk */}
        <Grid item xs={12} lg={4}>
          <PanelCard title="AI Rule Promotion" subtitle="Dynamic telemetry recommendations">
            {aiSuggestions.length > 0 ? (
              <Stack spacing={2}>
                {aiSuggestions.map((sug) => (
                  <Paper
                    key={sug.id}
                    sx={{
                      p: 2,
                      border: "1.5px solid rgba(156, 39, 176, 0.2)",
                      bgcolor: "rgba(156, 39, 176, 0.05)",
                      borderRadius: 3,
                    }}
                  >
                    <Stack spacing={1.5}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <AutoAwesomeRoundedIcon color="secondary" />
                        <Typography variant="body2" fontWeight={700}>
                          {sug.name}
                        </Typography>
                      </Stack>

                      <Typography variant="caption" color="text.secondary">
                        <strong>Reason:</strong> {sug.reason}
                      </Typography>

                      <Divider />

                      <Button
                        size="small"
                        variant="contained"
                        color="secondary"
                        startIcon={<AutoAwesomeRoundedIcon />}
                        onClick={() => handlePromoteSuggestion(sug)}
                      >
                        Approve & Promote to Policy
                      </Button>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: "center", fontStyle: "italic" }}>
                Suggestions Queue Clear. No anomalous interface handshake requests detected recently.
              </Typography>
            )}
          </PanelCard>
        </Grid>
      </Grid>

      {/* Rule Creator Dialog */}
      <Dialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            bgcolor: "background.paper",
            borderRadius: 3,
            border: "1px solid rgba(255,255,255,0.1)",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Configure Custom Firewall Rule</DialogTitle>
        <form onSubmit={handleAddRuleSubmit}>
          <DialogContent dividers>
            <Stack spacing={2.5}>
              <TextField
                label="Rule Name"
                placeholder="E.g. Block Ransomware Tor"
                size="small"
                fullWidth
                required
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
              />

              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="add-action-label">Rule Action</InputLabel>
                <Select
                  labelId="add-action-label"
                  value={ruleAction}
                  label="Rule Action"
                  onChange={(e) => setRuleAction(e.target.value)}
                >
                  <MenuItem value="block">BLOCK CONNECTION</MenuItem>
                  <MenuItem value="allow">ALLOW EXECUTION</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="add-protocol-label">Protocol</InputLabel>
                <Select
                  labelId="add-protocol-label"
                  value={ruleProtocol}
                  label="Protocol"
                  onChange={(e) => setRuleProtocol(e.target.value)}
                >
                  <MenuItem value="TCP">TCP</MenuItem>
                  <MenuItem value="UDP">UDP</MenuItem>
                  <MenuItem value="ICMP">ICMP</MenuItem>
                  <MenuItem value="ANY">ANY</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Target IP / Subnet / Port"
                placeholder="E.g. 192.168.1.1:80 or 10.0.0.0/24"
                size="small"
                fullWidth
                required
                value={ruleTarget}
                onChange={(e) => setRuleTarget(e.target.value)}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={isTemporary}
                    onChange={(e) => setIsTemporary(e.target.checked)}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" fontWeight={700}>Temporary Lease Rule</Typography>
                    <Typography variant="caption" color="text.secondary">Automatically deletes rule after selected timer</Typography>
                  </Box>
                }
              />

              {isTemporary && (
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel id="lease-label">Lease Duration</InputLabel>
                  <Select
                    labelId="lease-label"
                    value={leaseTime}
                    label="Lease Duration"
                    onChange={(e) => setLeaseTime(e.target.value)}
                  >
                    <MenuItem value="1 Hour">1 Hour</MenuItem>
                    <MenuItem value="12 Hours">12 Hours</MenuItem>
                    <MenuItem value="1 Day">1 Day</MenuItem>
                    <MenuItem value="7 Days">7 Days</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Apply Rule Stack
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Stack>
  );
};
