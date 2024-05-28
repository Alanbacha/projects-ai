from openai import OpenAI
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import io

# Carrega variáveis de ambiente do arquivo .env
load_dotenv()

# Cria um roteador para o serviço TTS
router = APIRouter()
api_key = os.getenv("OPENAI_API_KEY")

# Modelo de solicitação para o serviço TTS
class TextToSpeechRequest(BaseModel):
    text: str

@router.post("/tts")
async def tts_service(request: TextToSpeechRequest):
    # Cria uma instância do cliente OpenAI
    client = OpenAI(api_key=api_key)
    try:
        # Envia o texto para o serviço TTS
        response = client.audio.speech.create(
            model="tts-1-hd",
            voice="alloy",
            input=request.text
        )
        
        audio_stream = io.BytesIO(response.content)
        return StreamingResponse(audio_stream, media_type="audio/mpeg")
    except Exception as e:
        # Retorna um erro 500 em caso de falha
        raise HTTPException(status_code=500, detail=str(e))

# Define o roteador para ser incluído no controlador principal
ttsRouter = router
