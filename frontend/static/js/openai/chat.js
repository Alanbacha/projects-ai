const OpenAiChat = (() => {
	const Selectors = {
		ParentSelector: "#openAiChat", // Seletor do elemento pai da aplicação de chat
		ComponentChat: ".openai-chat", // Seletor do elemento Chat
	};

	// Função de inicialização da aplicação
	const Init = () => {
		$(Selectors.ParentSelector).find(Selectors.ComponentChat).createChat(); // Inicializa o chat em todos os elementos com a classe '.openai-chat'
	};

	Init(); // Chama a função de inicialização

	return {}; // Retorna um objeto vazio
})();
