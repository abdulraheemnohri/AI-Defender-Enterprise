from fastapi import APIRouter


router = APIRouter(prefix="/usb", tags=["usb"])


@router.get("/devices")
def get_usb_devices():
    return {"devices": [{"name": "Kingston DataTraveler", "status": "trusted", "last_seen": "5 min ago"}, {"name": "Unknown HID Device", "status": "blocked", "last_seen": "1 hr ago"}]}
