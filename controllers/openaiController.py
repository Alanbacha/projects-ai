from fastapi import APIRouter, Request  # Importa a classe APIRouter e Request do FastAPI
from fastapi.responses import HTMLResponse  # Importa a classe HTMLResponse do FastAPI para respostas HTML
from fastapi.templating import Jinja2Templates  # Importa a classe Jinja2Templates do FastAPI para renderização de templates

# Cria um roteador para as rotas relacionadas ao OpenAI
router = APIRouter()

# Define o diretório de templates para o Jinja2
templates = Jinja2Templates(directory="frontend/templates")

# Rota para a página principal dos serviços OpenAI
@router.get("/openai", response_class=HTMLResponse)
async def openai(request: Request):
	# Renderiza o template 'index.html' e passa o objeto 'request'
    return templates.TemplateResponse("openai/index.html", {"request": request})

# Rota para a página de TTS e Whisper
@router.get("/openai/tts_whisper", response_class=HTMLResponse)
async def tts_whisper_page(request: Request):
	# Renderiza o template 'tts_whisper.html' e passa o objeto 'request'
    return templates.TemplateResponse("openai/tts_whisper.html", {"request": request})

# Rota para a página de chat
@router.get("/openai/chat", response_class=HTMLResponse)
async def chat_page(request: Request):
	# Renderiza o template 'chat.html' e passa o objeto 'request'
    return templates.TemplateResponse("openai/chat.html", {"request": request})

# Rota para a página de Assistentes
@router.get("/openai/assistants", response_class=HTMLResponse)
async def assistants_page(request: Request):
	# Renderiza o template 'assistants.html' e passa o objeto 'request'
    return templates.TemplateResponse("openai/assistants.html", {"request": request})
