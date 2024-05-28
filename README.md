Copy code

# IA Conversacional com OpenAI e FastAPI

Este projeto demonstra a integração de serviços de IA utilizando OpenAI e FastAPI. Ele inclui a conversão de texto para fala (TTS), transcrição de áudio (Whisper) e um chatbot interativo.

## Estrutura do Projeto

-   `api/`: Contém controladores de API.
    -   `controllers/`: Controladores FastAPI para diferentes serviços.
        -   `home/`: Controlador para a página inicial.
        -   `services/`: Controlador para os serviços da OpenAI.
-   `frontend/`: Contém os arquivos HTML, CSS e JavaScript.
    -   `static/`: Arquivos estáticos (CSS, JS, imagens).
        -   `css/`: Arquivos CSS organizados por seções do site.
        -   `js/`: Arquivos JavaScript organizados por seções do site.
        -   `images/`: Imagens utilizadas no site.
    -   `templates/`: Arquivos HTML para renderização com Jinja2.
        -   `home/`: Templates para a página inicial.
        -   `services/`: Templates para os serviços da OpenAI.
-   `services/`: Contém os serviços de backend para integração com OpenAI.
    -   `openai/`: Serviços específicos para OpenAI.
-   `env/`: Contém o ambiente virtual.
-   `build.js`: Script para construção do projeto.
-   `requirements.txt`: Lista de dependências do Python.
-   `.env`: Arquivo de variáveis de ambiente.

## Configuração do Ambiente

1. Clone o repositório:

```bash
git clone https://github.com/Alanbacha/projects-ai
cd projects-ai
```

2. Crie e ative um ambiente virtual:

```bash
python -m venv env
source env/bin/activate # No Windows: env\Scripts\activate
```

3. Instale as dependências:

```bash
Copy code
pip install -r requirements.txt
npm install
```

4. Configure as variáveis de ambiente no arquivo .env:

```env
OPENAI_API_KEY=your_openai_api_key
```

## Execução do Projeto

1. Construa os arquivos necessários:

```bash
npm run build
```

2. Inicie o servidor:

```bash
npm start
```

3. Acesse a aplicação em http://127.0.0.1:8001.

## Funcionalidades

### Conversor de Texto para Fala (TTS)

-   Localização: /openai_services/tts_whisper
-   Permite a conversão de texto digitado em áudio usando o serviço TTS do OpenAI.

### Serviço de Transcrição (Whisper)

-   Localização: /openai_services/tts_whisper
-   Permite a gravação de áudio e a transcrição do áudio gravado usando o serviço Whisper do OpenAI.

### Chatbot Interativo

-   Localização: /openai_services/chat
-   Permite interagir com um modelo de chat do OpenAI. As mensagens enviadas são respondidas pelo modelo e a resposta é convertida em áudio para ser ouvida.

## Detalhes de Implementação

-   Arquivo common.js
-   Contém funções comuns para exibir toasts, gravar áudio e converter texto em fala.

### Arquivo chat.js

-   Gerencia a interação com o chatbot.
-   Envia mensagens de texto e áudio para o servidor.
-   Recebe respostas do chatbot e as converte em áudio.
-   Exibe mensagens e respostas na interface do usuário.

### Arquivo tts_whisper.js

-   Gerencia a conversão de texto para fala.
-   Grava áudio e envia para o serviço de transcrição.
-   Exibe a transcrição do áudio na interface do usuário.

### Arquivo whisperService.py

-   Serviço FastAPI para transcrição de áudio.
-   Recebe arquivos de áudio e retorna a transcrição usando o modelo Whisper do OpenAI.

### Arquivo ttsService.py

-   Serviço FastAPI para conversão de texto para fala.
-   Recebe texto e retorna áudio usando o modelo TTS do OpenAI.

### Arquivo chatService.py

-   Serviço FastAPI para interação com o chatbot.
-   Gerencia o histórico de chat e envia mensagens para o modelo de chat do OpenAI.
-   Retorna respostas do modelo e as converte em áudio.

## Comentários e Explicações

Os comentários nos arquivos de código explicam cada parte do código para facilitar a compreensão e a reutilização.

## Conclusão

Este projeto demonstra como integrar serviços de IA usando OpenAI e FastAPI, proporcionando uma aplicação web interativa com funcionalidades avançadas de IA.

### Verificar a Interface e Funcionalidade

1. Abra a página no navegador e verifique se a funcionalidade de toast funciona corretamente.
2. Verifique se as páginas `tts_whisper.html` e `chat.html` funcionam conforme esperado.
3. Certifique-se de que o serviço de chat retorna e exibe a resposta corretamente, converte a resposta em áudio, e a interface do chat mostra as mensagens do usuário e as respostas da IA.
4. Verifique se o botão de enviar áudio grava, transcreve e envia a mensagem corretamente.
5. Verifique se a funcionalidade de TTS e Whisper na página `tts_whisper.html` funciona conforme esperado.

Se precisar de mais alguma coisa, estou à disposição para ajudar!
