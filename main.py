from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import json
import os

app = FastAPI()


class FAQ(BaseModel):
    id: int
    question: str
    answer: str


FAQ_FILE = 'faqs.json'


def load_faqs():
    if not os.path.exists(FAQ_FILE):
        return []
    with open(FAQ_FILE, 'r') as f:
        return json.load(f)


def save_faqs(faqs):
    with open(FAQ_FILE, 'w') as f:
        json.dump(faqs, f, indent=2)



@app.get("/faqs/", response_model=List[FAQ])
def list_faqs():
    return load_faqs()

@app.get("/faqs/{faq_id}", response_model=FAQ)
def get_faq(faq_id: int):
    faqs = load_faqs()
    for faq in faqs:
        if faq['id'] == faq_id:
            return faq
    raise HTTPException(status_code=404, detail="FAQ not found")

@app.get("/faqs/search/", response_model=List[FAQ])
def search_faqs(query: str):
    faqs = load_faqs()
    results = [
        faq for faq in faqs
        if query.lower() in faq['question'].lower()
    ]
    return results


@app.on_event("startup")
def startup_event():
    faqs = load_faqs()
    if not faqs:
        initial_faqs = [
            {
                "id": 1,
                "question": "What is RaiDOT?",
                "answer": "RaiDOT (Responsible AI, Insightful Data, Operational Trust) is an intelligent tool designed to evaluate the operational assurance of AI systems, focusing on the postoperative risks of AI-enabled SMEs."
            },
            {
                "id": 2,
                "question": "Why is RaiDOT needed?",
                "answer": "AI systems can be vulnerable to cyberattacks, privacy concerns, and ethical risks. RaiDOT helps SMEs assess and manage these risks to ensure responsible and transparent AI usage."
            },
            {
                "id": 3,
                "question": "How does RaiDOT evaluate AI assurance?",
                "answer": "RaiDOT uses AI assurance and risk management frameworks, including the NIST AI RMF 1.0 and the EU AI Act, to assess and evaluate the level of operational assurance in AI-enabled SMEs."
            },
            {
                "id": 4,
                "question": "Who will benefit from RaiDOT?",
                "answer": "RaiDOT primarily benefits SMEs by helping them manage AI-related risks. Additionally, it contributes to economic growth, social benefits, and the ethical use of AI in the UK."
            },
            {
                "id": 5,
                "question": "What is the first phase of the RaiDOT project?",
                "answer": "The first phase of RaiDOT involves developing a web-based evaluation tool that will identify, analyze, and assess AI assurance risks for SMEs based on regulatory frameworks."
            }
        ]

        save_faqs(initial_faqs)


from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
