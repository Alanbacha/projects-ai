from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

# Cria um roteador para as rotas da página inicial
router = APIRouter()
# Define o diretório de templates para o Jinja2
templates = Jinja2Templates(directory="frontend/templates")

# Rota para a página inicial
@router.get("/", response_class=HTMLResponse)
async def home_page(request: Request):
    # Renderiza o template 'index.html' e passa o objeto 'request'
    return templates.TemplateResponse("home/index.html", {"request": request})

# Define o roteador para ser incluído no controlador principal
homeRouter = router
