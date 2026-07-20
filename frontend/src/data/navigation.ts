import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import RadarRoundedIcon from "@mui/icons-material/RadarRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import HubRoundedIcon from "@mui/icons-material/HubRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";


export const navigationItems = [
  { label: "Dashboard", path: "/", icon: DashboardRoundedIcon },
  { label: "Security Center", path: "/security-center", icon: SecurityRoundedIcon },
  { label: "Threat Detection", path: "/threat-detection", icon: RadarRoundedIcon },
  { label: "AI Defender", path: "/ai-defender", icon: PsychologyRoundedIcon },
  { label: "Firewall", path: "/firewall", icon: ShieldRoundedIcon },
  { label: "Network", path: "/network", icon: HubRoundedIcon },
  { label: "Reports", path: "/reports", icon: DescriptionRoundedIcon },
  { label: "Settings", path: "/settings", icon: SettingsRoundedIcon },
];
