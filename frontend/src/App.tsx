# Frontend App Router
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { SecurityCenter } from "./pages/SecurityCenter";
import { ThreatDetection } from "./pages/ThreatDetection";
import { Layout } from "./components/layout/Layout";

export const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/security-center" element={<SecurityCenter />} />
          <Route path="/threat-detection" element={<ThreatDetection />} />
        </Routes>
      </Layout>
    </Router>
  );
};