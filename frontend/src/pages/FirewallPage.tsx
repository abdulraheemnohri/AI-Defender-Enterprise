import { useEffect, useState } from "react";
import { Grid, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";

import { PanelCard } from "../components/common/PanelCard";
import { getFirewallRules } from "../utils/api";


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

  useEffect(() => {
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
        ]);
      }
    };

    loadRules();
  }, []);

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h4" fontWeight={700}>
          Firewall
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Application, IP, port, and schedule-aware rule management foundation.
        </Typography>
      </Stack>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={8}>
          <PanelCard title="Current Rules" subtitle="Seeded policy set from the backend">
            <List disablePadding>
              {rules.map((rule) => (
                <ListItem key={rule.id} disableGutters sx={{ py: 1.2 }}>
                  <ListItemText
                    primary={`${rule.name} • ${rule.action.toUpperCase()}`}
                    secondary={`${rule.target} • ${rule.protocol} • ${rule.enabled ? "Enabled" : "Disabled"}`}
                  />
                </ListItem>
              ))}
            </List>
          </PanelCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <PanelCard title="Next Phase" subtitle="Firewall roadmap">
            <Typography variant="body2" color="text.secondary">
              Upcoming work adds temporary rules, AI suggestions, policy promotion, import/export, and
              schedule enforcement.
            </Typography>
          </PanelCard>
        </Grid>
      </Grid>
    </Stack>
  );
};
