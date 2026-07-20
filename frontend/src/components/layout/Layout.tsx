import { PropsWithChildren } from "react";
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
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import MemoryRoundedIcon from "@mui/icons-material/MemoryRounded";
import TravelExploreRoundedIcon from "@mui/icons-material/TravelExploreRounded";
import { NavLink, useLocation } from "react-router-dom";

import { PanelCard } from "../common/PanelCard";
import { navigationItems } from "../../data/navigation";


const sidebarWidth = 260;
const rightPanelWidth = 300;


export const Layout = ({ children }: PropsWithChildren) => {
  const location = useLocation();

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
                placeholder="Search processes, alerts, files, rules"
                sx={{ width: 360 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <Chip icon={<BoltRoundedIcon />} color="warning" label="Threat Level Elevated" />
              <IconButton color="inherit">
                <NotificationsRoundedIcon />
              </IconButton>
              <Avatar sx={{ bgcolor: "primary.main" }}>AD</Avatar>
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
              <Typography fontWeight={700}>Security Workspace</Typography>
              <Typography variant="body2" color="text.secondary">
                Administrator
              </Typography>
            </Box>
          </Stack>
        </Toolbar>
        <Divider />
        <List sx={{ px: 2, py: 2, flex: 1 }}>
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
        <Box sx={{ px: 2, pb: 2 }}>
          <PanelCard
            title="Phase 1 Foundation"
            subtitle="Core shell, seeded APIs, and offline data are active."
          >
            <Typography variant="body2" color="text.secondary">
              This workspace is ready for deeper monitoring, detection, enterprise auth, and local AI
              phases.
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
              <Typography variant="body2">Review active PowerShell lineage.</Typography>
              <Typography variant="body2">Validate USB trust policy exceptions.</Typography>
              <Typography variant="body2">Promote temporary firewall rules to policy.</Typography>
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
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Status: Protected | Mode: Offline Enterprise | Session: Administrator
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Shortcuts: Ctrl+K Search | Ctrl+Shift+S Quick Scan | Ctrl+Shift+A AI Assistant
        </Typography>
      </Box>
    </Box>
  );
};
