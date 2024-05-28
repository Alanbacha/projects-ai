from fastapi import FastAPI
from api.controllers.home.home_controller import router as main_router

# Cria uma instância da aplicação FastAPI
app = FastAPI()

# Inclui o roteador da página inicial
# Isso adiciona todas as rotas definidas no 'main_router' ao aplicativo FastAPI
app.include_router(main_router)
