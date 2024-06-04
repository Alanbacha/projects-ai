const CommonApp = (() => {
	// Função para exibir um toast de mensagem
	const ShowToast = (message, bsClass = 'danger') => {
		const toastContainer = $("#toastContainer"); // Selecionando o contêiner do toast
		const toastElement = $(`
            <div class="toast align-items-center text-bg-${bsClass} border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">
                        ${message} 
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        `); // Criando o elemento do toast

		toastContainer.append(toastElement); // Adicionando o toast ao contêiner

		const toast = new bootstrap.Toast(toastElement[0]); // Criando o objeto de toast do Bootstrap
		toast.show(); // Exibindo o toast
		setTimeout(() => { toastElement.remove(); }, 5000); // Removendo o toast após 5 segundos
	};

	// Função para iniciar a gravação de áudio
	const StartRecording = async (setupRecording, stopRecording) => {
		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); // Capturando o áudio do usuário
			const mediaRecorder = new MediaRecorder(stream); // Inicializando o MediaRecorder
			const audioChunks = [];

			mediaRecorder.ondataavailable = (event) => { audioChunks.push(event.data); }; // Adicionando os chunks de áudio ao array

			mediaRecorder.onstop = async () => {
				const audioBlob = new Blob(audioChunks, { type: "audio/webm" }); // Criando um Blob com os chunks de áudio
				const formData = new FormData();
				formData.append("file", audioBlob, "audio.webm"); // Adicionando o Blob ao FormData

				const response = await fetch("/openai/whisper", { method: "POST", body: formData }); // Enviando o áudio para transcrição

				if (response.ok) {
					const data = await response.json();
					const transcription = data.transcription; // Obtendo a transcrição do áudio
					stopRecording(transcription); // Parando a gravação e passando a transcrição
				} else {
					ShowToast("Falha ao transcrever áudio."); // Exibindo um toast em caso de falha na transcrição
				}

				stream.getTracks().forEach((track) => track.stop()); // Parando a gravação do áudio
			};

			mediaRecorder.start(); // Iniciando a gravação
			setupRecording(mediaRecorder); // Configurando a gravação
		}
	};

	// Função para converter texto em fala
	const TextToSpeech = async (text, autoplay = true) => {
		const response = await fetch("/openai/tts", {
			method: "POST",
			headers: { "Content-Type": "application/json", },
			body: JSON.stringify({ text }), // Enviando o texto para a API de conversão de texto em fala
		});

		if (response.ok) {
			const audioBlob = await response.blob(); // Convertendo a resposta em um Blob de áudio
			const audioUrl = URL.createObjectURL(audioBlob); // Criando uma URL para o áudio
			const audio = new Audio(audioUrl); // Criando um elemento de áudio

			if (autoplay) {
				audio.play(); // Reproduzindo automaticamente o áudio, se necessário
			}

			return audio; // Retornando o elemento de áudio
		} else {
			ShowToast("Falha ao converter texto para fala."); // Exibindo um toast em caso de falha na conversão
			return null; // Retornando null em caso de falha
		}
	};

	// Lista de modelos de assistentes disponíveis
	const AssistantsListModels = [
		{ value: "gpt-4o", text: "GPT-4o" },
		{ value: "gpt-4-turbo", text: "GPT-4 Turbo" },
		{ value: "gpt-3.5-turbo", text: "GPT-3.5 Turbo" }
	];

	// Retornando os métodos e propriedades públicos
	return {
		ShowToast,
		StartRecording,
		TextToSpeech,
		AssistantsListModels
	};
})();
