from fastapi.responses import StreamingResponse
from openai import OpenAI  # Importa a classe OpenAI do módulo openai
from fastapi import APIRouter, HTTPException # Importa os módulos necessários do FastAPI
from pydantic import BaseModel  # Importa a classe BaseModel do módulo pydantic
from dotenv import load_dotenv  # Importa a função load_dotenv do módulo dotenv
import os  # Importa o módulo os para lidar com variáveis de ambiente
import io  # Importa o módulo io para manipulação de entrada e saída em memória

# Carrega variáveis de ambiente do arquivo .env
load_dotenv()

# Cria um roteador para o serviço TTS
router = APIRouter()
api_key = os.getenv("OPENAI_API_KEY")

# Cria uma instância do cliente OpenAI
client = OpenAI(api_key=api_key)

# Modelo de solicitação para o serviço TTS
class TextToSpeechRequest(BaseModel):
    text: str

# Define a rota POST para o serviço TTS
@router.post("/tts")
async def tts_service(request: TextToSpeechRequest):
    try:
        # Envia o texto para o serviço TTS
        response = client.audio.speech.create(
            model="tts-1-hd",
            voice="alloy",
            input=request.text
        )
        
        # Converte a resposta em um fluxo de bytes e retorna como resposta de streaming
        audio_stream = io.BytesIO(response.content)
        return StreamingResponse(audio_stream, media_type="audio/mpeg")
    except Exception as e:
        # Retorna um erro 500 em caso de falha
        raise HTTPException(status_code=500, detail=str(e))

# Define o roteador para ser incluído no controlador principal
ttsRouter = router
