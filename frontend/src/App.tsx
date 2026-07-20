import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { SecurityCenter } from "./pages/SecurityCenter";
import { ThreatDetection } from "./pages/ThreatDetection";
import { AIBuilder } from "./pages/AIBuilder";
import { FirewallPage } from "./pages/FirewallPage";
import { NetworkPage } from "./pages/NetworkPage";
import { ReportsPage } from "./pages/ReportsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { Login } from "./pages/Login";
import { Layout } from "./components/layout/Layout";


export const App = () => {
  const [session, setSession] = useState<{ username: string; role: string; token: string } | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("ai_defender_session");
    if (saved) {
      try {
        setSession(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem("ai_defender_session");
      }
    }
  }, []);

  const handleLoginSuccess = (newSession: { username: string; role: string; token: string }) => {
    localStorage.setItem("ai_defender_session", JSON.stringify(newSession));
    setSession(newSession);
    setIsLocked(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("ai_defender_session");
    setSession(null);
    setIsLocked(false);
  };

  const handleLockConsole = () => {
    setIsLocked(true);
  };

  const handleUnlockConsole = () => {
    setIsLocked(false);
  };

  // Render Login if no active session
  if (!session) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Render temporary PIN/Password unlock screen if locked
  if (isLocked) {
    return (
      <Login
        onLoginSuccess={(s) => {
          if (s.role === session.role) {
            setIsLocked(false);
          } else {
            handleLoginSuccess(s);
          }
        }}
      />
    );
  }

  return (
    <Router>
      <Layout
        session={session}
        onLogout={handleLogout}
        onLock={handleLockConsole}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/security-center" element={<SecurityCenter />} />
          <Route path="/threat-detection" element={<ThreatDetection />} />
          <Route path="/ai-defender" element={<AIBuilder />} />
          <Route path="/firewall" element={<FirewallPage />} />
          <Route path="/network" element={<NetworkPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};
