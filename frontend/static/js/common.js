// Função para exibir toasts
function showToast(message) {
	const toastContainer = document.getElementById("toastContainer");
	const toastElement = document.createElement("div");
	toastElement.className = "toast align-items-center text-white bg-danger border-0";
	toastElement.setAttribute("role", "alert");
	toastElement.setAttribute("aria-live", "assertive");
	toastElement.setAttribute("aria-atomic", "true");

	toastElement.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;

	toastContainer.appendChild(toastElement);

	const toast = new bootstrap.Toast(toastElement);
	toast.show();

	setTimeout(() => {
		toastElement.remove();
	}, 5000);
}

// Função comum para gravação de áudio
async function startRecording(setupRecording, stopRecording) {
	if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		const mediaRecorder = new MediaRecorder(stream);
		const audioChunks = [];

		mediaRecorder.ondataavailable = (event) => {
			audioChunks.push(event.data);
		};

		mediaRecorder.onstop = async () => {
			const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
			const formData = new FormData();
			formData.append("file", audioBlob, "audio.webm");

			const response = await fetch("/openai/whisper", {
				method: "POST",
				body: formData,
			});

			if (response.ok) {
				const data = await response.json();
				const transcription = data.transcription;
				stopRecording(transcription);
			} else {
				showToast("Falha ao transcrever áudio.");
			}

			// Parar todos os tracks do stream
			stream.getTracks().forEach((track) => track.stop());
		};

		mediaRecorder.start();
		setupRecording(mediaRecorder);
	}
}

// Função comum para converter texto em fala
async function textToSpeech(text) {
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
