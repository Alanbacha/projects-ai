const TTSWhisperApp = (() => {
	const Selectors = {
		ParentSelector: "#ttsWhisperApp", // Seletor do elemento pai da aplicação TTSWhisper
	};

	// Função de inicialização da aplicação
	const Init = () => {
		// Inicializa o componente TTS em todos os elementos com a classe '.component-tts'
		$(Selectors.ParentSelector).find('.component-tts').createTTS();
		// Inicializa o componente Whisper em todos os elementos com a classe '.component-whisper'
		$(Selectors.ParentSelector).find('.component-whisper').createWhisper();
	};

	Init(); // Chama a função de inicialização

	return {}; // Retorna um objeto vazio
})();
