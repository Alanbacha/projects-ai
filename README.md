# IA Conversacional com OpenAI e FastAPI

Este projeto demonstra a integração de serviços de IA utilizando OpenAI e FastAPI. Ele inclui a conversão de texto para fala (TTS), transcrição de áudio (Whisper), um chatbot interativo, além da criação e conversação com agentes IA

## Estrutura do Projeto

-   `controllers/`: Controladores FastAPI para diferentes serviços.
    -   `api/`: Controladores de API.
-   `frontend/`: Arquivos HTML, CSS, JavaScript e Imagens.
    -   `static/`: Arquivos estáticos (CSS, JS, imagens).
        -   `css/`: Arquivos CSS organizados por seções do site.
        -   `images/`: Imagens utilizadas no site.
        -   `js/`: Arquivos JavaScript organizados por seções do site.
    -   `templates/`: Arquivos HTML para renderização com Jinja2.
        -   `azureai/`: Templates para os serviços da AzureAI.
        -   `home/`: Templates para a página inicial.
        -   `openai/`: Templates para os serviços da OpenAI.
-   `services/`: Contém os serviços de backend para integração.
    -   `azureai/`: Serviços específicos para AzureAI.
    -   `openai/`: Serviços específicos para OpenAI.
-   `venv/`: Contém o ambiente virtual.
-   `.env`: Arquivo de variáveis de ambiente.
-   `build.js`: Script para construção do projeto.
-   `main.py`: Arquivo principal de inicialização do Python
-   `package.json`: Lista de dependências do NPM.
-   `requirements.txt`: Lista de dependências do Python.

## Configuração do Ambiente

1. Clone o repositório:

```powershell
git clone https://github.com/Alanbacha/projects-ai
cd projects-ai
```

2. Crie e ative um ambiente virtual:

```powershell
python -m venv env
env\Scripts\activate
```

3. Crie o arquivo .env na raiz do projeto e configure as variáveis de ambiente:

```env
OPENAI_API_KEY=your_openai_api_key
OPENAI_ASSISTANTS_API_KEY=your_openai_api_key
```

## Execução do Projeto

1. Construa os arquivos necessários:

```powershell
npm run build
```

2. Inicie o servidor:

```powershell
npm start
```

3. Acesse a aplicação em http://127.0.0.1:8001.

## Conclusão

Este projeto demonstra como integrar serviços de IA usando OpenAI e AzureAI, proporcionando uma aplicação web interativa com funcionalidades avançadas de IA.
