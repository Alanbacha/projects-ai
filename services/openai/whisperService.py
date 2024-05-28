from openai import OpenAI
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from io import BytesIO
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
api_key = os.getenv("OPENAI_API_KEY")

@router.post("/whisper")
async def whisper_service(file: UploadFile = File(...)):
    client = OpenAI(api_key=api_key)
    try:
        audio_bytes = await file.read()
        # Assegurar que o formato do arquivo é webm
        if file.content_type != 'audio/webm':
            raise HTTPException(status_code=400, detail="Unsupported file format")

        audio_io = BytesIO(audio_bytes)
        audio_io.name = 'audio.webm'

        response = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_io
        )

        print("Response from OpenAI API:", response)  # Adicione esta linha para ver a resposta no console

        return JSONResponse(content={"transcription": response.text})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
