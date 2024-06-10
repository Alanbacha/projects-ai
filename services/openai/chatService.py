from openai import OpenAI  # Importa a classe OpenAI do módulo openai
from fastapi import HTTPException, File, UploadFile, Form # Importa os módulos necessários do FastAPI
from fastapi.responses import JSONResponse  # Importa a classe JSONResponse do módulo fastapi.responses
from typing import Optional, List  # Importa tipos opcionais e listas do módulo typing
from dotenv import load_dotenv  # Importa a função load_dotenv do módulo dotenv
import os  # Importa o módulo os para lidar com variáveis de ambiente
import uuid  # Importa o módulo uuid para gerar IDs únicos

# Carregar variáveis de ambiente do arquivo .env
load_dotenv()

# Cria um roteador para o serviço Chat
api_key = os.getenv("OPENAI_API_KEY")

# Cria uma instância do cliente OpenAI
client = OpenAI(api_key=api_key)

# Dicionário para armazenar os históricos de chat
chat_histories = {}

# Define a rota POST para o serviço de chat
async def sendMessage(
	chat_id: Optional[str] = Form(None),
	message: str = Form(...),
	files: List[UploadFile] = File([]),
):
	# Se não houver chat_id, criar um novo chat
	if chat_id is None:
		chat_id = str(uuid.uuid4())
		chat_histories[chat_id] = [{"role": "system", "content": "You are chatting with Axel, your assistant."}]
	else:
		if chat_id not in chat_histories:
			chat_histories[chat_id] = [{"role": "system", "content": "You are chatting with Axel, your assistant."}]
	
	# Adicionar a mensagem do usuário ao histórico
	chat_histories[chat_id].append({"role": "user", "content": message})

	# Processar arquivos
	for file in files:
		# file_content = await file.read()
		# Adicionar a mensagem do usuário ao histórico
		chat_histories[chat_id].append({"role": "user", "content": f"File received: {file.filename}"}) # Adicionar arquivo
	
	response = client.chat.completions.create(
		model="gpt-4o",
		messages=chat_histories[chat_id]
	)
	
	# Acessar corretamente a mensagem retornada
	chat_response = response.choices[0].message.content

	# Adicionar a resposta do assistente ao histórico
	chat_histories[chat_id].append({"role": "assistant", "content": chat_response})

	return { "id": chat_id, "response": chat_response }
