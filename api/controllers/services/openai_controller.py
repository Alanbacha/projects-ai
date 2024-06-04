from fastapi import APIRouter, Request  # Importa a classe APIRouter e Request do FastAPI
from fastapi.responses import HTMLResponse  # Importa a classe HTMLResponse do FastAPI para respostas HTML
from fastapi.templating import Jinja2Templates  # Importa a classe Jinja2Templates do FastAPI para renderização de templates
from services.openai import whisperRouter, ttsRouter, chatRouter, assistantsRouter  # Importa os roteadores dos serviços OpenAI

# Cria um roteador para as rotas relacionadas ao OpenAI
router = APIRouter()
# Define o diretório de templates para o Jinja2
templates = Jinja2Templates(directory="frontend/templates")

# Rota para a página principal dos serviços OpenAI
@router.get("/openai_services", response_class=HTMLResponse)
async def openai_services(request: Request):
	# Renderiza o template 'index.html' e passa o objeto 'request'
    return templates.TemplateResponse("services/openai/index.html", {"request": request})

# Rota para a página de TTS e Whisper
@router.get("/openai_services/tts_whisper", response_class=HTMLResponse)
async def tts_whisper_page(request: Request):
	# Renderiza o template 'tts_whisper.html' e passa o objeto 'request'
    return templates.TemplateResponse("services/openai/tts_whisper.html", {"request": request})

# Rota para a página de chat
@router.get("/openai_services/chat", response_class=HTMLResponse)
async def chat_page(request: Request):
	# Renderiza o template 'chat.html' e passa o objeto 'request'
    return templates.TemplateResponse("services/openai/chat.html", {"request": request})

# Rota para a página de Assistentes
@router.get("/openai_services/assistants", response_class=HTMLResponse)
async def assistants_page(request: Request):
	# Renderiza o template 'assistants.html' e passa o objeto 'request'
    return templates.TemplateResponse("services/openai/assistants.html", {"request": request})

# Inclui as rotas dos serviços Whisper, TTS e Chat
router.include_router(whisperRouter, prefix="/openai")
router.include_router(ttsRouter, prefix="/openai")
router.include_router(chatRouter, prefix="/openai")
router.include_router(assistantsRouter, prefix="/openai")
