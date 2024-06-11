from fastapi import APIRouter, Request  # Importa a classe APIRouter e Request do FastAPI
from fastapi.responses import HTMLResponse  # Importa a classe HTMLResponse do FastAPI para respostas HTML
from fastapi.templating import Jinja2Templates  # Importa a classe Jinja2Templates do FastAPI para renderização de templates

# Cria um roteador para as rotas relacionadas ao AzureAI
router = APIRouter()

# Define o diretório de templates para o Jinja2
templates = Jinja2Templates(directory="frontend/templates")

# Rota para a página principal dos serviços AzureAI
@router.get("/azureai", response_class=HTMLResponse)
async def azureai(request: Request):
	# Renderiza o template 'index.html' e passa o objeto 'request'
    return templates.TemplateResponse("azureai/index.html", {"request": request})

# Rota para a página de Speech to Text
@router.get("/azureai/stt", response_class=HTMLResponse)
async def stt_page(request: Request):
	# Renderiza o template 'stt.html' e passa o objeto 'request'
    return templates.TemplateResponse("azureai/stt.html", {"request": request})
