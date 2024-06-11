const AzureAiStt = (() => {
	const Selectors = {
		ParentSelector: "#azureAiStt", // Seletor do elemento pai da aplicação Speech to Text
		AzureAiStt: ".azureai-stt", // Seletor do elemento STT
	};

	// Função de inicialização da aplicação
	const Init = () => {
		// Inicializa o componente STT em todos os elementos com a classe '.azureai-stt'
		$(Selectors.ParentSelector).find(Selectors.AzureAiStt).createSTT();
	};

	Init(); // Chama a função de inicialização

	return {}; // Retorna um objeto vazio
})();
