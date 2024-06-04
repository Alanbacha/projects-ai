(function ($) {
	// Definindo um novo plugin jQuery chamado createTTS
	$.fn.createTTS = function () {
		// Definindo classes CSS usadas no plugin
		const Classes = {
			BtnConvertToSpeech: "tts-btn-convert-to-speech",
			AudioContainer: "tts-audio-container",
			TxtaToConvert: "tts-txta-to-convert"
		};

		// Iterando sobre cada elemento jQuery selecionado
		return this.each(function () {
			const jqThis = $(this); // Armazenando a referência ao elemento jQuery atual

			// Função de inicialização
			const Init = () => {
				LoadHtml();   // Carregar o HTML necessário
				LoadEvents(); // Adicionar eventos necessários
			};

			// Função para carregar o HTML
			const LoadHtml = () => {
				jqThis.html(`
					<h5 class="card-title">Conversor de Texto para Fala (TTS)</h5>
					<textarea class="form-control mb-2 ${Classes.TxtaToConvert}" placeholder="Digite o texto aqui..."></textarea>
					<div class="d-flex gap-2 justify-content-center align-items-center">
						<button class="btn btn-primary ${Classes.BtnConvertToSpeech}"><i class="bi bi-volume-up"></i> Converter para Fala</button>
						<div class="flex-grow-1 ${Classes.AudioContainer}"></div>
					</div>
				`);
			};

			// Função para adicionar eventos
			const LoadEvents = () => {
				jqThis
					.on("click", `.${Classes.BtnConvertToSpeech}`, ConvertToSpeech); // Evento de clique no botão de conversão
			};

			// Função para converter texto em fala
			const ConvertToSpeech = async () => {
				const text = jqThis.find(`.${Classes.TxtaToConvert}`).val(); // Obtendo o texto do textarea
				if (text.trim() === "") { // Verificando se o texto está vazio
					CommonApp.ShowToast("Digite um texto para converter.", "danger"); // Exibindo mensagem de erro
					return;
				}

				const audio = await CommonApp.TextToSpeech(text, false); // Convertendo o texto em áudio
				if (audio) {
					const audioContainer = jqThis.find(`.${Classes.AudioContainer}`); // Selecionando o contêiner de áudio
					const audioElement = $(`<audio controls autoplay class="w-100">`).attr("src", audio.src); // Criando o elemento de áudio
					audioContainer.html(audioElement); // Adicionando o elemento de áudio ao contêiner
				} else {
					CommonApp.ShowToast("Falha ao converter texto para fala.", "danger"); // Exibindo mensagem de erro
				}
			};

			Init(); // Chamando a função de inicialização
		});
	};
}(jQuery));
