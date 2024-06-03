from openai import OpenAI
from fastapi import APIRouter, HTTPException, File, UploadFile, Form
from fastapi.responses import JSONResponse
from typing import Optional, List
from dotenv import load_dotenv
import os

# Carregar variáveis de ambiente do arquivo .env
load_dotenv()

# Cria um roteador para o serviço Assistants
router = APIRouter()
api_key = os.getenv("OPENAI_ASSISTANTS_API_KEY")

# Cria uma instância do cliente OpenAI
client = OpenAI(api_key=api_key)

@router.post("/assistants")
async def create_assistant(
    name: str = Form(...),
    instructions: str = Form(...),
    model: str = Form(...),
    temperature: float = Form(1.0),
    top_p: float = Form(1.0),
    # files: List[UploadFile] = File([])
):
    # file_data = [{"filename": file.filename, "content": (await file.read()).decode("utf-8")} for file in files]
    try:
        response = client.beta.assistants.create(
            name=name,
            instructions=instructions,
            model=model,
            temperature=temperature,
            top_p=top_p,
            # files=file_data
        )
        return JSONResponse(content=response.to_dict())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/assistants")
async def get_assistants():
    try:
        response = client.beta.assistants.list(
            order="desc",
            limit="20",
        )

        # Serializar os objetos de assistentes
        assistants_list = [assistant.to_dict() for assistant in response.data]

        return JSONResponse(content=assistants_list)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/assistants/{assistant_id}")
async def get_assistant(assistant_id: str):
    try:
        response = client.beta.assistants.retrieve(assistant_id)
        return JSONResponse(content=response.to_dict())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/assistants/{assistant_id}")
async def update_assistant(
    assistant_id: str,
    name: str = Form(...),
    instructions: str = Form(...),
    model: str = Form(...),
    temperature: float = Form(1.0),
    top_p: float = Form(1.0),
    # files: List[UploadFile] = File([])
):
    # file_data = [{"filename": file.filename, "content": (await file.read()).decode("utf-8")} for file in files]
    try:
        response = client.beta.assistants.update(
            assistant_id,
            name=name,
            instructions=instructions,
            model=model,
            temperature=temperature,
            top_p=top_p,
            # files=file_data
        )
        return JSONResponse(content=response.to_dict())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/assistants/{assistant_id}")
async def delete_assistant(assistant_id: str):
    try:
        response = client.beta.assistants.delete(assistant_id)

        return JSONResponse(content=response.to_dict())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# @router.post("/assistants-chat")
# async def assistants_chat_service(
#     assistant_id: str = Form(...),
#     message: str = Form(...),
#     files: List[UploadFile] = File([])
# ):
#     chat_histories = {}

#     # Se não houver histórico de chat para o assistente, criar um novo
#     if assistant_id not in chat_histories:
#         try:
#             assistant = client.beta.assistants.retrieve(assistant_id)
#             chat_histories[assistant_id] = [{"role": "system", "content": assistant["instructions"]}]
#         except Exception as e:
#             raise HTTPException(status_code=404, detail="Assistant not found")

#     # Adicionar a mensagem do usuário ao histórico
#     chat_histories[assistant_id].append({"role": "user", "content": message})

#     for file in files:
#         file_content = await file.read()
#         chat_histories[assistant_id].append({"role": "user", "content": f"File received: {file.filename}"})

#     try:
#         response = openai.ChatCompletion.create(
#             model="gpt-4",
#             messages=chat_histories[assistant_id]
#         )
        
#         chat_response = response.choices[0].message["content"]
#         chat_histories[assistant_id].append({"role": "assistant", "content": chat_response})

#         return JSONResponse(content={"assistant_id": assistant_id, "response": chat_response})
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

assistantsRouter = router