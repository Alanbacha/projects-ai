from openai import OpenAI  # Importa a classe OpenAI do módulo openai
from fastapi import APIRouter, HTTPException, File, UploadFile, Form # Importa os módulos necessários do FastAPI
from fastapi.responses import JSONResponse  # Importa a classe JSONResponse do módulo fastapi.responses
from typing import Optional, List  # Importa tipos opcionais e listas do módulo typing
from dotenv import load_dotenv  # Importa a função load_dotenv do módulo dotenv
import os  # Importa o módulo os para lidar com variáveis de ambiente

# Carregar variáveis de ambiente do arquivo .env
load_dotenv()

# Cria um roteador para o serviço Assistants
router = APIRouter()
api_key = os.getenv("OPENAI_ASSISTANTS_API_KEY")

# Cria uma instância do cliente OpenAI
client = OpenAI(api_key=api_key)

# Dicionário para armazenar os históricos de threads
thread_histories = {}

# Define a rota POST para criar um assistente
@router.post("/assistants")
async def create_assistant(
    name: str = Form(...),
    instructions: str = Form(...),
    model: str = Form(...),
    file_search: Optional[str] = Form(None),
    code_interpreter: Optional[str] = Form(None),
    temperature: float = Form(1.0),
    top_p: float = Form(1.0),
):
    try:
        tools = []
        if file_search == "on":
            tools.append({"type": "file_search"})
        if code_interpreter == "on":
            tools.append({"type": "code_interpreter"})

        response = client.beta.assistants.create(
            name=name,
            instructions=instructions,
            model=model,
            tools=tools,
            temperature=temperature,
            top_p=top_p,
        )
        return JSONResponse(content=response.to_dict())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Define a rota GET para obter a lista de assistentes
@router.get("/assistants")
async def get_assistants():
    try:
        response = client.beta.assistants.list(order="desc",limit=20)

        # Serializar os objetos de assistentes
        assistants_list = [assistant.to_dict() for assistant in response.data]

        return JSONResponse(content=assistants_list)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Define a rota GET para obter detalhes de um assistente específico
@router.get("/assistants/{assistant_id}")
async def get_assistant(assistant_id: str):
    try:
        response = client.beta.assistants.retrieve(assistant_id)
        return JSONResponse(content=response.to_dict())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Define a rota PUT para atualizar um assistente existente
@router.put("/assistants/{assistant_id}")
async def update_assistant(
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
        tools = []
        if file_search == "on":
            tools.append({"type": "file_search"})
        if code_interpreter == "on":
            tools.append({"type": "code_interpreter"})

        response = client.beta.assistants.update(
            assistant_id,
            name=name,
            instructions=instructions,
            model=model,
            tools=tools,
            temperature=temperature,
            top_p=top_p,
        )
        return JSONResponse(content=response.to_dict())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Define a rota DELETE para excluir um assistente
@router.delete("/assistants/{assistant_id}")
async def delete_assistant(assistant_id: str):
    try:
        response = client.beta.assistants.delete(assistant_id)
        return JSONResponse(content=response.to_dict())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Define a rota POST para o serviço de thread
@router.post("/assistants/{assistant_id}/thread")
async def thread_service(
    assistant_id: str,
    thread_id: Optional[str] = Form(None),
    message: str = Form(...),
    files: List[UploadFile] = File([]),
):
    if thread_id is None:
        thread = client.beta.threads.create()
        thread_id = thread.id
        thread_histories[thread_id] = [{"role": "system", "content": "You are chatting with Axel, your assistant."}]
    else:
        if thread_id not in thread_histories:
            thread_histories[thread_id] = [{"role": "system", "content": "You are chatting with Axel, your assistant."}]
    
    fileList = []
    for file in files:
        file_id = await upload_file_to_openai(file)
        fileList.append({"file_id":file_id, "tools":[{"type": "file_search"}]})

    try:
        response = client.beta.threads.messages.create(
            thread_id=thread_id,
            role="user",
            content=message,
            attachments=fileList
        )

        thread_histories[thread_id].append({"role": "user", "content": message,"attachments":fileList})

        run_response = client.beta.threads.runs.create_and_poll(
            thread_id=thread_id,
            assistant_id=assistant_id
        )

        thread_messages = client.beta.threads.messages.list(
            thread_id=thread_id,
            run_id=run_response.id
        )
        
        thread_response = thread_messages.data[0].content[0].text.value
        thread_histories[thread_id].append({"role": "assistant", "content": thread_response})

        return JSONResponse(content={"thread_id": thread_id, "response": thread_response})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Função para fazer upload de um arquivo para o OpenAI
async def upload_file_to_openai(file: UploadFile):
    try:
        response = client.files.create(
            file=(file.filename, file.file.read()),
            purpose='user_data'
        )

        return response.id
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload file: {str(e)}")

# Define o roteador para ser incluído no controlador principal
assistantsRouter = router
