import { Grid, LinearProgress, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";

import { PanelCard } from "../components/common/PanelCard";


const scanModules = [
  { name: "Quick Scan", detail: "Critical paths, startup entries, memory hotspots" },
  { name: "Full Scan", detail: "Deep scan across files, signatures, archives, and policies" },
  { name: "USB Scan", detail: "Auto-scan removable devices with trust validation" },
  { name: "Network Scan", detail: "Review current connections, ports, DNS, and anomalies" },
  { name: "Browser Scan", detail: "Inspect suspicious downloads, cookies, and extensions" },
  { name: "Email Scan", detail: "Analyze attachments, links, and macro behavior" },
];


const coverage = [
  { label: "Endpoint Protection", value: 88 },
  { label: "Network Security", value: 79 },
  { label: "Application Control", value: 74 },
  { label: "USB Defense", value: 91 },
];


export const SecurityCenter = () => {
  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h4" fontWeight={700}>
          Security Center
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Centralized scans, controls, and protection posture for the endpoint.
        </Typography>
      </Stack>

      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={7}>
          <PanelCard title="Scan Operations" subtitle="Phase 1 workflow scaffolding">
            <List disablePadding>
              {scanModules.map((scan) => (
                <ListItem
                  key={scan.name}
                  disableGutters
                  sx={{ py: 1.4, borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <ListItemText primary={scan.name} secondary={scan.detail} />
                </ListItem>
              ))}
            </List>
          </PanelCard>
        </Grid>
        <Grid item xs={12} lg={5}>
          <PanelCard title="Protection Coverage" subtitle="Readiness by control family">
            <Stack spacing={2.2}>
              {coverage.map((item) => (
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
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={4}>
          <PanelCard title="Response Queue" subtitle="Containment and analyst tasks">
            <Typography variant="body2" color="text.secondary">
              Malware isolation, AI explanation, policy review, and reporting workflows land here in later
              phases.
            </Typography>
          </PanelCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <PanelCard title="Policy Status" subtitle="Security baselines">
            <Typography variant="body2" color="text.secondary">
              USB, browser, email, application, and firewall policies will share one enforcement model.
            </Typography>
          </PanelCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <PanelCard title="Scheduler" subtitle="Automation hooks">
            <Typography variant="body2" color="text.secondary">
              Automatic scans, report generation, updates, and cleanup tasks are planned for enterprise
              phases.
            </Typography>
          </PanelCard>
        </Grid>
      </Grid>
    </Stack>
  );
};
