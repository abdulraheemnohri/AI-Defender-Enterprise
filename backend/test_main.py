import pytest
from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "AI Defender Enterprise API"
    assert data["status"] == "online"
    assert "auth" in data["modules"]
    assert "models" in data["modules"]
    assert "users" in data["modules"]
    assert "rules" in data["modules"]


def test_auth_login_success():
    payload = {
        "username": "test_analyst",
        "password": "admin123",
        "role": "Security Analyst",
        "remember_me": True
    }
    response = client.post("/auth/login", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["role"] == "Security Analyst"
    assert data["requires_2fa"] is True


def test_auth_login_bad_password():
    payload = {
        "username": "test_analyst",
        "password": "wrong_password",
        "role": "Security Analyst",
        "remember_me": True
    }
    response = client.post("/auth/login", json=payload)
    assert response.status_code == 401


def test_auth_mfa_success():
    payload = {
        "token": "demo-session-token-98765",
        "code": "123456"
    }
    response = client.post("/auth/verify-2fa", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["requires_2fa"] is False


def test_auth_mfa_failure():
    payload = {
        "token": "demo-session-token-98765",
        "code": "000000"
    }
    response = client.post("/auth/verify-2fa", json=payload)
    assert response.status_code == 401


def test_get_dashboard():
    response = client.get("/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert "security_score" in data
    assert "processes" in data
    assert "alerts" in data


def test_get_processes_and_kill():
    # Fetch processes
    response = client.get("/scan/processes")
    assert response.status_code == 200
    data = response.json()
    processes = data["processes"]
    assert len(processes) > 0

    # Try killing first process
    first_pid = processes[0]["pid"]
    first_name = processes[0]["name"]
    kill_response = client.post(f"/scan/processes/{first_pid}/kill")
    assert kill_response.status_code == 200
    assert kill_response.json()["pid"] == first_pid

    # Verify process is removed from stateful list
    get_again = client.get("/scan/processes").json()["processes"]
    pids = [p["pid"] for p in get_again]
    assert first_pid not in pids


def test_usb_toggle_trust():
    devices = client.get("/usb/devices").json()["devices"]
    assert len(devices) > 0
    first_device = devices[0]
    initial_status = first_device["status"]

    toggle_response = client.post("/usb/devices/toggle", json={"name": first_device["name"]})
    assert toggle_response.status_code == 200
    updated_status = toggle_response.json()["device"]["status"]
    assert updated_status != initial_status


def test_firewall_rules_lifecycle():
    # 1. List rules
    initial_rules = client.get("/firewall/rules").json()

    # 2. Add rule
    new_rule_payload = {
        "name": "Test Rule",
        "action": "block",
        "target": "1.1.1.1",
        "protocol": "TCP",
        "enabled": True
    }
    add_response = client.post("/firewall/rules", json=new_rule_payload)
    assert add_response.status_code == 200
    added_rule = add_response.json()
    assert added_rule["name"] == "Test Rule"
    assert added_rule["id"] is not None

    # 3. Toggle rule
    rule_id = added_rule["id"]
    toggle_response = client.post(f"/firewall/rules/{rule_id}/toggle")
    assert toggle_response.status_code == 200
    assert toggle_response.json()["enabled"] is False

    # 4. Delete rule
    delete_response = client.delete(f"/firewall/rules/{rule_id}")
    assert delete_response.status_code == 200

    # 5. Verify deleted from list
    final_rules = client.get("/firewall/rules").json()
    rule_ids = [r["id"] for r in final_rules]
    assert rule_id not in rule_ids


# --- NEW TEST SUITES ---

def test_models_lifecycle_and_benchmarks():
    # 1. List installed models
    models = client.get("/models").json()
    assert len(models) > 0
    active_models = [m for m in models if m["active"]]
    assert len(active_models) == 1
    assert active_models[0]["id"] == "gemma"

    # 2. Toggle active model to Phi
    toggle_res = client.post("/models/phi/toggle")
    assert toggle_res.status_code == 200
    assert toggle_res.json()["active"] is True

    # 3. Fetch model optimization configs
    config = client.get("/models/config").json()
    assert config["onnx_enabled"] is True

    # Update config
    config["cpu_threads"] = 8
    update_res = client.post("/models/config", json=config)
    assert update_res.status_code == 200
    assert update_res.json()["cpu_threads"] == 8

    # 4. Run mock local speed benchmarks
    bench_res = client.post("/models/benchmark", json={"model_id": "phi"})
    assert bench_res.status_code == 200
    data = bench_res.json()
    assert data["model_id"] == "phi"
    assert data["tokens_per_sec"] > 0
    assert data["integrity_checked"] is True


def test_users_accounts_and_sessions():
    # 1. List all users
    users = client.get("/users").json()
    assert len(users) >= 4
    admin_user = next((u for u in users if u["username"] == "administrator"), None)
    assert admin_user is not None
    assert admin_user["role"] == "Administrator"

    # 2. Create new analyst
    new_user_payload = {
        "username": "analyst_clara",
        "password": "secure_clara_123",
        "role": "Security Analyst",
        "email": "clara@aidefender.local",
        "department": "Malware Sandbox Lab"
    }
    create_res = client.post("/users", json=new_user_payload)
    assert create_res.status_code == 200
    assert create_res.json()["username"] == "analyst_clara"

    # Verify added to DB
    get_users = client.get("/users").json()
    usernames = [u["username"] for u in get_users]
    assert "analyst_clara" in usernames

    # 3. View active session handshakes
    sessions = client.get("/users/sessions").json()
    assert len(sessions) > 0
    target_sess = sessions[0]["session_id"]

    # 4. Revoke/Disconnect an active token
    revoke_res = client.post(f"/users/sessions/{target_sess}/revoke")
    assert revoke_res.status_code == 200
    assert revoke_res.json()["success"] is True

    # Check session is removed
    get_sess_again = client.get("/users/sessions").json()
    sess_ids = [s["session_id"] for s in get_sess_again]
    assert target_sess not in sess_ids

    # 5. Check audit log generated trail
    audits = client.get("/users/audit-logs").json()
    assert len(audits) > 0
    revoke_audit = next((a for a in audits if a["action"] == "REVOKE_SESSION"), None)
    assert revoke_audit is not None


def test_rules_syntax_sandbox_compilers():
    # 1. Get initial rule lists
    rules = client.get("/rules").json()
    assert len(rules) >= 2

    # 2. Try compiling a valid YARA rule
    valid_yara = """rule Mimikatz_LSASS_Memory {
        meta:
            description = "Catches active mimikatz credential dumping tool string signatures"
        strings:
            $dump_sec = "lsass.exe"
            $dll_flag = "mimilib.dll"
        condition:
            all of them
    }"""
    comp_valid = client.post("/rules/compile", json={"content": valid_yara, "type": "YARA"})
    assert comp_valid.status_code == 200
    res = comp_valid.json()
    assert res["success"] is True
    assert "$dump_sec" in res["affected_indicators"]

    # 3. Try compiling an invalid YARA rule (missing condition)
    invalid_yara = """rule Failing_Rule_Missing_Condition {
        strings:
            $magic = "MZ"
    }"""
    comp_invalid = client.post("/rules/compile", json={"content": invalid_yara, "type": "YARA"})
    assert comp_invalid.status_code == 200
    res_inv = comp_invalid.json()
    assert res_inv["success"] is False
    assert "condition:" in res_inv["errors"]

    # 4. Compile valid Sigma rule
    valid_sigma = """title: Audit Sysmon SMB Creation
detection:
    selection:
        Image|endswith: '\\smbclient.exe'
    condition: selection"""
    comp_sig = client.post("/rules/compile", json={"content": valid_sigma, "type": "Sigma"})
    assert comp_sig.status_code == 200
    res_sig = comp_sig.json()
    assert res_sig["success"] is True

    # 5. Create rule in-memory
    new_rule_payload = {
        "name": "Custom_SMB_Audit",
        "type": "Sigma",
        "content": valid_sigma,
        "description": "Fires on smbclient execution traces",
        "tags": ["smb", "lateral-movement"]
    }
    create_res = client.post("/rules", json=new_rule_payload)
    assert create_res.status_code == 200
    added_rule_id = create_res.json()["id"]

    # Verify toggle rules
    toggle_res = client.post(f"/rules/{added_rule_id}/toggle")
    assert toggle_res.status_code == 200
    assert toggle_res.json()["enabled"] is False

    # Cleanup rule
    del_res = client.delete(f"/rules/{added_rule_id}")
    assert del_res.status_code == 200
