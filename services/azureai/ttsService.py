from azureai import AzureAI  # Importa a classe AzureAI do módulo azureai
from dotenv import load_dotenv  # Importa a função load_dotenv do módulo dotenv
import os  # Importa o módulo os para lidar com variáveis de ambiente
import io  # Importa o módulo io para manipulação de entrada e saída em memória

# Carrega variáveis de ambiente do arquivo .env
load_dotenv()

# Cria um roteador para o serviço TTS
api_key = os.getenv("AZUREAI_API_KEY")

# Cria uma instância do cliente AzureAi
client = AzureAI(api_key=api_key)

async def getSpeech(text: str):
    # Envia o texto para o serviço TTS
    response = client.audio.speech.create(
        model="tts-1-hd",
        voice="alloy",
        input=text
    )
    
    # Converte a resposta em um fluxo de bytes e retorna como resposta de streaming
    return io.BytesIO(response.content)
