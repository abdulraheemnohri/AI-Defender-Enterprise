import { Grid, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";

import { PanelCard } from "../components/common/PanelCard";


const settingsGroups = [
  "General",
  "Security",
  "AI",
  "Appearance",
  "Notifications",
  "Database",
  "Updates",
  "Logs",
  "Advanced",
  "Developer",
  "License",
];


export const SettingsPage = () => {
  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h4" fontWeight={700}>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Central management for platform configuration, security, AI, and operational controls.
        </Typography>
      </Stack>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <PanelCard title="Settings Groups" subtitle="Platform configuration areas">
            <List disablePadding>
              {settingsGroups.map((group) => (
                <ListItem key={group} disableGutters sx={{ py: 1 }}>
                  <ListItemText primary={group} />
                </ListItem>
              ))}
            </List>
          </PanelCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <PanelCard title="Enterprise Roadmap" subtitle="Phase 4 focus">
            <Typography variant="body2" color="text.secondary">
              Authentication, RBAC, audit logging, policy enforcement, notifications, scheduler, backup,
              and recovery controls are staged for the enterprise implementation phase.
            </Typography>
          </PanelCard>
        </Grid>
      </Grid>
    </Stack>
  );
};
