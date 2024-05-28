document.addEventListener("DOMContentLoaded", () => {
	const convertToSpeechButton = document.getElementById("convertToSpeech");
	const startRecordingButton = document.getElementById("startRecording");
	const stopRecordingButton = document.getElementById("stopRecording");
	const textToConvert = document.getElementById("textToConvert");
	const transcriptionOutput = document.getElementById("transcriptionOutput");
	const transcriptionCard = document.getElementById("transcriptionCard");

	let mediaRecorder;
	let audioChunks = [];
	let mediaStream;

	// Função para mostrar o toast
	function showToast(message) {
		const toastContainer = document.getElementById("toastContainer");

		const toast = document.createElement("div");
		toast.className = "toast align-items-center text-white bg-danger border-0 show";
		toast.setAttribute("role", "alert");
		toast.setAttribute("aria-live", "assertive");
		toast.setAttribute("aria-atomic", "true");

		const toastBody = document.createElement("div");
		toastBody.className = "d-flex";

		const toastContent = document.createElement("div");
		toastContent.className = "toast-body";
		toastContent.innerText = message;

		const closeButton = document.createElement("button");
		closeButton.type = "button";
		closeButton.className = "btn-close btn-close-white me-2 m-auto";
		closeButton.setAttribute("data-bs-dismiss", "toast");
		closeButton.setAttribute("aria-label", "Close");

		toastBody.appendChild(toastContent);
		toastBody.appendChild(closeButton);
		toast.appendChild(toastBody);
		toastContainer.appendChild(toast);

		setTimeout(() => {
			toastContainer.removeChild(toast);
		}, 5000);
	}

	// Função para conversão de texto para fala
	convertToSpeechButton.addEventListener("click", async () => {
		const text = textToConvert.value;
		if (text.trim() === "") {
			showToast("Digite um texto para converter.");
			return;
		}
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
		} else {
			showToast("Falha ao converter texto em fala");
		}
	});

	// Função para iniciar a gravação
	startRecordingButton.addEventListener("click", async () => {
		startRecordingButton.style.display = "none";
		stopRecordingButton.style.display = "inline-block";
		audioChunks = [];

		// Esconder a transcrição antiga
		transcriptionCard.style.display = "none";
		transcriptionOutput.innerText = "";

		try {
			mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
			mediaRecorder = new MediaRecorder(mediaStream, { mimeType: "audio/webm" });

			mediaRecorder.ondataavailable = (event) => {
				audioChunks.push(event.data);
			};

			mediaRecorder.start();
		} catch (error) {
			showToast("Erro ao acessar o microfone");
			startRecordingButton.style.display = "inline-block";
			stopRecordingButton.style.display = "none";
		}
	});

	// Função para parar a gravação
	stopRecordingButton.addEventListener("click", async () => {
		startRecordingButton.style.display = "inline-block";
		stopRecordingButton.style.display = "none";

		mediaRecorder.stop();

		mediaRecorder.onstop = async () => {
			const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
			const audioUrl = URL.createObjectURL(audioBlob);

			// Tocar o áudio gravado para verificação
			// const audio = new Audio(audioUrl);
			// audio.play();

			const formData = new FormData();
			formData.append("file", audioBlob, "recording.webm");

			const response = await fetch("/openai/whisper", {
				method: "POST",
				body: formData,
			});

			if (response.ok) {
				const data = await response.json();
				transcriptionOutput.innerText = data.transcription;
				transcriptionCard.style.display = "block";
			} else {
				showToast("Erro ao processar o áudio");
			}

			// Parar todas as tracks do stream de mídia
			mediaStream.getTracks().forEach((track) => track.stop());
		};
	});
});
