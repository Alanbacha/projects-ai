from fastapi import FastAPI
from api.controllers.home.home_controller import router as main_router

app = FastAPI()

app.include_router(main_router)
