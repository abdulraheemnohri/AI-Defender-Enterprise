# AI Defender Enterprise
**Local-First AI-Powered Cybersecurity Platform**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Python 3.11](https://img.shields.io/badge/python-3.11-blue.svg)](https://www.python.org/downloads/)
[![React 18](https://img.shields.io/badge/react-18-blue.svg)](https://reactjs.org/)

---

## **🚀 Features**
- ✅ **Real-time threat detection** (behavioral + signature-based)
- ✅ **Local AI models** for explanations and recommendations (Gemma, Phi, Qwen)
- ✅ **Firewall management** (allow/block apps, IPs, ports)
- ✅ **USB and network protection**
- ✅ **Offline operation** (no cloud dependency)
- ✅ **Dark theme dashboard** with Material Design 3
- ✅ **Process, file, and network monitoring**

---

## **📥 Quick Start**
### **Prerequisites**
- **Python 3.11+** ([Download](https://www.python.org/downloads/))
- **Node.js 20+** ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))

---

### **1. Clone the Repository**
```bash
git clone https://github.com/abdulraheemnohri/AI-Defender-Enterprise.git
cd AI-Defender-Enterprise
```

---

### **2. Set Up the Backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
pip install -r requirements.txt
uvicorn main:app --reload
```
The backend will run at `http://localhost:8000`.

---

### **3. Set Up the Frontend**
```bash
cd frontend
npm install
npm start
```
The frontend will run at `http://localhost:3000`.

---

### **4. Build the Desktop App (Tauri)**
```bash
npm install --save-dev @tauri-apps/cli
npm run tauri dev
```
To build the installer:
```bash
npm run tauri build
```
The installer will be in `frontend/src-tauri/target/release/`.

---

## **📂 Project Structure**
```
AI-Defender-Enterprise/
├── backend/                  # Python + FastAPI
│   ├── api/
│   │   └── endpoints/        # FastAPI routes
│   ├── ai/                   # AI models and engines
│   ├── detection/            # Threat detection logic
│   ├── monitor/              # System monitoring
│   ├── firewall/             # Firewall management
│   ├── quarantine/           # Quarantine system
│   ├── database/             # SQLite/PostgreSQL
│   └── main.py               # FastAPI app
│
├── frontend/                 # React + TypeScript
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Main views
│   │   ├── hooks/            # Custom React hooks
│   │   ├── context/          # React Context
│   │   ├── utils/            # Utility functions
│   │   ├── styles/           # Global styles
│   │   ├── App.tsx           # Main app
│   │   └── index.tsx         # Entry point
│   └── package.json
│
├── models/                   # Pre-trained AI models (ONNX, GGUF)
├── rules/                    # Detection rules (YARA, Sigma, IOC)
├── logs/                     # Log storage
├── quarantine/               # Isolated files
├── docs/                     # Documentation
├── scripts/                  # Helper scripts
└── README.md                 # This file
```

---

## **🤝 Contributing**
See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## **📜 License**
This project is licensed under the **MIT License** – see [LICENSE](LICENSE) for details.