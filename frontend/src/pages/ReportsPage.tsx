import { Grid, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";

import { PanelCard } from "../components/common/PanelCard";


const reportTypes = ["Executive", "Technical", "Compliance", "Daily", "Weekly", "Monthly", "Custom"];
const exportFormats = ["PDF", "Excel", "CSV"];


export const ReportsPage = () => {
  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h4" fontWeight={700}>
          Reports
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Reporting surfaces for leadership, analysts, and compliance workflows.
        </Typography>
      </Stack>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <PanelCard title="Report Types" subtitle="Current scope from the master prompt">
            <List disablePadding>
              {reportTypes.map((type) => (
                <ListItem key={type} disableGutters sx={{ py: 1 }}>
                  <ListItemText primary={type} />
                </ListItem>
              ))}
            </List>
          </PanelCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <PanelCard title="Export Formats" subtitle="Planned output channels">
            <List disablePadding>
              {exportFormats.map((format) => (
                <ListItem key={format} disableGutters sx={{ py: 1 }}>
                  <ListItemText primary={format} />
                </ListItem>
              ))}
            </List>
          </PanelCard>
        </Grid>
      </Grid>
    </Stack>
  );
};
