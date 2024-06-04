from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from api.controllers.home.home_controller import router as home_router
from api.controllers.services.openai_controller import router as openai_router

app = FastAPI()

# Montar o diretório de arquivos estáticos
app.mount("/static", StaticFiles(directory="frontend/static"), name="static")

app.include_router(home_router)
app.include_router(openai_router)

if __name__ == '__main__':
	import uvicorn
	uvicorn.run(app, host='0.0.0.0', port=8001)
