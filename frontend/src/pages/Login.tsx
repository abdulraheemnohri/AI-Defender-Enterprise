import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Alert,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Avatar,
  Paper,
} from "@mui/material";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import LockOpenRoundedIcon from "@mui/icons-material/LockOpenRounded";
import KeyRoundedIcon from "@mui/icons-material/KeyRounded";
import { loginUser, verifyMFA } from "../utils/api";


type LoginProps = {
  onLoginSuccess: (session: { username: string; role: string; token: string }) => void;
};


export const Login = ({ onLoginSuccess }: LoginProps) => {
  const [username, setUsername] = useState("administrator");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [role, setRole] = useState("Administrator");
  const [usePin, setUsePin] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);

  // Flow states
  const [mfaToken, setMfaToken] = useState<string | null>(null);
  const [mfaCode, setMfaCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMsg(null);
    setLoading(true);

    try {
      // Input validation
      if (!usePin && !password) {
        throw new Error("Password is required. (Hint: use 'admin123')");
      }
      if (usePin && !pin) {
        throw new Error("PIN is required. (Hint: use '1234')");
      }

      const res = await loginUser({
        username,
        password: usePin ? undefined : password,
        pin: usePin ? pin : undefined,
        role,
        remember_me: rememberDevice,
      });

      if (res.requires_2fa) {
        setMfaToken(res.token);
        setInfoMsg("Multi-Factor Authentication (MFA) required. A mock verification code has been sent to your device. Hint: Enter '123456'");
      } else {
        // Direct login success
        onLoginSuccess({
          username: res.username,
          role: res.role,
          token: res.token || "demo-token",
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || "Failed to authenticate.");
    } finally {
      setLoading(false);
    }
  };

  const handleMFAVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!mfaCode) {
        throw new Error("MFA Code is required. Hint: use '123456'");
      }

      const res = await verifyMFA({
        token: mfaToken || "demo-token",
        code: mfaCode,
      });

      onLoginSuccess({
        username: res.username,
        role: role, // Keep original role chosen
        token: res.token || "demo-token",
      });
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || "Invalid MFA code. Try '123456'");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#050814",
        backgroundImage:
          "radial-gradient(circle at 50% 14%, rgba(33, 150, 243, 0.15), rgba(156, 39, 176, 0.05), transparent 60%)",
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 450,
          width: "100%",
          boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
          border: "1.5px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(20px)",
          backgroundImage: "linear-gradient(180deg, rgba(19, 27, 49, 0.95), rgba(11, 16, 32, 0.98))",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            py: 4,
            px: 3,
            textAlign: "center",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            bgcolor: "rgba(33, 150, 243, 0.03)",
          }}
        >
          <Stack spacing={1.5} alignItems="center">
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 56,
                height: 56,
                boxShadow: "0 0 20px rgba(33, 150, 243, 0.4)",
              }}
            >
              <VerifiedUserRoundedIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={800} letterSpacing={0.5}>
                AI Defender Enterprise
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Secure Local Cybersecurity Command Hub
              </Typography>
            </Box>
          </Stack>
        </Box>

        <CardContent sx={{ p: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {infoMsg && (
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              {infoMsg}
            </Alert>
          )}

          {!mfaToken ? (
            <Box component="form" onSubmit={handleLogin}>
              <Stack spacing={3}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel id="role-select-label">Select Role Mode</InputLabel>
                  <Select
                    labelId="role-select-label"
                    value={role}
                    label="Select Role Mode"
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <MenuItem value="Administrator">Administrator (Full Access + MFA)</MenuItem>
                    <MenuItem value="Security Analyst">Security Analyst (Triage + MFA)</MenuItem>
                    <MenuItem value="SOC Operator">SOC Operator (Monitoring + MFA)</MenuItem>
                    <MenuItem value="Auditor">Compliance Auditor (Logs Only)</MenuItem>
                    <MenuItem value="Read Only">Read Only Viewer</MenuItem>
                    <MenuItem value="Guest">External Guest (Sandboxed)</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label="Analyst Username"
                  size="small"
                  fullWidth
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="administrator"
                />

                {usePin ? (
                  <TextField
                    label="Local PIN Code"
                    type="password"
                    size="small"
                    fullWidth
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Enter 4-digit PIN (e.g. 1234)"
                    helperText="PIN is configured for device local unlock."
                  />
                ) : (
                  <TextField
                    label="Enterprise Password"
                    type="password"
                    size="small"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Password (e.g. admin123)"
                  />
                )}

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={rememberDevice}
                        onChange={(e) => setRememberDevice(e.target.checked)}
                      />
                    }
                    label={
                      <Typography variant="caption" color="text.secondary">
                        Remember workstation
                      </Typography>
                    }
                  />
                  <Button
                    size="small"
                    onClick={() => {
                      setUsePin(!usePin);
                      setError(null);
                    }}
                    sx={{ textTransform: "none", fontSize: "0.75rem" }}
                  >
                    {usePin ? "Use Password Login" : "Use PIN Unlock"}
                  </Button>
                </Stack>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  endIcon={loading ? <CircularProgress size={16} color="inherit" /> : <LockOpenRoundedIcon />}
                  sx={{ py: 1.2, fontWeight: 700, boxShadow: "0 4px 14px rgba(33, 150, 243, 0.3)" }}
                >
                  {loading ? "Verifying..." : "Unlock Console"}
                </Button>
              </Stack>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleMFAVerify}>
              <Stack spacing={3}>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  An authenticator token has been generated. Please enter the 6-digit MFA token to proceed.
                </Typography>

                <TextField
                  label="6-Digit Verification Code"
                  size="medium"
                  fullWidth
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  placeholder="Enter 123456"
                  inputProps={{ style: { textAlign: "center", fontSize: "1.2rem", letterSpacing: 4 } }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  endIcon={loading ? <CircularProgress size={16} color="inherit" /> : <KeyRoundedIcon />}
                  sx={{ py: 1.2, fontWeight: 700 }}
                >
                  {loading ? "Validating Token..." : "Confirm & Unlock"}
                </Button>

                <Button
                  variant="text"
                  fullWidth
                  onClick={() => {
                    setMfaToken(null);
                    setMfaCode("");
                    setError(null);
                    setInfoMsg(null);
                  }}
                  sx={{ textTransform: "none", color: "text.secondary" }}
                >
                  Go Back
                </Button>
              </Stack>
            </Box>
          )}
        </CardContent>

        <Box sx={{ p: 2, borderTop: "1px solid rgba(255, 255, 255, 0.08)", textAlign: "center" }}>
          <Typography variant="caption" color="text.secondary">
            AI Defender Platform Mode: Fully Offline & Private
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};
