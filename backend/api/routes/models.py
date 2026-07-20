from fastapi import APIRouter, HTTPException
from typing import List
from schemas.models import AIModelConfig, AIModelItem, BenchmarkResult, RegisterModelRequest

router = APIRouter(prefix="/models", tags=["models"])

# Stateful in-memory models DB
local_models = [
    AIModelItem(
        id="gemma",
        name="Gemma 2B (Default)",
        size_gb=1.6,
        status="Ready",
        active=True,
        memory_footprint_mb=1250,
        accelerator="ONNX Runtime"
    ),
    AIModelItem(
        id="phi",
        name="Phi-2 2.7B (High Speed)",
        size_gb=2.2,
        status="Ready",
        active=False,
        memory_footprint_mb=1800,
        accelerator="llama.cpp GGUF"
    ),
    AIModelItem(
        id="qwen",
        name="Qwen 1.8B (Compact)",
        size_gb=1.2,
        status="Ready",
        active=False,
        memory_footprint_mb=850,
        accelerator="ONNX Runtime"
    ),
    AIModelItem(
        id="smollm",
        name="SmolLM 135M (Tiny)",
        size_gb=0.15,
        status="Ready",
        active=False,
        memory_footprint_mb=120,
        accelerator="Transformers CPU"
    ),
    AIModelItem(
        id="tinyllama",
        name="TinyLlama 1.1B (Low RAM)",
        size_gb=0.8,
        status="Ready",
        active=False,
        memory_footprint_mb=600,
        accelerator="llama.cpp GGUF"
    ),
    AIModelItem(
        id="deepseek",
        name="DeepSeek Distilled 7B (Requires GPU)",
        size_gb=4.5,
        status="Not Downloaded",
        active=False,
        memory_footprint_mb=0,
        accelerator="llama.cpp GGUF"
    ),
]

current_config = AIModelConfig(
    temperature=0.7,
    max_tokens=512,
    onnx_enabled=True,
    gguf_enabled=False,
    cpu_threads=4,
    gpu_layers=16
)

@router.get("", response_model=List[AIModelItem])
def get_local_models():
    return local_models

@router.post("/{model_id}/toggle", response_model=AIModelItem)
def toggle_model(model_id: str):
    found = False
    target_model = None
    for model in local_models:
        if model.id == model_id:
            if model.status != "Ready":
                raise HTTPException(status_code=400, detail=f"Model {model_id} must be downloaded before activating.")
            model.active = True
            found = True
            target_model = model
        else:
            model.active = False

    if not found:
        raise HTTPException(status_code=404, detail="Model not found")

    return target_model

@router.get("/config", response_model=AIModelConfig)
def get_model_config():
    return current_config

@router.post("/config", response_model=AIModelConfig)
def update_model_config(config: AIModelConfig):
    global current_config
    current_config = config
    return current_config

@router.post("/benchmark", response_model=BenchmarkResult)
def run_model_benchmark(payload: dict):
    model_id = payload.get("model_id", "gemma")
    model = next((m for m in local_models if m.id == model_id), None)
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")

    # Calculate mock stats proportional to model size
    tokens_per_sec = round(45.2 / (model.size_gb if model.size_gb > 0 else 0.1), 2)
    vram_usage = int(model.memory_footprint_mb * 0.4) if current_config.gpu_layers > 0 else 0
    sys_ram_usage = int(model.memory_footprint_mb * 0.6) if vram_usage > 0 else model.memory_footprint_mb

    return BenchmarkResult(
        model_id=model_id,
        tokens_per_sec=tokens_per_sec,
        vram_usage_mb=vram_usage,
        sys_ram_usage_mb=sys_ram_usage,
        generation_time_ms=round(120.0 * model.size_gb, 1),
        integrity_checked=True
    )

@router.post("/register", response_model=AIModelItem)
def register_custom_model(request: RegisterModelRequest):
    new_id = request.name.lower().replace(" ", "_")
    for model in local_models:
        if model.id == new_id:
            raise HTTPException(status_code=400, detail="A model with this name/id already exists")

    new_model = AIModelItem(
        id=new_id,
        name=request.name,
        size_gb=request.size_gb,
        status="Ready",
        active=False,
        memory_footprint_mb=int(request.size_gb * 800),
        accelerator=request.accelerator
    )
    local_models.append(new_model)
    return new_model
