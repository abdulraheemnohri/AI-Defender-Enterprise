# AI Defender Enterprise — Administrator & Operations Guide
## Version 1.0 — Enterprise Deployment

Welcome to the **AI Defender Enterprise Administrator & Operations Guide**. This document provides comprehensive, step-by-step instructions for security engineers, SOC analysts, and system administrators to deploy, configure, and maintain the AI Defender Enterprise system on local workstations and network segments.

---

## Table of Contents
1. [Platform Architecture Overview](#1-platform-architecture-overview)
2. [Access Control & User Management](#2-access-control--user-management)
3. [Emergency Workstation Containment (Isolation)](#3-emergency-workstation-containment-isolation)
4. [Firewall Rule & Policy Configuration](#4-firewall-rule--policy-configuration)
5. [Local AI Model Management & Benchmarking](#5-local-ai-model-management--benchmarking)
6. [YARA & Sigma Rules Engineering](#6-yara--sigma-rules-engineering)
7. [Incident Response & Sandboxing Desk](#7-incident-response--sandboxing-desk)
8. [Audit Trails & Security Logs Compliance](#8-audit-trails--security-logs-compliance)

---

## 1. Platform Architecture Overview

AI Defender Enterprise operates as an **offline-first, privacy-first endpoint detection & response (EDR)** platform. All telemetry data, local processes behavior evaluation, network sockets monitoring, and AI inference run strictly on-device without cloud dependencies.

### Core Architecture Components:
* **Frontend client:** React, TypeScript, Tailwind CSS, Material Design 3.
* **Backend service:** FastAPI (Python), SQLite database, SQLAlchemy.
* **AI Runtime:** ONNX, llama.cpp, local model weight directory (`models/`).

---

## 2. Access Control & User Management

To enforce strict accountability, the platform employs Role-Based Access Control (RBAC) with granular operator profiles:

### 2.1 Standard Roles & Security Clearances
1. **Administrator:** Full permissions to promote rules, revoke active sessions, register AI models, and trigger emergency network isolation.
2. **Security Analyst:** Allowed to run custom scans, write/compile rules, and perform process triage (kill/suspend).
3. **SOC Operator:** Read-write access to alerts and network diagnostics; no access to model registrations.
4. **Auditor / Read-Only:** Access limited to reviewing audit logs, system status, and compliance reports.

### 2.2 Managing Operators & Enforcing Revocations
1. Open the **User Directory Hub** via the sidebar navigation.
2. To create a new operator, click **Add Enterprise Operator**, populate their department, role clearance, email, and password.
3. To terminate or sever an active session due to credential leakage or shift rotation, click **Revoke Session Token** in the **Active Sessions** list. This instantly revokes database session tokens.

---

## 3. Emergency Workstation Containment (Isolation)

In the event of active ransomware execution or suspicious command and control beaconing, administrators must immediately isolate the workstation to prevent lateral movement.

### 3.1 Activating Host Isolation
1. Go to the **Executive Dashboard**.
2. Locate the **Emergency Workstation Isolation** card or the interactive switch in the top header.
3. Toggle the switch to **HOST ISOLATED**.
4. **System Response:** The FastAPI backend instantly enters lockdown protocol. All outbound network endpoints are simulated as dropped, and system status variables transition to `STRICT_ISOLATION_ACTIVE` and `CONTAINMENT_PROTOCOLS_ENGAGED`.

### 3.2 Recovery Procedures
1. After completing malware eradication and process termination, toggle the switch back to **HOST ENFORCED**.
2. Network routing tables and active sockets will resume normal operating parameters.

---

## 4. Firewall Rule & Policy Configuration

The platform maintains a robust stateful firewall policy desk for both manual rule creation and AI-assisted suggested rules.

### 4.1 Custom Rule Creation
1. Navigate to the **Firewall Policy Workspace**.
2. Click **Add Custom Rule**.
3. Select the Rule Action (`BLOCK` or `ALLOW`), target IP/Subnet/Port, protocol (`TCP`, `UDP`, `ICMP`, `ANY`), and name.
4. Optionally check **Temporary Lease Rule** and select a lease timer (e.g., 1 Hour) after which the policy will self-expire.

### 4.2 Promoting AI Suggested Rules
The Local AI monitors telemetry and flags anomalous connection requests (e.g. SMB scans or TOR handshakes). These suggestions appear on the **AI Rule Promotion Desk**.
* Administrators can review the reasoning, click **Approve & Promote to Policy**, and the rule will immediately be integrated into the active system firewall rules list.

---

## 5. Local AI Model Management & Benchmarking

AI Defender Enterprise supports lightweight local LLM inference engines.

### 5.1 Supported Models
* **Gemma-2B / 7B** (Optimized for threat explanations)
* **Phi-3-Mini** (Optimized for lightning-fast rule generation)
* **Qwen-1.5 / SmolLM / TinyLlama**

### 5.2 Thread Optimization & Hardware Acceleration
1. Navigate to the **Local AI Model Orchestrator** in the sidebar.
2. In the **Optimization Config** card, configure:
   * **CPU Thread Limit:** Map threads to prevent high system overhead.
   * **GPU Acceleration Layer Counts:** Offload transformer layers to system VRAM.
   * **ONNX Execution Runtime:** Enable high performance quantizations.

### 5.3 Speed Benchmarks
* Administrators can run active speed benchmarks. The system evaluates current tokens per second, generation latency, and cryptographic integrity of the weights files.

---

## 6. YARA & Sigma Rules Engineering

Rules are verified inside a virtual compilation environment prior to deployment.

### 6.1 Creating Signature Checks
1. Go to **Threat Signature & Rules**.
2. Select your template: **YARA (Malware Signatures)** or **Sigma (Event Log Telemetry)**.
3. Write your rule within the interactive editor.
4. Click **Run Sandbox Syntax Check**. The compiler will return error outputs or parse matched string parameters (affected indicators) upon successful verification.

---

## 7. Incident Response & Sandboxing Desk

The system features an interactive file sandboxing workbench.

### 7.1 Running Sandboxed Executables
1. Navigate to the **Security Center** and click the **Virtual Sandbox Console** tab.
2. Drag and drop any unknown file or click **Initiate Sandbox Isolation**.
3. Select containment filters:
   * **Virtualize Registry Inputs** (redirects sensitive hives writing to temporary virtual memory).
   * **Block Outbound DNS Queries** (blocks external malware command downloads).
4. Review the running virtual trace logs in real-time.

---

## 8. Audit Trails & Security Logs Compliance

Every administrative action is tracked in the system database.

### 8.1 Accessing the Audit Trail
* Go to the **User Directory Hub** or the dedicated **Audit Logs Workspace** under auth reports.
* Every login, session termination, isolation toggle, and firewall change creates an entry containing:
  * **Timestamp (UTC)**
  * **Operator IP**
  * **Cleared Role & Account name**
  * **Granular Action & Payload Description**
* Logs can be exported into technical and executive formats under the **Compliance Reports Center**.
