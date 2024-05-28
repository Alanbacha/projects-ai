from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from services.openai import whisperRouter, ttsRouter, chatRouter

router = APIRouter()
templates = Jinja2Templates(directory="frontend/templates")

@router.get("/openai_services", response_class=HTMLResponse)
async def openai_services(request: Request):
    return templates.TemplateResponse("services/openai/index.html", {"request": request})

@router.get("/openai_services/tts_whisper", response_class=HTMLResponse)
async def tts_whisper_page(request: Request):
    return templates.TemplateResponse("services/openai/tts_whisper.html", {"request": request})

@router.get("/openai_services/chat", response_class=HTMLResponse)
async def chat_page(request: Request):
    return templates.TemplateResponse("services/openai/chat.html", {"request": request})

# Incluir rotas dos serviços
router.include_router(whisperRouter, prefix="/openai")
router.include_router(ttsRouter, prefix="/openai")
router.include_router(chatRouter, prefix="/openai")
