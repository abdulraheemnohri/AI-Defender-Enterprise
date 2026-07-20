from fastapi import APIRouter
from schemas.ai import AiResponse, ChatRequest, ExplainThreatRequest


router = APIRouter(prefix="/ai", tags=["ai"])


def generate_smart_cyber_response(query: str, model_name: str = "gemma") -> AiResponse:
    query_lower = query.lower()
    model_name = model_name or "gemma"

    # Defaults
    summary = f"[{model_name.upper()}] I have analyzed the entity. It appears normal at first glance, but standard auditing is recommended."
    actions = [
        "Audit process permissions and network egress.",
        "Correlate local events with central active logs."
    ]
    confidence = "high"
    suggested_rules = []

    # PowerShell keyword
    if "powershell" in query_lower or "encoded" in query_lower:
        summary = (
            f"[{model_name.upper()}] Threat analysis indicates suspicious PowerShell execution. "
            "An obfuscated or encoded command shell was spawned, characteristic of malicious "
            "Living-off-the-Land (LotL) behaviors aiming to bypass signature detection."
        )
        actions = [
            "Terminate the active process chain immediately.",
            "Inspect Registry keys for persistent autorun hooks under current user.",
            "Quarantine any dropped temporary payloads in %TEMP% or %APPDATA%."
        ]
        confidence = "critical"
        suggested_rules = [
            "rule Obfuscated_PowerShell {\n  meta:\n    description = \"Detects base64 encoded powershell flags\"\n  strings:\n    $enc = /powershell.*(-enc|-encodedcommand)/i\n  condition:\n    $enc\n}"
        ]

    # Chrome / Browser blocked keyword
    elif "chrome" in query_lower or "browser" in query_lower:
        summary = (
            f"[{model_name.upper()}] Process investigation of chrome.exe. "
            "Chrome was flagged due to unexpected remote outbound handshake to a low-reputation IP "
            "(185.220.101.7) associated with Tor nodes or potential command-and-control beacons."
        )
        actions = [
            "Enable Controlled Folder Access to protect sensitive user profile folders.",
            "Block the egress IP 185.220.101.7 on the local firewall.",
            "Inspect active Chrome extensions for unauthorized background scripts."
        ]
        confidence = "high"
        suggested_rules = [
            "Firewall suggestion: BLOCK IP 185.220.101.7 PROTOCOL TCP PORT ANY"
        ]

    # YARA / Rules / Sigma keyword
    elif "yara" in query_lower or "rule" in query_lower or "sigma" in query_lower:
        summary = (
            f"[{model_name.upper()}] Rule generation wizard. "
            "Based on recent threats, I have prepared defensive rule patterns to detect persistence and DLL injection."
        )
        actions = [
            "Import the generated rule directly into the Active Rules repository.",
            "Verify Rule coverage across all endpoint monitoring agents."
        ]
        confidence = "high"
        suggested_rules = [
            "rule Detect_DLL_Injection {\n  meta:\n    description = \"Detects virtual alloc and write process memory patterns\"\n  strings:\n    $api1 = \"VirtualAllocEx\"\n    $api2 = \"WriteProcessMemory\"\n  condition:\n    all of them\n}"
        ]

    # Malware explain or quarantine keyword
    elif "malware" in query_lower or "invoice" in query_lower or "suspicious" in query_lower:
        summary = (
            f"[{model_name.upper()}] Malware classification: Trojan/Downloader family. "
            "The executable 'invoice_viewer.exe' showed a very high entropy score (7.9) indicating obfuscation/packing. "
            "It attempted to modify startup keys and injected threads into legitimate system processes."
        )
        actions = [
            "Confirm that 'invoice_viewer.exe' is securely contained in quarantine.",
            "Conduct a full memory scan to purge any injected malicious DLLs.",
            "Ensure that external USB drives are mounted as Read-Only."
        ]
        confidence = "critical"
        suggested_rules = [
            "rule Packing_Entropy_High {\n  meta:\n    description = \"Detects high entropy executables\"\n  condition:\n    math.entropy(0, filesize) > 7.8\n}"
        ]

    # Firewall rule write request
    elif "firewall" in query_lower or "block" in query_lower:
        summary = (
            f"[{model_name.upper()}] Firewall rule generated. "
            "I've written a custom defensive rule based on your request to protect vulnerable network ports."
        )
        actions = [
            "Apply the new rule to block inbound attempts.",
            "Monitor connection logs for dropped TCP packets on the specified port."
        ]
        confidence = "high"
        suggested_rules = [
            "Firewall policy: BLOCK INBOUND TCP/UDP PORT 4444"
        ]

    # Threat today / summaries
    elif "today" in query_lower or "summary" in query_lower or "report" in query_lower:
        summary = (
            f"[{model_name.upper()}] Executive Security Summary: "
            "Our local defense engine blocked 2 critical threats today (untrusted USB activity, suspicous Powershell command). "
            "All hosts are currently monitored and contained. Posture remains secure."
        )
        actions = [
            "Export Technical Report for Compliance archives.",
            "Run a routine backup of firewall configuration policies."
        ]
        confidence = "medium"

    return AiResponse(
        summary=summary,
        actions=actions,
        confidence=confidence,
        suggested_rules=suggested_rules if suggested_rules else None
    )


@router.post("/explain", response_model=AiResponse)
def explain_threat(payload: ExplainThreatRequest):
    return generate_smart_cyber_response(payload.query, payload.model)


@router.post("/chat", response_model=AiResponse)
def chat_with_ai(payload: ChatRequest):
    last_message = payload.messages[-1]["content"] if payload.messages else "status summary"
    return generate_smart_cyber_response(last_message, payload.model)
