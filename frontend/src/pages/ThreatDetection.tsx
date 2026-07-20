import { Grid, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";

import { PanelCard } from "../components/common/PanelCard";


const engines = [
  "Behavior Engine",
  "File Engine",
  "Memory Engine",
  "Registry Engine",
  "Network Engine",
  "PowerShell Detection",
  "Persistence Detection",
  "Ransomware Detection",
];

const detections = [
  "DLL injection attempts",
  "Credential dumping patterns",
  "Living-off-the-land abuse",
  "Reverse shell beaconing",
  "Rapid encryption behavior",
  "Macro and script execution chains",
];

const roadmap = [
  "Phase 2: telemetry collectors for process, file, USB, and network data",
  "Phase 3: rule scoring, YARA workflows, quarantine, and incident timeline",
  "Phase 4: analyst notes, policy enforcement, and audit visibility",
  "Phase 5: local AI triage, explanation, and rule generation",
];


export const ThreatDetection = () => {
  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h4" fontWeight={700}>
          Threat Detection
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Behavioral, heuristic, and rule-driven detection surfaces for defensive operations.
        </Typography>
      </Stack>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={4}>
          <PanelCard title="Detection Engines" subtitle="Core engines planned across phases">
            <List disablePadding>
              {engines.map((engine) => (
                <ListItem key={engine} disableGutters sx={{ py: 1 }}>
                  <ListItemText primary={engine} />
                </ListItem>
              ))}
            </List>
          </PanelCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <PanelCard title="Detection Targets" subtitle="High-value attacker behaviors">
            <List disablePadding>
              {detections.map((detection) => (
                <ListItem key={detection} disableGutters sx={{ py: 1 }}>
                  <ListItemText primary={detection} />
                </ListItem>
              ))}
            </List>
          </PanelCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <PanelCard title="Execution Roadmap" subtitle="How the platform grows from foundation to enterprise">
            <List disablePadding>
              {roadmap.map((item) => (
                <ListItem key={item} disableGutters sx={{ py: 1 }}>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </PanelCard>
        </Grid>
      </Grid>
    </Stack>
  );
};
