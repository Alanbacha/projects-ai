from openai import OpenAI  # Importa a classe OpenAI do módulo openai
from fastapi import APIRouter, HTTPException, UploadFile, File # Importa os módulos necessários do FastAPI)
from fastapi.responses import JSONResponse  # Importa a classe JSONResponse do FastAPI
from io import BytesIO  # Importa BytesIO para manipulação de dados em memória
import os  # Importa o módulo os para lidar com variáveis de ambiente
from dotenv import load_dotenv  # Importa a função load_dotenv do módulo dotenv

# Carrega variáveis de ambiente do arquivo .env
load_dotenv()

# Cria um roteador para o serviço Whisper
router = APIRouter()
api_key = os.getenv("OPENAI_API_KEY")

# Cria uma instância do cliente OpenAI
client = OpenAI(api_key=api_key)

# Define a rota POST para o serviço Whisper
@router.post("/whisper")
async def whisper_service(file: UploadFile = File(...)):
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
