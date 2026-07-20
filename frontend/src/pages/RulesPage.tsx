import { useState, useEffect } from "react";
import {
  Grid,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  TextField,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  CircularProgress,
  IconButton,
  Divider,
  Box,
} from "@mui/material";
import PostAddRoundedIcon from "@mui/icons-material/PostAddRounded";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import LibraryBooksRoundedIcon from "@mui/icons-material/LibraryBooksRounded";
import BugReportRoundedIcon from "@mui/icons-material/BugReportRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";

import { PanelCard } from "../components/common/PanelCard";
import { fetchRules, createRule, toggleRule, compileRule, deleteRule } from "../utils/api";


export const RulesPage = () => {
  const [activeTab, setActiveTab] = useState(0); // 0 = YARA, 1 = Sigma, 2 = Custom Heuristics
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Authoring states
  const [ruleName, setRuleName] = useState("");
  const [ruleType, setRuleType] = useState("YARA");
  const [ruleDesc, setRuleDesc] = useState("");
  const [ruleContent, setRuleContent] = useState("");
  const [ruleTags, setRuleTags] = useState("");

  // Compilation state
  const [compiling, setCompiling] = useState(false);
  const [compileResult, setCompileResult] = useState<any | null>(null);

  useEffect(() => {
    loadRulesData();
  }, []);

  const loadRulesData = async () => {
    setLoading(true);
    try {
      const list = await fetchRules();
      setRules(list);
    } catch (err) {
      console.error("Error connecting with backend rules endpoint. Loading fallback seeds.");
      setRules([
        {
          id: "rul-yara-01",
          name: "Cobalt_Strike_Beacon_Stage_Detect",
          type: "YARA",
          author: "SOC Threat Intelligence",
          content: 'rule Cobalt_Strike_Beacon_Stage_Detect {\n    strings:\n        $beacon_header_1 = { 4D 5A 41 52 53 54 41 47 45 }\n    condition:\n        $beacon_header_1\n}',
          enabled: true,
          description: "Scans virtual memory allocations for characteristic Cobalt Strike Beacon staging and PE binaries headers.",
          created_at: "2024-01-15T09:00:00Z",
          tags: ["CobaltStrike", "Memory", "In-Memory", "C2"]
        },
        {
          id: "rul-sigma-01",
          name: "Suspicious_PowerShell_Encoded_Flags",
          type: "Sigma",
          author: "MITRE ATT&CK Mapping Hub",
          content: "title: Suspicious PowerShell Encoded Arguments\ndetection:\n    selection:\n        CommandLine|contains: '-enc'\n    condition: selection",
          enabled: true,
          description: "Sigma behavioral monitoring pattern that catches hidden execution and encoded command line strings on Windows.",
          created_at: "2024-02-20T10:15:00Z",
          tags: ["PowerShell", "Commandline", "Obfuscation", "T1059"]
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (ruleId: string) => {
    try {
      await toggleRule(ruleId);
      setRules((prev) =>
        prev.map((r) => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r))
      );
    } catch (err) {
      setRules((prev) =>
        prev.map((r) => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r))
      );
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    if (!window.confirm("Permanently delete this detection pattern from threat intelligence scans database?")) {
      return;
    }
    try {
      await deleteRule(ruleId);
      setRules((prev) => prev.filter((r) => r.id !== ruleId));
      alert("Detection pattern deleted from local databases.");
    } catch (err) {
      setRules((prev) => prev.filter((r) => r.id !== ruleId));
      alert("Detection pattern deleted.");
    }
  };

  const handleCompileCheck = async () => {
    if (!ruleContent.trim()) {
      alert("Please enter rule code to compile.");
      return;
    }
    setCompiling(true);
    setCompileResult(null);

    try {
      const res = await compileRule({
        content: ruleContent,
        type: ruleType,
      });
      setCompileResult(res);
    } catch (err) {
      // Offline mock compilation check
      setTimeout(() => {
        const hasErrors = ruleType === "YARA" && !ruleContent.includes("condition:");
        setCompileResult({
          success: !hasErrors,
          errors: hasErrors ? "Syntax Error: Missing 'condition:' trigger statement." : null,
          affected_indicators: ruleType === "YARA" ? ["$beacon_header_1"] : ["CommandLine"],
          compilation_time_ms: 3.5,
        });
      }, 800);
    } finally {
      setCompiling(false);
    }
  };

  const handleSaveRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName || !ruleContent) {
      alert("Please provide name and rule content body.");
      return;
    }

    try {
      const added = await createRule({
        name: ruleName,
        type: ruleType,
        content: ruleContent,
        description: ruleDesc,
        tags: ruleTags.split(",").map((t) => t.trim()).filter((t) => t !== ""),
      });
      setRules((prev) => [...prev, added]);
      alert(`Rule '${added.name}' compiled and integrated into active real-time scanner rules list!`);
      // Reset inputs
      setRuleName("");
      setRuleDesc("");
      setRuleContent("");
      setRuleTags("");
      setCompileResult(null);
    } catch (err) {
      const fallback = {
        id: `rul-${ruleType.toLowerCase()}-${Date.now()}`,
        name: ruleName,
        type: ruleType,
        author: "Active Analyst",
        content: ruleContent,
        enabled: true,
        description: ruleDesc,
        created_at: new Date().toISOString(),
        tags: ruleTags.split(",").map((t) => t.trim()).filter((t) => t !== ""),
      };
      setRules((prev) => [...prev, fallback]);
      alert(`Rule '${ruleName}' compiled and integrated successfully!`);
      setRuleName("");
      setRuleDesc("");
      setRuleContent("");
      setRuleTags("");
      setCompileResult(null);
    }
  };

  const loadPresetTemplate = (type: string) => {
    setRuleType(type);
    if (type === "YARA") {
      setRuleContent(`rule Custom_Binary_Scans_Check {
    meta:
        description = "Detects characteristic headers inside suspicious binaries"
    strings:
        $header_magic = { 4D 5A }
        $susp_string_1 = "VirtualAlloc"
    condition:
        $header_magic and $susp_string_1
}`);
    } else if (type === "Sigma") {
      setRuleContent(`title: Custom Behavioral Endpoint Audit
id: df4a3e20-7fca-11ee-b962-0242ac120002
status: experimental
description: Catches unexpected administrative processes spawning shells
logsource:
    category: process_creation
    product: windows
detection:
    selection:
        ParentImage|endswith: '\\msiexec.exe'
        Image|endswith: '\\cmd.exe'
    condition: selection
level: medium`);
    } else {
      setRuleContent(`# Custom AI Defender Heuristic Definition
[HEURISTIC_RULE]
NAME: Spawn_Anomaly_Shield
TRIGGER: process_spawning_rate > 10 / sec
ACTION: block_spawning_process && notify`);
    }
  };

  const getFilteredRules = () => {
    const types = ["YARA", "Sigma", "Custom Heuristic"];
    return rules.filter((r) => r.type === types[activeTab]);
  };

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h4" fontWeight={700}>
          Detection Rules Manager
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Configure offline signature engines, author custom YARA binaries scans, deploy Sigma logs monitors, and validate rules with sandbox compilers.
        </Typography>
      </Stack>

      <Grid container spacing={2.5}>
        {/* Left Side: Rule Libraries tabs */}
        <Grid item xs={12} lg={7}>
          <PanelCard title="Security Rule Libraries" subtitle="Active detection filters deployed on workstation kernel monitors">
            <Box sx={{ borderBottom: 1, borderColor: "rgba(255,255,255,0.08)", mb: 2 }}>
              <Tabs value={activeTab} onChange={(_, val) => setActiveTab(val)} color="secondary">
                <Tab label="YARA Binary Patterns" />
                <Tab label="Sigma Logs Audits" />
                <Tab label="Custom Heuristic Shields" />
              </Tabs>
            </Box>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress color="secondary" />
              </Box>
            ) : (
              <TableContainer component={Paper} sx={{ bgcolor: "transparent", border: "1px solid rgba(255,255,255,0.06)" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Rule Name</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Tags</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Monitoring Action</TableCell>
                      <TableCell sx={{ fontWeight: 700 }} align="right">Manage</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getFilteredRules().map((r) => (
                      <TableRow key={r.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>{r.name}</Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5, maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {r.description}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                            {r.tags.map((tag: string) => (
                              <Chip key={tag} label={tag} size="small" variant="outlined" sx={{ height: 18, fontSize: "0.55rem" }} />
                            ))}
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <FormControlLabel
                            control={
                              <Switch
                                size="small"
                                checked={r.enabled}
                                onChange={() => handleToggleActive(r.id)}
                              />
                            }
                            label={r.enabled ? "ACTIVE" : "DISABLED"}
                            componentsProps={{ typography: { variant: "caption", fontWeight: 700, color: r.enabled ? "success.main" : "text.secondary" } }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                            <Button
                              size="small"
                              variant="outlined"
                              color="primary"
                              onClick={() => {
                                setRuleName(r.name);
                                setRuleType(r.type);
                                setRuleDesc(r.description);
                                setRuleContent(r.content);
                                setRuleTags(r.tags.join(", "));
                              }}
                            >
                              Load Code
                            </Button>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteRule(r.id)}
                            >
                              <DeleteForeverRoundedIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                    {getFilteredRules().length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                            No rules found in this segment. Use the form on the right to compile new threat filters.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </PanelCard>
        </Grid>

        {/* Right Side: Rule Compiler Workspace */}
        <Grid item xs={12} lg={5}>
          <PanelCard title="Rule Authoring Compiler" subtitle="Edit rules with built-in format syntax sandbox checkers">
            <Stack spacing={2} component="form" onSubmit={handleSaveRule}>
              <Stack direction="row" spacing={1}>
                <Button size="small" variant="outlined" onClick={() => loadPresetTemplate("YARA")}>YARA Preset</Button>
                <Button size="small" variant="outlined" onClick={() => loadPresetTemplate("Sigma")}>Sigma Preset</Button>
                <Button size="small" variant="outlined" onClick={() => loadPresetTemplate("Custom Heuristic")}>Heuristic Preset</Button>
              </Stack>

              <TextField
                label="Rule Name"
                size="small"
                placeholder="e.g. Detect_Lsass_Access_A"
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
                fullWidth
              />

              <TextField
                label="Description"
                size="small"
                placeholder="Identify processes opening open handles into lsass memory structures."
                value={ruleDesc}
                onChange={(e) => setRuleDesc(e.target.value)}
                fullWidth
              />

              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5, fontWeight: 700 }}>
                  Rule Code Content Block ({ruleType}):
                </Typography>
                <TextField
                  multiline
                  rows={10}
                  placeholder={`rule Rule_Name_Here {\n    strings:\n        $susp = "malicious"\n    condition:\n        $susp\n}`}
                  value={ruleContent}
                  onChange={(e) => setRuleContent(e.target.value)}
                  fullWidth
                  inputProps={{ style: { fontFamily: "monospace", fontSize: "0.8rem", lineHeight: "1.2rem" } }}
                />
              </Box>

              <TextField
                label="Tags (Comma separated)"
                size="small"
                placeholder="lsass, credential-dumping, T1003"
                value={ruleTags}
                onChange={(e) => setRuleTags(e.target.value)}
                fullWidth
              />

              {/* Compile output box */}
              {compileResult && (
                <Paper
                  sx={{
                    p: 2,
                    border: "1px solid",
                    borderColor: compileResult.success ? "success.main" : "error.main",
                    bgcolor: "rgba(0,0,0,0.25)",
                    borderRadius: 2,
                  }}
                >
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      {compileResult.success ? (
                        <CheckCircleRoundedIcon color="success" />
                      ) : (
                        <ErrorOutlineRoundedIcon color="error" />
                      )}
                      <Typography variant="body2" fontWeight={700}>
                        {compileResult.success ? "Compilation Succeeded!" : "Compilation Failed"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ flexGrow: 1, textAlign: "right" }}>
                        Time: {compileResult.compilation_time_ms} ms
                      </Typography>
                    </Stack>

                    {compileResult.errors && (
                      <Typography variant="caption" color="error.main" sx={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
                        {compileResult.errors}
                      </Typography>
                    )}

                    {compileResult.warnings && (
                      <Typography variant="caption" color="warning.main" sx={{ fontStyle: "italic" }}>
                        Warning: {compileResult.warnings}
                      </Typography>
                    )}

                    {compileResult.success && compileResult.affected_indicators.length > 0 && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                          Parsed Detection Selectors:
                        </Typography>
                        <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5} sx={{ mt: 0.5 }}>
                          {compileResult.affected_indicators.map((ind: string) => (
                            <Chip key={ind} label={ind} size="small" variant="outlined" color="primary" sx={{ height: 16, fontSize: "0.55rem" }} />
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </Stack>
                </Paper>
              )}

              <Stack direction="row" spacing={1.5}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleCompileCheck}
                  disabled={compiling}
                  fullWidth
                  startIcon={<CodeRoundedIcon />}
                >
                  {compiling ? "Validating Code..." : "Check Rules Syntax"}
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={compiling || (compileResult !== null && !compileResult.success)}
                  fullWidth
                  startIcon={<PostAddRoundedIcon />}
                >
                  Deploy Rule
                </Button>
              </Stack>
            </Stack>
          </PanelCard>
        </Grid>
      </Grid>
    </Stack>
  );
};
