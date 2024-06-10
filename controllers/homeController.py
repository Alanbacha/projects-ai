from fastapi import APIRouter, Request  # Importa a classe APIRouter e Request do FastAPI
from fastapi.responses import HTMLResponse  # Importa a classe HTMLResponse do FastAPI para respostas HTML
from fastapi.templating import Jinja2Templates  # Importa a classe Jinja2Templates do FastAPI para renderização de templates

# Cria um roteador para as rotas da página inicial
router = APIRouter()

# Define o diretório de templates para o Jinja2
templates = Jinja2Templates(directory="frontend/templates")

# Rota para a página inicial
@router.get("/", response_class=HTMLResponse)
async def index(request: Request):
    # Renderiza o template 'index.html' e passa o objeto 'request'
    return templates.TemplateResponse("home/index.html", {"request": request})
