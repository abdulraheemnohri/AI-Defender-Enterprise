from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import Dict, List
from backend.core.file_scanner import scan_file
from backend.core.usb_defender import scan_usb_device

router = APIRouter(prefix="/api/scan", tags=["Scanning"])


@router.post("/file", response_model=Dict)
def scan_file_endpoint(file_path: str):
    """Scan a file for malware"""
    result = scan_file(file_path)
    return {
        "file_path": file_path,
        "is_malicious": result["is_malicious"],
        "matches": result["matches"],
        "sha256": result["sha256"]
    }


@router.post("/usb", response_model=Dict)
def scan_usb_endpoint(device_path: str):
    """Scan a USB device for malicious files"""
    result = scan_usb_device(device_path)
    return {
        "device_path": device_path,
        "is_malicious": result["is_malicious"],
        "malicious_files": result["malicious_files"]
    }


@router.post("/directory", response_model=Dict)
def scan_directory_endpoint(directory_path: str):
    """Scan a directory for malicious files"""
    # TODO: Implement directory scanning
    return {
        "directory_path": directory_path,
        "is_malicious": False,
        "malicious_files": []
    }


@router.get("/history", response_model=List[Dict])
def get_scan_history():
    """Get scan history"""
    # TODO: Fetch from database
    return []