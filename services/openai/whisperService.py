from openai import OpenAI
from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
from io import BytesIO
import os
from dotenv import load_dotenv

# Carrega variáveis de ambiente do arquivo .env
load_dotenv()

# Cria um roteador para o serviço Whisper
router = APIRouter()
api_key = os.getenv("OPENAI_API_KEY")

# Cria uma instância do cliente OpenAI
client = OpenAI(api_key=api_key)

@router.post("/whisper")
async def whisper_service(file: UploadFile = File(...)):
    # Cria uma instância do cliente OpenAI
    try:
        # Lê o conteúdo do arquivo de áudio
        audio_bytes = await file.read()
        # Verifica se o formato do arquivo é suportado
        if file.content_type != 'audio/webm':
            raise HTTPException(status_code=400, detail="Unsupported file format")

        # Converte o áudio para um objeto BytesIO
        audio_io = BytesIO(audio_bytes)
        audio_io.name = 'audio.webm'

        # Envia o arquivo de áudio para o serviço Whisper
        response = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_io
        )

        return JSONResponse(content={"transcription": response.text})
    except Exception as e:
        # Retorna um erro 500 em caso de falha
        raise HTTPException(status_code=500, detail=str(e))

# Define o roteador para ser incluído no controlador principal
whisperRouter = router
