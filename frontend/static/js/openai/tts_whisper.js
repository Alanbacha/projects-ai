const TTSWhisperApp = (() => {
	const Selectors = {
		ParentSelector: "#ttsWhisperApp", // Seletor do elemento pai da aplicação TTSWhisper
		OpenAiTTS: ".openai-tts", // Seletor do elemento TTS
		OpenAiWhisper: ".openai-whisper", // Seletor do elemento Whisper
	};

	// Função de inicialização da aplicação
	const Init = () => {
		// Inicializa o componente TTS em todos os elementos com a classe '.openai-tts'
		$(Selectors.ParentSelector).find(Selectors.OpenAiTTS).createTTS();
		// Inicializa o componente Whisper em todos os elementos com a classe '.openai-whisper'
		$(Selectors.ParentSelector).find(Selectors.OpenAiWhisper).createWhisper();
	};

	Init(); // Chama a função de inicialização

	return {}; // Retorna um objeto vazio
})();
