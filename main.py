from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from controllers.homeController import router as home_router
from controllers.openaiController import router as openai_router
from controllers.azureaiController import router as azureai_router

from controllers.api.openaiController import router as api_openai_router
from controllers.api.azureaiController import router as api_azureai_router

app = FastAPI()

# Montar o diretório de arquivos estáticos
app.mount("/static", StaticFiles(directory="frontend/static"), name="static")

app.include_router(home_router)
app.include_router(openai_router)
app.include_router(azureai_router)

app.include_router(api_openai_router)
app.include_router(api_azureai_router)

if __name__ == '__main__':
	import uvicorn
	uvicorn.run(app, host='0.0.0.0', port=8001)
