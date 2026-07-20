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
