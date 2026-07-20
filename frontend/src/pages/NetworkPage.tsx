import { useEffect, useState } from "react";
import { Grid, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";

import { PanelCard } from "../components/common/PanelCard";
import { getNetworkConnections } from "../utils/api";


type Connection = {
  protocol: string;
  local_address: string;
  remote_address: string;
  state: string;
  reputation: string;
};


type NetworkState = {
  total_connections: number;
  suspicious_connections: number;
  inbound_bandwidth: string;
  outbound_bandwidth: string;
  connections: Connection[];
};


const fallbackState: NetworkState = {
  total_connections: 38,
  suspicious_connections: 2,
  inbound_bandwidth: "18 Mbps",
  outbound_bandwidth: "106 Mbps",
  connections: [
    {
      protocol: "TCP",
      local_address: "10.0.0.24:49801",
      remote_address: "185.220.101.7:8080",
      state: "ESTABLISHED",
      reputation: "suspicious",
    },
  ],
};


export const NetworkPage = () => {
  const [network, setNetwork] = useState<NetworkState>(fallbackState);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getNetworkConnections();
        setNetwork(data);
      } catch (error) {
        setNetwork(fallbackState);
      }
    };

    load();
  }, []);

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h4" fontWeight={700}>
          Network Security
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Live connections, bandwidth, and suspicious communication visibility.
        </Typography>
      </Stack>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={4}>
          <PanelCard title="Connection Summary" subtitle="Current network posture">
            <Stack spacing={1}>
              <Typography variant="body1">Total connections: {network.total_connections}</Typography>
              <Typography variant="body1">
                Suspicious connections: {network.suspicious_connections}
              </Typography>
              <Typography variant="body1">Inbound bandwidth: {network.inbound_bandwidth}</Typography>
              <Typography variant="body1">Outbound bandwidth: {network.outbound_bandwidth}</Typography>
            </Stack>
          </PanelCard>
        </Grid>
        <Grid item xs={12} md={8}>
          <PanelCard title="Live Connections" subtitle="Seeded connection feed">
            <List disablePadding>
              {network.connections.map((connection) => (
                <ListItem key={`${connection.local_address}-${connection.remote_address}`} disableGutters sx={{ py: 1.2 }}>
                  <ListItemText
                    primary={`${connection.local_address} → ${connection.remote_address}`}
                    secondary={`${connection.protocol} • ${connection.state} • ${connection.reputation}`}
                  />
                </ListItem>
              ))}
            </List>
          </PanelCard>
        </Grid>
      </Grid>
    </Stack>
  );
};
