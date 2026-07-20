from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

router = APIRouter(prefix="/usb", tags=["usb"])

# Stateful in-memory list
USB_DEVICES = [
    {"name": "Kingston DataTraveler", "status": "trusted", "last_seen": "5 min ago"},
    {"name": "Unknown HID Device", "status": "blocked", "last_seen": "1 hr ago"},
    {"name": "Samsung Shield T7 SSD", "status": "trusted", "last_seen": "Just now"},
]


class ToggleTrustRequest(BaseModel):
    name: str


@router.get("/devices")
def get_usb_devices():
    return {"devices": USB_DEVICES}


@router.post("/devices/toggle")
def toggle_usb_device_trust(payload: ToggleTrustRequest):
    device = next((d for d in USB_DEVICES if d["name"] == payload.name), None)
    if not device:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Device '{payload.name}' not found."
        )
    # Toggle trust
    device["status"] = "blocked" if device["status"] == "trusted" else "trusted"
    return {
        "message": f"Device {payload.name} status updated to {device['status']}",
        "device": device
    }
