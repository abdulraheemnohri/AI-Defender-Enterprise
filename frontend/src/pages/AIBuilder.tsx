import { Grid, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";

import { PanelCard } from "../components/common/PanelCard";


const models = ["Gemma", "Phi", "Qwen", "TinyLlama", "SmolLM", "DeepSeek distilled", "ONNX", "GGUF"];

const capabilities = [
  "Threat explanation",
  "Risk scoring",
  "Incident summaries",
  "Root cause analysis",
  "Recommended actions",
  "Rule generation",
];


export const AIBuilder = () => {
  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h4" fontWeight={700}>
          AI Defender
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Offline-first intelligence for explanation, prioritization, and analyst support.
        </Typography>
      </Stack>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <PanelCard title="Supported Local Models" subtitle="Planned runtime coverage">
            <List disablePadding>
              {models.map((model) => (
                <ListItem key={model} disableGutters sx={{ py: 1 }}>
                  <ListItemText primary={model} />
                </ListItem>
              ))}
            </List>
          </PanelCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <PanelCard title="AI Capabilities" subtitle="Phase 5 target scope">
            <List disablePadding>
              {capabilities.map((capability) => (
                <ListItem key={capability} disableGutters sx={{ py: 1 }}>
                  <ListItemText primary={capability} />
                </ListItem>
              ))}
            </List>
          </PanelCard>
        </Grid>
      </Grid>
    </Stack>
  );
};
