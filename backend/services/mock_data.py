from datetime import datetime, timedelta


def build_dashboard_payload():
    now = datetime.utcnow()

    return {
        "security_score": 92,
        "threat_level": "Elevated",
        "metrics": [
            {"label": "CPU Usage", "value": "27%", "delta": "-3%", "status": "healthy"},
            {"label": "Memory Usage", "value": "61%", "delta": "+4%", "status": "warning"},
            {"label": "Disk Usage", "value": "48%", "delta": "+1%", "status": "healthy"},
            {"label": "Network Traffic", "value": "124 Mbps", "delta": "+12%", "status": "active"},
        ],
        "alerts": [
            {
                "id": 1001,
                "title": "Suspicious PowerShell chain detected",
                "severity": "high",
                "source": "Behavior Engine",
                "status": "investigating",
                "created_at": (now - timedelta(minutes=12)).isoformat(),
            },
            {
                "id": 1002,
                "title": "Unsigned executable downloaded",
                "severity": "medium",
                "source": "File Defender",
                "status": "queued",
                "created_at": (now - timedelta(minutes=31)).isoformat(),
            },
            {
                "id": 1003,
                "title": "Untrusted USB device attached",
                "severity": "medium",
                "source": "USB Defender",
                "status": "contained",
                "created_at": (now - timedelta(hours=1, minutes=8)).isoformat(),
            },
        ],
        "timeline": [
            {"time": "08:00", "value": 2},
            {"time": "10:00", "value": 4},
            {"time": "12:00", "value": 3},
            {"time": "14:00", "value": 6},
            {"time": "16:00", "value": 5},
            {"time": "18:00", "value": 7},
        ],
        "processes": [
            {"pid": 4120, "name": "chrome.exe", "cpu": 12.8, "memory": 8.4, "risk": "low"},
            {"pid": 1884, "name": "powershell.exe", "cpu": 6.2, "memory": 2.9, "risk": "high"},
            {"pid": 2456, "name": "MsMpEng.exe", "cpu": 4.1, "memory": 6.8, "risk": "trusted"},
            {"pid": 5228, "name": "onedrive.exe", "cpu": 2.7, "memory": 3.2, "risk": "medium"},
        ],
    }


def build_system_payload():
    return {
        "hostname": "AI-DEFENDER-LAB",
        "os": "Windows 11 Enterprise",
        "uptime": "4d 07h 18m",
        "resources": {"cpu": 27.0, "memory": 61.0, "disk": 48.0},
        "firewall_status": "Enabled",
        "antivirus_status": "Protected",
        "ai_status": "Local model ready",
    }


def build_connections_payload():
    return {
        "total_connections": 38,
        "suspicious_connections": 2,
        "inbound_bandwidth": "18 Mbps",
        "outbound_bandwidth": "106 Mbps",
        "connections": [
            {
                "protocol": "TCP",
                "local_address": "10.0.0.24:49722",
                "remote_address": "52.96.132.18:443",
                "state": "ESTABLISHED",
                "reputation": "trusted",
            },
            {
                "protocol": "TCP",
                "local_address": "10.0.0.24:49801",
                "remote_address": "185.220.101.7:8080",
                "state": "ESTABLISHED",
                "reputation": "suspicious",
            },
            {
                "protocol": "UDP",
                "local_address": "10.0.0.24:5353",
                "remote_address": "224.0.0.251:5353",
                "state": "LISTEN",
                "reputation": "internal",
            },
        ],
    }


def build_usb_devices_payload():
    return [
        {"name": "Kingston DataTraveler", "status": "trusted", "last_seen": "5 min ago"},
        {"name": "Unknown HID Device", "status": "blocked", "last_seen": "1 hr ago"},
    ]


def build_ai_response(query: str):
    return {
        "summary": (
            "This Phase 1 assistant is running offline placeholder intelligence. "
            f"It interprets the request '{query}' and returns recommended analyst actions."
        ),
        "actions": [
            "Review related process lineage and parent-child execution.",
            "Check file reputation and signature status for dropped artifacts.",
            "Contain the host if similar alerts continue within the next hour.",
        ],
        "confidence": "medium",
    }
