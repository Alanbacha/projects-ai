// Função para exibir toasts
function showToast(message) {
	// Seleciona o contêiner onde os toasts serão adicionados
	const toastContainer = document.getElementById("toastContainer");
	// Cria um novo elemento de toast
	const toastElement = document.createElement("div");
	toastElement.className = "toast align-items-center text-white bg-danger border-0";
	toastElement.setAttribute("role", "alert");
	toastElement.setAttribute("aria-live", "assertive");
	toastElement.setAttribute("aria-atomic", "true");

	// Define o conteúdo do toast
	toastElement.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;

	// Adiciona o toast ao contêiner
	toastContainer.appendChild(toastElement);

	// Inicializa e exibe o toast usando o Bootstrap
	const toast = new bootstrap.Toast(toastElement);
	toast.show();

	// Remove o toast após 5 segundos
	setTimeout(() => {
		toastElement.remove();
	}, 5000);
}

// Função comum para gravação de áudio
async function startRecording(setupRecording, stopRecording) {
	// Verifica se o navegador suporta a API de mídia
	if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
		// Solicita permissão para usar o microfone
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		const mediaRecorder = new MediaRecorder(stream);
		const audioChunks = [];

		// Evento que é chamado quando há dados de áudio disponíveis
		mediaRecorder.ondataavailable = (event) => {
			audioChunks.push(event.data);
		};

		// Evento que é chamado quando a gravação é interrompida
		mediaRecorder.onstop = async () => {
			const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
			const formData = new FormData();
			formData.append("file", audioBlob, "audio.webm");

			// Envia o áudio gravado para o serviço Whisper
			const response = await fetch("/openai/whisper", {
				method: "POST",
				body: formData,
			});

			if (response.ok) {
				const data = await response.json();
				const transcription = data.transcription;
				// Chama a função de callback com a transcrição
				stopRecording(transcription);
			} else {
				showToast("Falha ao transcrever áudio.");
			}

			// Para todos os tracks do stream para liberar o microfone
			stream.getTracks().forEach((track) => track.stop());
		};

		// Inicia a gravação
		mediaRecorder.start();
		// Chama a função de callback para configurar a gravação
		setupRecording(mediaRecorder);
	}
}

// Função comum para converter texto em fala
async function textToSpeech(text) {
	// Envia o texto para o serviço TTS
	const response = await fetch("/openai/tts", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ text }),
	});

	if (response.ok) {
		const audioBlob = await response.blob();
		const audioUrl = URL.createObjectURL(audioBlob);
		const audio = new Audio(audioUrl);
		audio.play();
		return audio;
	} else {
		showToast("Falha ao converter texto para fala.");
		return null;
	}
}
