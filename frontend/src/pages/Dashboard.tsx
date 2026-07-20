import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { MetricCard } from "../components/common/MetricCard";
import { PanelCard } from "../components/common/PanelCard";
import { getDashboard } from "../utils/api";


type DashboardState = {
  security_score: number;
  threat_level: string;
  metrics: Array<{ label: string; value: string; delta: string; status: string }>;
  alerts: Array<{
    id: number;
    title: string;
    severity: string;
    source: string;
    status: string;
    created_at: string;
  }>;
  timeline: Array<{ time: string; value: number }>;
  processes: Array<{ pid: number; name: string; cpu: number; memory: number; risk: string }>;
};


const fallbackDashboard: DashboardState = {
  security_score: 92,
  threat_level: "Elevated",
  metrics: [
    { label: "CPU Usage", value: "27%", delta: "-3%", status: "healthy" },
    { label: "Memory Usage", value: "61%", delta: "+4%", status: "warning" },
    { label: "Disk Usage", value: "48%", delta: "+1%", status: "healthy" },
    { label: "Network Traffic", value: "124 Mbps", delta: "+12%", status: "active" },
  ],
  alerts: [
    {
      id: 1001,
      title: "Suspicious PowerShell chain detected",
      severity: "high",
      source: "Behavior Engine",
      status: "investigating",
      created_at: new Date().toISOString(),
    },
    {
      id: 1002,
      title: "Unsigned executable downloaded",
      severity: "medium",
      source: "File Defender",
      status: "queued",
      created_at: new Date().toISOString(),
    },
  ],
  timeline: [
    { time: "08:00", value: 2 },
    { time: "10:00", value: 4 },
    { time: "12:00", value: 3 },
    { time: "14:00", value: 6 },
    { time: "16:00", value: 5 },
    { time: "18:00", value: 7 },
  ],
  processes: [
    { pid: 1884, name: "powershell.exe", cpu: 6.2, memory: 2.9, risk: "high" },
    { pid: 4120, name: "chrome.exe", cpu: 12.8, memory: 8.4, risk: "low" },
    { pid: 2456, name: "MsMpEng.exe", cpu: 4.1, memory: 6.8, risk: "trusted" },
  ],
};


export const Dashboard = () => {
  const [data, setData] = useState<DashboardState>(fallbackDashboard);
  const [loading, setLoading] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const payload = await getDashboard();
        setData(payload);
      } catch (error) {
        setOfflineMode(true);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const scoreTone = useMemo(() => {
    if (data.security_score >= 90) {
      return "success";
    }
    if (data.security_score >= 70) {
      return "warning";
    }
    return "error";
  }, [data.security_score]);

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Executive Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Unified visibility across endpoint, network, AI, and containment workflows.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5}>
          <Button variant="contained" startIcon={<PlayArrowRoundedIcon />}>
            Quick Scan
          </Button>
          <Button variant="outlined" startIcon={<AutoAwesomeRoundedIcon />}>
            AI Summary
          </Button>
        </Stack>
      </Stack>

      {offlineMode ? (
        <Alert severity="info">Backend unavailable, showing offline demo data for the dashboard.</Alert>
      ) : null}

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={3}>
          <PanelCard title="Security Score" subtitle="Overall system posture">
            {loading ? (
              <CircularProgress size={28} />
            ) : (
              <Stack spacing={2}>
                <Typography variant="h2">{data.security_score}</Typography>
                <Chip label={data.threat_level} color={scoreTone} variant="outlined" />
              </Stack>
            )}
          </PanelCard>
        </Grid>
        {data.metrics.map((metric) => (
          <Grid item xs={12} md={3} key={metric.label}>
            <MetricCard {...metric} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={8}>
          <PanelCard
            title="Threat Timeline"
            subtitle="Alert activity and behavioral risk trends across the day"
            minHeight={360}
          >
            <Box sx={{ width: "100%", height: 280 }}>
              <ResponsiveContainer>
                <AreaChart data={data.timeline}>
                  <defs>
                    <linearGradient id="threatGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2196F3" stopOpacity={0.7} />
                      <stop offset="95%" stopColor="#2196F3" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="time" stroke="#9CA8C3" />
                  <YAxis stroke="#9CA8C3" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#2196F3"
                    fillOpacity={1}
                    fill="url(#threatGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </PanelCard>
        </Grid>
        <Grid item xs={12} lg={4}>
          <PanelCard title="Latest Alerts" subtitle="High signal events waiting for triage" minHeight={360}>
            <List disablePadding>
              {data.alerts.map((alert) => (
                <ListItem
                  key={alert.id}
                  disableGutters
                  sx={{ py: 1.25, borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <ListItemText
                    primary={alert.title}
                    secondary={`${alert.source} • ${alert.status} • ${alert.severity.toUpperCase()}`}
                  />
                </ListItem>
              ))}
            </List>
          </PanelCard>
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <PanelCard title="Top Processes" subtitle="Current endpoint activity">
            <List disablePadding>
              {data.processes.map((process) => (
                <ListItem
                  key={process.pid}
                  disableGutters
                  sx={{ py: 1.25, borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <ListItemText
                    primary={`${process.name} (${process.pid})`}
                    secondary={`CPU ${process.cpu}% • Memory ${process.memory}% • Risk ${process.risk}`}
                  />
                </ListItem>
              ))}
            </List>
          </PanelCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <PanelCard title="Quick Actions" subtitle="Analyst workflows">
            <Stack spacing={1.5}>
              <Button variant="outlined" fullWidth>
                Launch Full Scan
              </Button>
              <Button variant="outlined" fullWidth>
                Review Quarantine
              </Button>
              <Button variant="outlined" fullWidth>
                Generate Incident Summary
              </Button>
              <Button variant="contained" fullWidth>
                Open AI Assistant
              </Button>
            </Stack>
          </PanelCard>
        </Grid>
      </Grid>
    </Stack>
  );
};
