from fastapi import APIRouter, File, HTTPException, UploadFile, Form # Importa os módulos necessários do FastAPI
from typing import Optional, List
from fastapi.responses import JSONResponse, StreamingResponse  # Importa tipos opcionais e listas do módulo typing
from services.azureai import sttService

# Cria um roteador para as rotas relacionadas ao azureai
router = APIRouter()

#region STT

@router.post("/api/azureai/stt")
async def stt_getTranscription(file: UploadFile = File(...)):
	try:
		transcription = await sttService.getTranscription(file)

		return JSONResponse(content={"transcription": transcription})	
	except Exception as e:
        # Retorna um erro 500 em caso de falha
		raise HTTPException(status_code=500, detail=str(e))

#endregion