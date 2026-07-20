import { PropsWithChildren, ReactNode } from "react";
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";


type PanelCardProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  action?: ReactNode;
  minHeight?: number;
}>;


export const PanelCard = ({
  title,
  subtitle,
  action,
  minHeight,
  children,
}: PanelCardProps) => {
  return (
    <Card sx={{ height: "100%", minHeight }}>
      <CardContent>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" mb={2}>
          <Box>
            <Typography variant="h6">{title}</Typography>
            {subtitle ? (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            ) : null}
          </Box>
          {action}
        </Stack>
        {children}
      </CardContent>
    </Card>
  );
};
