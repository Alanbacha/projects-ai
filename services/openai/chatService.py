from openai import OpenAI
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Optional
from dotenv import load_dotenv
import os
import uuid

load_dotenv()

router = APIRouter()
api_key = os.getenv("OPENAI_API_KEY")

class ChatRequest(BaseModel):
    chat_id: Optional[str] = Field(default=None)
    message: str

# Dicionário para armazenar os históricos de chat
chat_histories = {}

@router.post("/chat")
async def chat_service(request: ChatRequest):
    client = OpenAI(api_key=api_key)

    # Se não houver chat_id, criar um novo chat
    if request.chat_id is None:
        chat_id = str(uuid.uuid4())
        chat_histories[chat_id] = [{"role": "system", "content": "You are chatting with Axel, your assistant."}]
    else:
        chat_id = request.chat_id

    # Adicionar a mensagem do usuário ao histórico
    chat_histories[chat_id].append({"role": "user", "content": request.message})

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=chat_histories[chat_id]
        )
        
        # Acessar corretamente a mensagem retornada
        chat_response = response.choices[0].message.content
        # Adicionar a resposta do assistente ao histórico
        chat_histories[chat_id].append({"role": "assistant", "content": chat_response})

        return JSONResponse(content={"chat_id": chat_id, "response": chat_response})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

chatRouter = router
