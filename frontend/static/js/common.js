const CommonApp = (() => {
	const ShowToast = (message, bsClass = 'danger') => {
		const toastContainer = $("#toastContainer");
		const toastElement = $(`
            <div class="toast align-items-center text-bg-${bsClass} border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        `);

		toastContainer.append(toastElement);

		const toast = new bootstrap.Toast(toastElement[0]);
		toast.show();
		setTimeout(() => { toastElement.remove(); }, 5000);
	};

	const StartRecording = async (setupRecording, stopRecording) => {
		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const mediaRecorder = new MediaRecorder(stream);
			const audioChunks = [];

			mediaRecorder.ondataavailable = (event) => { audioChunks.push(event.data); };

			mediaRecorder.onstop = async () => {
				const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
				const formData = new FormData();
				formData.append("file", audioBlob, "audio.webm");

				const response = await fetch("/openai/whisper", { method: "POST", body: formData, });

				if (response.ok) {
					const data = await response.json();
					const transcription = data.transcription;
					stopRecording(transcription);
				} else {
					ShowToast("Falha ao transcrever áudio.");
				}

				stream.getTracks().forEach((track) => track.stop());
			};

			mediaRecorder.start();
			setupRecording(mediaRecorder);
		}
	};

	const TextToSpeech = async (text, autoplay = true) => {
		const response = await fetch("/openai/tts", {
			method: "POST",
			headers: { "Content-Type": "application/json", },
			body: JSON.stringify({ text }),
		});

		if (response.ok) {
			const audioBlob = await response.blob();
			const audioUrl = URL.createObjectURL(audioBlob);
			const audio = new Audio(audioUrl);

			if (autoplay) {
				audio.play();
			}

			return audio;
		} else {
			ShowToast("Falha ao converter texto para fala.");
			return null;
		}
	};

	return {
		ShowToast,
		StartRecording,
		TextToSpeech,
	};
})();