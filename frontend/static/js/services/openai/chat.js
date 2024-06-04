const ChatApp = (() => {
	const Selectors = {
		ParentSelector: "#chatApp", // Seletor do elemento pai da aplicação de chat
	};

	// Função de inicialização da aplicação
	const Init = () => {
		$(Selectors.ParentSelector).find('.chat-openai').createChat(); // Inicializa o chat em todos os elementos com a classe '.chat-openai'
	};

	Init(); // Chama a função de inicialização

	return {}; // Retorna um objeto vazio
})();
