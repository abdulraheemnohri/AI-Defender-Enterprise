from pydantic import BaseModel
from typing import List, Optional

class AIModelConfig(BaseModel):
    temperature: float
    max_tokens: int
    onnx_enabled: bool
    gguf_enabled: bool
    cpu_threads: int
    gpu_layers: int

class AIModelItem(BaseModel):
    id: str
    name: str
    size_gb: float
    status: str  # "Ready", "Not Downloaded", "Downloading"
    active: bool
    memory_footprint_mb: int
    accelerator: str  # "ONNX Runtime", "llama.cpp GGUF", "Transformers CPU"

class BenchmarkResult(BaseModel):
    model_id: str
    tokens_per_sec: float
    vram_usage_mb: int
    sys_ram_usage_mb: int
    generation_time_ms: float
    integrity_checked: bool

class RegisterModelRequest(BaseModel):
    name: str
    weights_path: str
    size_gb: float
    accelerator: str
