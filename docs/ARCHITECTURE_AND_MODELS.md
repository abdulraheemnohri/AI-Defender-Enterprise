# AI Defender Enterprise — Architecture & Models Specification
## Version 1.0 — Local AI Core

AI Defender Enterprise is engineered to perform high-fidelity local AI inference for behavioral and contextual threat analysis entirely on the edge. This document outlines the offline model runtime architectures, execution engines, model parameter tuning, memory footprint optimizations, hardware recommendations, and the data models schema.

---

## 1. Technical Architecture Overview

```
+---------------------------------------------------------------------------------+
|                                 USER CLIENT (UI)                                |
|             React + TypeScript + Tailwind CSS + Material Design 3               |
+----------------------------------------+----------------------------------------+
                                         | REST APIs
+----------------------------------------v----------------------------------------+
|                                 BACKEND LAYER                                  |
|                 FastAPI (Python) + SQLAlchemy ORM Wrapper                      |
+-------------------+--------------------+-------------------+--------------------+
                    |                    |                   |
+-------------------v----+ +-------------v-----+ +-----------v----+ +--------------v----+
|  MONITOR SYSTEMS       | | AI ORCHESTRATOR  | | FIREWALL ENGINE | | DATABASE LAYER    |
|  psutil / watchdog     | | ONNX / llama.cpp | | Stateful SQLite | | SQLite (Default)  |
+------------------------+ +------------------+ +-----------------+ +-------------------+
```

The system employs a decentralized, non-blocking asynchronous architecture to ensure real-time host monitoring remains unaffected by deep learning inference workloads.

---

## 2. Local AI Model Specifications

The platform is designed to house local, quantized parameters models inside the `models/` weight storage registry. These models can explain threats, write firewall rules, perform root cause analysis, and format telemetry reports.

### 2.1 Supported Model Architectures

| Model Family | Param Count | Recommended Quantization | Memory Required | Optimal Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **Gemma-2B-IT** | 2.5 Billion | Q4_K_M (4-bit GGUF) | ~2.2 GB RAM | Forensic behavior and parent-child threat descriptions. |
| **Phi-3-Mini** | 3.8 Billion | Q4_K_M (4-bit GGUF) | ~3.1 GB RAM | Code explaining (e.g. encoded PowerShell strings). |
| **Qwen-1.5-1.8B**| 1.8 Billion | FP16 (ONNX Format) | ~1.8 GB RAM | Network IP reputation and anomaly logs triage. |
| **SmolLM-135M**  | 135 Million | FP32 (ONNX Format) | ~350 MB RAM | Ultra-lightweight statistical anomaly checking. |

---

## 3. Local Execution Engines

AI Defender utilizes two local inference runtimes:

### 3.1 llama.cpp (GGUF Format)
* **Design Philosophy:** Optimized for CPU-based and GPU-accelerated GGUF format files.
* **GPU Layers Offloading:** Supports transferring up to 100% of the transformer layers directly to system VRAM via CUDA or Metal drivers.
* **Thread Tuning:** Allows custom thread allocation parameters (e.g., matching the host physical core count) to avoid context switching.

### 3.2 ONNX Runtime (ONNX Format)
* **Design Philosophy:** Targeted toward static classification models, heuristic analysis, and sequence-to-sequence regressions.
* **Hardware Acceleration:** Leverages Windows DirectML execution provider, enabling universal GPU acceleration on both NVIDIA and AMD graphics cards without complex CUDA setups.

---

## 4. Hardware and System Requirements

To ensure zero impact on general workstation productivity:

### Minimum Requirements (Workstation Edition):
* **CPU:** Intel Core i5 (8th Gen) or AMD Ryzen 5 (6-core)
* **RAM:** 8 GB DDR4
* **GPU:** Integrated Intel UHD Graphics / Radeon Graphics (uses CPU-only inference)
* **Disk Space:** 5 GB free SSD space

### Recommended Requirements (Enterprise SOC Node):
* **CPU:** Intel Core i7 (11th Gen) or AMD Ryzen 7 (8-core)
* **RAM:** 16 GB DDR4 or DDR5
* **GPU:** NVIDIA GeForce RTX 3060 (6GB VRAM) or higher with CUDA 12.x support
* **Disk Space:** 20 GB free NVMe SSD space (for multiple model variants)

---

## 5. Memory footprint Optimization Controls

Workstation agents must manage system memory dynamically to prevent OOM (Out Of Memory) states:

1. **Lazy Model Loading:** Weight layers are loaded into system memory only when the first AI query is submitted.
2. **Context Compression:** Uses sliding context window parameters to truncate older chat assistant logs.
3. **Model Unload Timeout:** Configures the orchestrator to automatically purge weights from system memory if no queries are submitted within a configurable idle duration (e.g., 10 minutes).

---

## 6. Database Schema Design (SQLite)

The local SQLite relational database ensures strict relational integrity for logs, active security policies, and quarantined samples:

```sql
-- Active Firewall Rules Policy Store
CREATE TABLE firewall_rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    action VARCHAR(50) NOT NULL, -- "block" or "allow"
    target VARCHAR(255) NOT NULL, -- IP / CIDR / Port
    protocol VARCHAR(50) DEFAULT "TCP",
    enabled BOOLEAN DEFAULT TRUE
);

-- User Registry Directory Table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    role VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    department VARCHAR(100),
    mfa_secret VARCHAR(100),
    registered_at VARCHAR(100)
);

-- Active Multi-Role Authenticated Sessions
CREATE TABLE user_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id VARCHAR(100) UNIQUE NOT NULL,
    username VARCHAR(100) NOT NULL,
    ip_address VARCHAR(50) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at VARCHAR(100),
    FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
);

-- Audit Trail System
CREATE TABLE audit_logs (
    id VARCHAR(100) PRIMARY KEY,
    timestamp VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL, -- E.g. "TOGGLE_ISOLATION", "PROMOTE_RULE"
    details TEXT,
    ip_address VARCHAR(50)
);
```
