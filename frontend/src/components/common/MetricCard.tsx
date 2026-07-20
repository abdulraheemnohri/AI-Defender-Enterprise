import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import { Chip, Stack, Typography } from "@mui/material";

import { PanelCard } from "./PanelCard";


type MetricCardProps = {
  label: string;
  value: string;
  delta: string;
  status: string;
};


const getChipColor = (status: string) => {
  if (status === "warning") {
    return "warning";
  }

  if (status === "healthy" || status === "trusted") {
    return "success";
  }

  return "primary";
};


export const MetricCard = ({ label, value, delta, status }: MetricCardProps) => {
  const isPositive = delta.trim().startsWith("+");

  return (
    <PanelCard title={label}>
      <Stack spacing={1.5}>
        <Typography variant="h4" fontWeight={700}>
          {value}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            size="small"
            color={getChipColor(status)}
            label={status.toUpperCase()}
            variant="outlined"
          />
          <Stack direction="row" spacing={0.5} alignItems="center">
            {isPositive ? (
              <TrendingUpRoundedIcon fontSize="small" color="warning" />
            ) : (
              <TrendingDownRoundedIcon fontSize="small" color="success" />
            )}
            <Typography variant="body2" color="text.secondary">
              {delta} vs last hour
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </PanelCard>
  );
};
