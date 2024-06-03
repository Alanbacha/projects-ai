const TTSWhisperApp = (() => {
	const Selectors = {
		ParentSelector: "#ttsWhisperApp",
	};

	const Init = () => {
		$(Selectors.ParentSelector).find('.component-tts').createTTS();
		$(Selectors.ParentSelector).find('.component-whisper').createWhisper();
	};

	Init();

	return {};
})();