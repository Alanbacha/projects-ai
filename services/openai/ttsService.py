from openai import OpenAI
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import io

load_dotenv()

router = APIRouter()
api_key = os.getenv("OPENAI_API_KEY")

class TextToSpeechRequest(BaseModel):
    text: str

@router.post("/tts")
async def tts_service(request: TextToSpeechRequest):
    client = OpenAI(api_key=api_key)
    try:
        response = client.audio.speech.create(
            model="tts-1-hd",
            voice="alloy",
            input=request.text
        )
        
        audio_stream = io.BytesIO(response.content)
        return StreamingResponse(audio_stream, media_type="audio/mpeg")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
