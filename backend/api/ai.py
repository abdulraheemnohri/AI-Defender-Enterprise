from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import Dict
from backend.ai.onnx_engine import ONNXEngine
from backend.ai.llama_engine import LlamaEngine
from pathlib import Path

router = APIRouter(prefix="/api/ai", tags=["AI"])

# Initialize AI engines (load models on startup)
try:
    onnx_engine = ONNXEngine(str(Path(__file__).parent.parent / "models" / "gemma-2b.onnx"))
except Exception as e:
    onnx_engine = None
    print(f"Failed to load ONNX model: {e}")

try:
    llama_engine = LlamaEngine(str(Path(__file__).parent.parent / "models" / "phi-2.gguf"))
except Exception as e:
    llama_engine = None
    print(f"Failed to load GGUF model: {e}")


@router.post("/analyze/threat", response_model=Dict)
def analyze_threat_endpoint(threat_data: Dict):
    """Analyze a threat using AI"""
    if onnx_engine:
        explanation = onnx_engine.analyze_threat(threat_data)
    elif llama_engine:
        prompt = f"Analyze this threat: {threat_data}. Explain in simple terms."
        explanation = llama_engine.generate_response(prompt)
    else:
        explanation = "No AI model loaded. Please check model files."
    return {"explanation": explanation}


@router.post("/chat", response_model=Dict)
def chat_with_ai(prompt: str):
    """Chat with the AI assistant"""
    if llama_engine:
        response = llama_engine.generate_response(prompt)
    else:
        response = "No AI model loaded. Please check model files."
    return {"response": response}


@router.post("/generate-rule", response_model=Dict)
def generate_firewall_rule(prompt: str):
    """Generate a firewall rule using AI"""
    if llama_engine:
        rule_prompt = f"Generate a firewall rule for: {prompt}. Return in JSON format with fields: name, action, direction, app_path, port, ip."
        response = llama_engine.generate_response(rule_prompt)
        return {"rule": response}
    else:
        return {"rule": "No AI model loaded."}