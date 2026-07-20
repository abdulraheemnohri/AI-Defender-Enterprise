import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { SecurityCenter } from "./pages/SecurityCenter";
import { ThreatDetection } from "./pages/ThreatDetection";
import { AIBuilder } from "./pages/AIBuilder";
import { FirewallPage } from "./pages/FirewallPage";
import { NetworkPage } from "./pages/NetworkPage";
import { ReportsPage } from "./pages/ReportsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { Layout } from "./components/layout/Layout";


export const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/security-center" element={<SecurityCenter />} />
          <Route path="/threat-detection" element={<ThreatDetection />} />
          <Route path="/ai-defender" element={<AIBuilder />} />
          <Route path="/firewall" element={<FirewallPage />} />
          <Route path="/network" element={<NetworkPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
};
