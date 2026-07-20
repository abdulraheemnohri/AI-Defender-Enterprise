# AI Defender Enterprise
**AI-Powered Local Cyber Defense & Automated Endpoint Containment Platform**

[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)
[![Python 3.12](https://img.shields.io/badge/Python-3.12-blue.svg)](https://www.python.org/downloads/)
[![React 18](https://img.shields.io/badge/React-18-cyan.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Production--Grade-emerald.svg)](https://fastapi.tiangolo.com/)

AI Defender Enterprise is a fully offline, privacy-first enterprise-grade cybersecurity platform. It combines antivirus, local Endpoint Detection & Response (EDR), Intrusion Detection System (IDS), stateful firewall management, vulnerability scanning, patch control workflow approvals, YARA/Sigma rules compilation checkers, virtual sandboxing, and local AI orchestration.

All behavioral analysis and transformer neural network inference occur on-device without cloud connectivity, keeping enterprise telemetry strictly on-premise.

---

## 📖 Production Guides & Documentation

To assist security engineers and system administrators, detailed structural guides are provided:
* 📘 **[Administrator & Operations Guide](docs/ADMINISTRATOR_GUIDE.md):** Configuration manuals, user role accounts setups, emergency isolation workflows, and promotion of AI suggested rules.
* 📙 **[Architecture & Models Specification](docs/ARCHITECTURE_AND_MODELS.md):** Relational database schemas, local llama.cpp / ONNX execution engines, memory profiles, hardware standards, and CPU/GPU thread optimizations.

---

## 🚀 Key Feature Set

* **Emergency Workstation Isolation:** Instantly sever outbound network interface sockets and isolate host systems directly from the Dashboard during active malware outbreaks.
* **Firewall Policy Desk & AI Suggestion Promotion:** Enforce custom IP, port, and protocol filters, and elevate suggested rules from the AI behavioral engine to active policies with a single click.
* **Local AI Model Orchestrator:** Dynamic thread optimization, layer-offloading configurations, and integrated prompt execution speed benchmark tests (Gemma-2B, Phi-3, Qwen).
* **Virtual Sandboxing:** Isolate suspicious payloads inside virtual environments with custom parameters (registry virtualization, outbound DNS blocks).
* **Vulnerability & Patch Center:** Automated open port scanners, registry checking, missing Windows cumulative updates listings, and patch approval/rollback workflows.
* **YARA & Sigma Engineering Console:** Interactive rule builders with sandboxed syntax parsing compilers to check syntax accuracy prior to deployment.
* **Multi-Role User Directory Directory:** Manage security operator credentials, track active logins, and execute instant session token revocations.

---

## 📥 Quick Start Setup

### Prerequisites
* **Python 3.12+** ([Download](https://www.python.org/downloads/))
* **Node.js 20+** ([Download](https://nodejs.org/))

### 1. Repository Setup
```bash
git clone https://github.com/abdulraheemnohri/AI-Defender-Enterprise.git
cd AI-Defender-Enterprise
```

### 2. Launch FastAPI Backend Service
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate     # Windows
pip install -r requirements.txt
uvicorn main:app --reload
```
The FastAPI backend serves REST endpoints at `http://localhost:8000`.

### 3. Launch React UI Client
```bash
cd frontend
npm install
npm run build   # Compile optimized production bundle
npm start       # Run localized workspace developer server
```
The React client runs locally at `http://localhost:3000`.

---

## 🧪 Testing and Verification Suite

The repository features a rigorous backend unit testing suite covering session lockouts, YARA/Sigma compilers, benchmarking engines, host isolation toggles, and rules life cycles.

Run tests using Pytest:
```bash
cd backend
pytest test_main.py
```

---

## 📜 License
This project is licensed under the **MIT License** – see [LICENSE](LICENSE) for details.
