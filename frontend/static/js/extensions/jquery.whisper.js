(function ($) {
	// Definindo um novo plugin jQuery chamado createWhisper
	$.fn.createWhisper = function () {
		// Definindo classes CSS usadas no plugin
		const Classes = {
			BtnStartRecording: "whisper-btn-start-recording",
			BtnStopRecording: "whisper-btn-stop-recording",
			TranscriptionCard: "whisper-transcription-card",
			TranscriptionOutput: "whisper-transcription-output"
		};

		let mediaRecorder; // Variável para armazenar o MediaRecorder

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
					<h5 class="card-title">Serviço de Transcrição (Whisper)</h5>
					<button class="btn btn-success ${Classes.BtnStartRecording}"><i class="bi bi-mic-fill"></i> Iniciar Gravação</button>
					<button class="btn btn-danger ${Classes.BtnStopRecording}" style="display: none"><i class="bi bi-stop-fill"></i> Parar Gravação</button>
					<div class="card mt-2 ${Classes.TranscriptionCard}" style="display: none">
						<div class="card-header bg-info text-dark">Transcrição</div>
						<div class="card-body">
							<p class="card-text text-light ${Classes.TranscriptionOutput}"></p>
						</div>
					</div>
				`);
			};

			// Função para adicionar eventos
			const LoadEvents = () => {
				jqThis
					.on("click", `.${Classes.BtnStartRecording}`, StartRecording) // Evento de clique no botão de iniciar gravação
					.on("click", `.${Classes.BtnStopRecording}`, StopRecording);   // Evento de clique no botão de parar gravação
			};

			// Função para exibir a transcrição
			const ShowTranscription = (transcription) => {
				jqThis.find(`.${Classes.TranscriptionOutput}`).html(transcription); // Atualizando o texto da transcrição
				jqThis.find(`.${Classes.TranscriptionCard}`).show(); // Mostrando o card de transcrição
			};

			// Função para iniciar a gravação
			const StartRecording = () => {
				jqThis.find(`.${Classes.convertToSpeechButton}`).prop("disabled", true); // Desabilitando o botão de conversão para fala
				CommonApp.StartRecording(
					(recorder) => {
						mediaRecorder = recorder; // Armazenando o MediaRecorder
						jqThis.find(`.${Classes.BtnStartRecording}`).hide(); // Escondendo o botão de iniciar gravação
						jqThis.find(`.${Classes.BtnStopRecording}`).show(); // Mostrando o botão de parar gravação
						jqThis.find(`.${Classes.TranscriptionCard}`).hide(); // Escondendo o card de transcrição
					},
					(transcription) => {
						ShowTranscription(transcription); // Exibindo a transcrição
						jqThis.find(`.${Classes.BtnStartRecording}`).show(); // Mostrando o botão de iniciar gravação
						jqThis.find(`.${Classes.BtnStopRecording}`).hide(); // Escondendo o botão de parar gravação
						jqThis.find(`.${Classes.convertToSpeechButton}`).prop("disabled", false); // Habilitando o botão de conversão para fala
					}
				);
			};

			// Função para parar a gravação
			const StopRecording = () => {
				if (mediaRecorder && mediaRecorder.state !== "inactive") {
					mediaRecorder.stop(); // Parando o MediaRecorder
					jqThis.find(`.${Classes.BtnStartRecording}`).show(); // Mostrando o botão de iniciar gravação
					jqThis.find(`.${Classes.BtnStopRecording}`).hide(); // Escondendo o botão de parar gravação
				}
			};

			Init(); // Chamando a função de inicialização
		});
	};
}(jQuery));
