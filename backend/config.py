from pathlib import Path

# Project root
ROOT_DIR = Path(__file__).parent.parent

# Database
DATABASE_URL = f"sqlite:///{ROOT_DIR / 'ai_defender.db'}"

# AI Models
MODELS_DIR = ROOT_DIR / "models"
ONNX_MODELS = {
    "gemma": MODELS_DIR / "gemma-2b.onnx",
    "phi": MODELS_DIR / "phi-2.onnx",
}

# Rules
RULES_DIR = ROOT_DIR / "rules"
YARA_RULES = RULES_DIR / "yara" / "malware.yar"

# Logs
LOGS_DIR = ROOT_DIR / "logs"
SECURITY_LOGS = LOGS_DIR / "security.log"

# Quarantine
QUARANTINE_DIR = ROOT_DIR / "quarantine"