import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from agent import MoniAgent
from database import get_transactions, sync_transactions, update_transaction

load_dotenv()

app = FastAPI()

# Allow CORS for React/Vite frontend (default port 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: list[Message]
    permissionGranted: bool = False
    transactions: list[dict] = []

class TransactionSyncRequest(BaseModel):
    transactions: list[dict]

class TransactionUpdateRequest(BaseModel):
    updates: dict

@app.get("/api/transactions")
async def get_transactions_endpoint():
    return {"transactions": get_transactions()}

@app.post("/api/transactions/sync")
async def sync_transactions_endpoint(request: TransactionSyncRequest):
    return {"transactions": sync_transactions(request.transactions)}

@app.patch("/api/transactions/{transaction_id}")
async def update_transaction_endpoint(transaction_id: str, request: TransactionUpdateRequest):
    updated_transaction = update_transaction(transaction_id, request.updates)

    if not updated_transaction:
        raise HTTPException(status_code=404, detail="Không tìm thấy giao dịch.")

    return {"transaction": updated_transaction}

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    api_key = os.getenv("OPENROUTER_API_KEY")
    messages_dict = [{"role": msg.role, "content": msg.content} for msg in request.messages]
    stored_transactions = get_transactions()
    transaction_source = request.transactions or stored_transactions

    if not api_key:
        print("Warning: OPENROUTER_API_KEY is not set. Returning mock response.")
        agent = MoniAgent()
        return {
            "content": agent.generate_fallback_response(
                messages_dict,
                request.permissionGranted,
                transaction_source,
                error="OPENROUTER_API_KEY is not set.",
            )
        }
        
    try:
        agent = MoniAgent(api_key=api_key)
        response_text = agent.generate_response(messages_dict, request.permissionGranted, transaction_source)
        return {"content": response_text}
    except Exception as e:
        print(f"API Error: {str(e)}. Returning offline fallback response.")
        fallback_text = agent.generate_fallback_response(
            messages_dict,
            request.permissionGranted,
            transaction_source,
            error=str(e),
        )
        return {"content": fallback_text}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
