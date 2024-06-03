from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from services.openai import whisperRouter, ttsRouter, chatRouter, assistantsRouter

# Cria um roteador para as rotas relacionadas ao OpenAI
router = APIRouter()
# Define o diretório de templates para o Jinja2
templates = Jinja2Templates(directory="frontend/templates")

# Rota para a página principal dos serviços OpenAI
@router.get("/openai_services", response_class=HTMLResponse)
async def openai_services(request: Request):
    return templates.TemplateResponse("services/openai/index.html", {"request": request})

# Rota para a página de TTS e Whisper
@router.get("/openai_services/tts_whisper", response_class=HTMLResponse)
async def tts_whisper_page(request: Request):
    return templates.TemplateResponse("services/openai/tts_whisper.html", {"request": request})

# Rota para a página de chat
@router.get("/openai_services/chat", response_class=HTMLResponse)
async def chat_page(request: Request):
    return templates.TemplateResponse("services/openai/chat.html", {"request": request})

# Rota para a página de Assistentes
@router.get("/openai_services/assistants", response_class=HTMLResponse)
async def assistants_page(request: Request):
    return templates.TemplateResponse("services/openai/assistants.html", {"request": request})

# Inclui as rotas dos serviços Whisper, TTS e Chat
router.include_router(whisperRouter, prefix="/openai")
router.include_router(ttsRouter, prefix="/openai")
router.include_router(chatRouter, prefix="/openai")
router.include_router(assistantsRouter, prefix="/openai")
