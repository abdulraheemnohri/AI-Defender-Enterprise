import { PropsWithChildren, useEffect, useState } from "react";
import {
  alpha,
  AppBar,
  Avatar,
  Box,
  Chip,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Toolbar,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  ListItem,
  Button,
  Snackbar,
  Alert,
  Paper,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import MemoryRoundedIcon from "@mui/icons-material/MemoryRounded";
import TravelExploreRoundedIcon from "@mui/icons-material/TravelExploreRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import { PanelCard } from "../common/PanelCard";
import { navigationItems } from "../../data/navigation";


const sidebarWidth = 260;
const rightPanelWidth = 300;


type LayoutProps = PropsWithChildren<{
  session: { username: string; role: string; token: string };
  onLogout: () => void;
  onLock: () => void;
}>;


export const Layout = ({ children, session, onLogout, onLock }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Search State
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{ category: string; text: string; path: string }>>([]);

  // Toast State
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastSeverity, setToastSeverity] = useState<"success" | "info" | "warning" | "error">("success");

  // Floating AI Quick Chat State
  const [quickAiOpen, setQuickAiOpen] = useState(false);
  const [quickAiQuery, setQuickAiQuery] = useState("");
  const [quickAiResponse, setQuickAiResponse] = useState("");
  const [quickAiLoading, setQuickAiLoading] = useState(false);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K -> Search
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      // Ctrl+Shift+S -> Quick Scan
      if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === "S") {
        e.preventDefault();
        setToastMsg("Quick Scan triggered via hotkey!");
        setToastSeverity("success");
        setToastOpen(true);
        navigate("/security-center");
      }
      // Ctrl+Shift+A -> Quick AI
      if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === "A") {
        e.preventDefault();
        setQuickAiOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  // Handle Search Input
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (!val.trim()) {
      setSearchResults([]);
      return;
    }

    const query = val.toLowerCase();
    const mockEntities = [
      { category: "Process", text: "powershell.exe (PID: 1884) - High Risk", path: "/" },
      { category: "Process", text: "chrome.exe (PID: 4120) - Low Risk", path: "/" },
      { category: "Alert", text: "Suspicious PowerShell chain detected (ID: 1001)", path: "/" },
      { category: "Alert", text: "Unsigned executable downloaded (ID: 1002)", path: "/" },
      { category: "File / Quarantine", text: "invoice_viewer.exe - Contained", path: "/security-center" },
      { category: "Rule", text: "Block TOR Exit Node (Action: BLOCK, Target: 185.220.101.7)", path: "/firewall" },
      { category: "Rule", text: "Allow SOC Collector (Action: ALLOW, Target: 10.0.0.15)", path: "/firewall" },
      { category: "IP Connection", text: "185.220.101.7:8080 - Tor Node IP", path: "/network" },
      { category: "Setting / Policy", text: "USB Read Only Storage Enforcement", path: "/settings" },
      { category: "AI Assistant", text: "Gemma Local LLM Configuration", path: "/ai-defender" },
    ];

    const filtered = mockEntities.filter((e) =>
      e.text.toLowerCase().includes(query) || e.category.toLowerCase().includes(query)
    );
    setSearchResults(filtered);
  };

  const handleSearchResultClick = (path: string) => {
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    navigate(path);
  };

  // Quick AI Assistant action
  const handleQuickAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAiQuery.trim()) return;

    setQuickAiLoading(true);
    setQuickAiResponse("");

    try {
      // Simulate local AI delay
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const q = quickAiQuery.toLowerCase();
      if (q.includes("powershell")) {
        setQuickAiResponse(
          "Analysis: Legitimate powershell.exe triggered an encoded base64 argument. This usually indicates obfuscated payload execution (e.g., Empire, Cobalt Strike). Recommended Action: Kill process PID 1884 immediately."
        );
      } else if (q.includes("firewall") || q.includes("block")) {
        setQuickAiResponse(
          "Suggested Firewall Rule:\nACTION: BLOCK\nTARGET: 185.220.101.7\nPORT: ANY\nReason: Malicious C2 handshakes detected."
        );
      } else {
        setQuickAiResponse(
          `Local AI model interpreted request: "${quickAiQuery}". No active threats found matching. It is advised to monitor process lifecycles.`
        );
      }
    } catch (err) {
      setQuickAiResponse("Failed to query local AI model.");
    } finally {
      setQuickAiLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar
        position="fixed"
        color="transparent"
        elevation={0}
        sx={{
          backdropFilter: "blur(18px)",
          borderBottom: (theme) => `1px solid ${alpha(theme.palette.common.white, 0.08)}`,
          width: `calc(100% - ${sidebarWidth}px)`,
          ml: `${sidebarWidth}px`,
          zIndex: 1100,
        }}
      >
        <Toolbar sx={{ minHeight: 72 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
            <Stack spacing={0.5}>
              <Typography variant="h5" fontWeight={700}>
                AI Defender Enterprise
              </Typography>
              <Typography variant="body2" color="text.secondary">
                AI-powered local cyber defense platform
              </Typography>
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                size="small"
                placeholder="Search everywhere (Ctrl+K)"
                onClick={() => setSearchOpen(true)}
                sx={{ width: 340, cursor: "pointer" }}
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <Chip icon={<BoltRoundedIcon />} color="warning" label="Threat Level Elevated" />
              <IconButton color="inherit" onClick={() => setQuickAiOpen(true)}>
                <AutoAwesomeRoundedIcon color="secondary" />
              </IconButton>
              <IconButton color="inherit" onClick={onLock}>
                <LockRoundedIcon />
              </IconButton>
              <Avatar sx={{ bgcolor: "primary.main" }}>
                {session.username ? session.username.substring(0, 2).toUpperCase() : "AD"}
              </Avatar>
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        PaperProps={{
          sx: {
            width: sidebarWidth,
            boxSizing: "border-box",
            borderRight: (theme) =>
              `1px solid ${alpha(theme.palette.common.white, 0.08)}`,
            backgroundImage: "none",
          },
        }}
      >
        <Toolbar sx={{ minHeight: 72, px: 3 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar sx={{ bgcolor: "secondary.main" }}>
              <VerifiedUserRoundedIcon />
            </Avatar>
            <Box>
              <Typography fontWeight={700} sx={{ maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis" }}>
                {session.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {session.role}
              </Typography>
            </Box>
          </Stack>
        </Toolbar>
        <Divider />
        <List sx={{ px: 2, py: 2, flex: 1, overflowY: "auto" }}>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;

            return (
              <ListItemButton
                key={item.path}
                component={NavLink}
                to={item.path}
                sx={{
                  mb: 1,
                  borderRadius: 2,
                  color: active ? "primary.light" : "text.secondary",
                  bgcolor: active ? alpha("#2196F3", 0.14) : "transparent",
                }}
              >
                <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            );
          })}
        </List>

        <Box sx={{ p: 2 }}>
          <Button
            variant="outlined"
            color="error"
            size="small"
            fullWidth
            startIcon={<LogoutRoundedIcon />}
            onClick={onLogout}
            sx={{ mb: 2 }}
          >
            Exit Workspace
          </Button>
          <PanelCard
            title={`${session.role} Workspace`}
            subtitle="Security Controls Active"
          >
            <Typography variant="caption" color="text.secondary">
              {session.role === "Read Only" || session.role === "Guest"
                ? "Warning: Operational edits and rule promotions are disabled for your privilege level."
                : "Full administrator capabilities and telemetry containment triggers enabled."}
            </Typography>
          </PanelCard>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          ml: `${sidebarWidth}px`,
          mr: `${rightPanelWidth}px`,
          pt: 11,
          pb: 10,
          px: 3,
        }}
      >
        {children}
      </Box>

      {/* Right Intelligence Panel */}
      <Box
        sx={{
          position: "fixed",
          top: 72,
          right: 0,
          width: rightPanelWidth,
          height: "calc(100vh - 72px - 40px)",
          px: 2,
          py: 2,
          overflowY: "auto",
          borderLeft: (theme) => `1px solid ${alpha(theme.palette.common.white, 0.08)}`,
          bgcolor: alpha("#0B1020", 0.7),
          backdropFilter: "blur(18px)",
          zIndex: 1000,
        }}
      >
        <Stack spacing={2}>
          <PanelCard title="AI Status" subtitle="Local model orchestration">
            <Stack spacing={1.5}>
              <Chip icon={<MemoryRoundedIcon />} label="Qwen / Phi / Gemma Ready" color="success" />
              <Typography variant="body2" color="text.secondary">
                Incident explanation, triage summaries, and rule suggestions use local-first workflows.
              </Typography>
            </Stack>
          </PanelCard>
          <PanelCard title="Analyst Focus" subtitle="Recommended next actions">
            <Stack spacing={1}>
              <Typography variant="body2">• Review active PowerShell lineage.</Typography>
              <Typography variant="body2">• Validate USB trust policy exceptions.</Typography>
              <Typography variant="body2">• Promote temporary firewall rules to policy.</Typography>
            </Stack>
          </PanelCard>
          <PanelCard title="Threat Intel" subtitle="Offline feed snapshot">
            <Stack direction="row" spacing={1} alignItems="center" mb={1}>
              <TravelExploreRoundedIcon color="primary" />
              <Typography variant="body2">Recent IOCs mapped to MITRE ATT&CK tactics.</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Persistence, command execution, and exfiltration patterns remain the top local risks.
            </Typography>
          </PanelCard>
        </Stack>
      </Box>

      {/* Status Bar */}
      <Box
        component="footer"
        sx={{
          position: "fixed",
          left: 0,
          bottom: 0,
          width: "100%",
          height: 40,
          px: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: (theme) => `1px solid ${alpha(theme.palette.common.white, 0.08)}`,
          bgcolor: alpha("#0B1020", 0.92),
          zIndex: 1200,
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Status: Protected | Mode: Offline Enterprise | Active Analyst: {session.username} ({session.role})
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Shortcuts: Ctrl+K Search | Ctrl+Shift+S Quick Scan | Ctrl+Shift+A AI Assistant
        </Typography>
      </Box>

      {/* Global Search Dialog Modal */}
      <Dialog
        open={searchOpen}
        onClose={() => {
          setSearchOpen(false);
          setSearchQuery("");
          setSearchResults([]);
        }}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            bgcolor: "background.paper",
            borderRadius: 3,
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={700}>
              Global Unified Search
            </Typography>
            <IconButton
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery("");
                setSearchResults([]);
              }}
              size="small"
            >
              <CloseRoundedIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ p: 2, pt: 0 }}>
          <TextField
            autoFocus
            fullWidth
            placeholder="Type processes, files, alerts, IPs, firewall rules..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            sx={{ mb: 2 }}
          />

          {searchResults.length > 0 ? (
            <List sx={{ maxHeight: 300, overflowY: "auto" }}>
              {searchResults.map((res, idx) => (
                <ListItem
                  key={idx}
                  onClick={() => handleSearchResultClick(res.path)}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    cursor: "pointer",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.06)" },
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center" width="100%">
                    <Chip size="small" label={res.category} color="primary" variant="outlined" />
                    <Typography variant="body2" sx={{ flexGrow: 1 }}>
                      {res.text}
                    </Typography>
                  </Stack>
                </ListItem>
              ))}
            </List>
          ) : searchQuery ? (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: "center" }}>
              No results found for "{searchQuery}". Try searching "powershell" or "tor".
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: "center" }}>
              Search platform assets. (E.g. "powershell.exe", "185.220.101.7", "invoice")
            </Typography>
          )}
        </DialogContent>
      </Dialog>

      {/* Quick AI Assistant Dialog */}
      <Dialog
        open={quickAiOpen}
        onClose={() => setQuickAiOpen(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            bgcolor: "background.paper",
            borderRadius: 3,
            border: "1px solid rgba(255,255,255,0.12)",
            position: "fixed",
            bottom: 60,
            right: 20,
            m: 0,
            boxShadow: "0 12px 36px rgba(0,0,0,0.5)",
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <AutoAwesomeRoundedIcon color="secondary" />
            <Typography variant="subtitle1" fontWeight={700}>
              Quick AI Co-Pilot
            </Typography>
          </Stack>
          <IconButton onClick={() => setQuickAiOpen(false)} size="small">
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 2, pt: 0 }}>
          <Stack spacing={2} component="form" onSubmit={handleQuickAiSubmit}>
            <Typography variant="caption" color="text.secondary">
              Query the local Gemma 2B model instantly without leaving your dashboard page.
            </Typography>
            <TextField
              size="small"
              placeholder="Ask anything (e.g. 'explain powershell')"
              value={quickAiQuery}
              onChange={(e) => setQuickAiQuery(e.target.value)}
              fullWidth
            />
            <Button
              type="submit"
              size="small"
              variant="contained"
              color="secondary"
              disabled={quickAiLoading}
              fullWidth
            >
              {quickAiLoading ? "Interpreting..." : "Submit to Local AI"}
            </Button>

            {quickAiResponse && (
              <Paper sx={{ p: 1.5, bgcolor: "rgba(255,255,255,0.03)", borderRadius: 2, border: "1px solid rgba(255,255,255,0.06)" }}>
                <Typography variant="caption" color="secondary.light" fontWeight={700}>
                  Local Model Response:
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", mt: 0.5 }}>
                  {quickAiResponse}
                </Typography>
              </Paper>
            )}
          </Stack>
        </DialogContent>
      </Dialog>

      {/* Global Toast notifications */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={4000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setToastOpen(false)} severity={toastSeverity} sx={{ width: "100%", borderRadius: 2 }}>
          {toastMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};
