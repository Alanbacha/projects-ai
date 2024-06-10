import io  # Importa o módulo io para manipulação de entrada e saída em memória
from fastapi import APIRouter, File, HTTPException, UploadFile, Form # Importa os módulos necessários do FastAPI
from typing import Optional, List
from fastapi.responses import JSONResponse, StreamingResponse  # Importa tipos opcionais e listas do módulo typing
from services.openai import assistantsService, chatService, ttsService, whisperService

# Cria um roteador para as rotas relacionadas ao OpenAI
router = APIRouter()

#region Assistants

@router.post("/api/openai/assistants")
async def assistant_create(
	name: str = Form(...),
	instructions: str = Form(...),
	model: str = Form(...),
	file_search: Optional[str] = Form(None),
	code_interpreter: Optional[str] = Form(None),
	temperature: float = Form(1.0),
	top_p: float = Form(1.0),
):
	try:
		response = await assistantsService.create(name, instructions, model, file_search, code_interpreter, temperature, top_p)

		return JSONResponse(content=response)
	except Exception as e:
		raise HTTPException(status_code=500, detail=str(e))
	

@router.get("/api/openai/assistants")
async def assistant_getAll():
	try:
		assistants_list = await assistantsService.getAll()
		return JSONResponse(content=assistants_list)
	except Exception as e:
		raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/openai/assistants/{assistant_id}")
async def assistant_get(assistant_id: str):
	try:
		response = await assistantsService.get(assistant_id)
		return JSONResponse(content=response)
	except Exception as e:
		raise HTTPException(status_code=500, detail=str(e))
	

@router.put("/api/openai/assistants/{assistant_id}")
async def assistant_update(
	assistant_id: str,
	name: str = Form(...),
	instructions: str = Form(...),
	model: str = Form(...),
	file_search: Optional[str] = Form(None),
	code_interpreter: Optional[str] = Form(None),
	temperature: float = Form(1.0),
	top_p: float = Form(1.0),
):
	try:
		response = await assistantsService.update(assistant_id, name, instructions, model, file_search, code_interpreter, temperature, top_p) 
		return JSONResponse(content=response)
	except Exception as e:
		raise HTTPException(status_code=500, detail=str(e))

@router.delete("/api/openai/assistants/{assistant_id}")
async def assistant_delete(assistant_id: str):
	try:
		response = await assistantsService.delete(assistant_id)
		return JSONResponse(content=response)
	except Exception as e: 
		raise HTTPException(status_code=500, detail=str(e))
	
@router.post("/api/openai/assistants/{assistant_id}/thread")
async def assistant_thread(
	assistant_id: str,
	thread_id: Optional[str] = Form(None),
	message: str = Form(...),
	files: List[UploadFile] = File([])
):
	try:
		response = await assistantsService.thread(assistant_id, thread_id, message, files)
		return JSONResponse(content=response)
	except Exception as e: 
		raise HTTPException(status_code=500, detail=str(e))

#endregion

#region Chat

@router.post("/api/openai/chat")
async def chat_sendMessage(
	chat_id: Optional[str] = Form(None),
	message: str = Form(...),
	files: List[UploadFile] = File([]),
):
	try:
		chat_response = await chatService.sendMessage(chat_id, message, files)

		return JSONResponse(content={"chat_id": chat_response["id"], "response": chat_response["response"]})
	except Exception as e:
		# Retorna um erro 500 em caso de falha
		raise HTTPException(status_code=500, detail=str(e))
#endregion

#region TTS

@router.post("/api/openai/tts")
async def tts_getSpeech(
	text: str = Form(...)
):
	try:
		audio_stream = await ttsService.getSpeech(text)
		return StreamingResponse(audio_stream, media_type="audio/mpeg")
	except Exception as e:
		# Retorna um erro 500 em caso de falha
		raise HTTPException(status_code=500, detail=str(e))

#endregion

#region Whisper

@router.post("/api/openai/whisper")
async def whisper_getTranscription(file: UploadFile = File(...)):
	try:
		transcription = await whisperService.getTranscription(file)

		return JSONResponse(content={"transcription": transcription})	
	except Exception as e:
        # Retorna um erro 500 em caso de falha
		raise HTTPException(status_code=500, detail=str(e))

#endregion