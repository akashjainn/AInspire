from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

app = FastAPI(title="AInspire ML Service", version="0.1.0")

class PairwiseRequest(BaseModel):
    image_a_id: str
    image_b_id: str
    session_vector: List[float] = []

@app.get("/health")
def health():
    return {"status": "ok", "service": "ml-service"}

@app.post("/internal/ml/pairwise-score")
def pairwise_score(req: PairwiseRequest):
    score_a = 0.52
    score_b = 0.48
    winner = req.image_a_id if score_a >= score_b else req.image_b_id
    return {
        "winner_image_id": winner,
        "score_a": score_a,
        "score_b": score_b,
        "model_version": "pairwise_v0"
    }

@app.post("/internal/ml/update-taste-vector")
def update_taste_vector(payload: dict):
    return {"status": "accepted", "updated": True, "model_version": "taste_v0"}
