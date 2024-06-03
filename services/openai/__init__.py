# Este arquivo inicializa o pacote 'openai' dentro do pacote 'services'
# Pode ser usado para importar módulos de serviços OpenAI e configurar inicializações globais
from .whisperService import router as whisperRouter
from .ttsService import router as ttsRouter
from .chatService import router as chatRouter
from .assistantsService import router as assistantsRouter
