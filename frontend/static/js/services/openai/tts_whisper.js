document.addEventListener("DOMContentLoaded", () => {
	const convertToSpeechButton = document.getElementById("convertToSpeech");
	const textToConvert = document.getElementById("textToConvert");
	const startRecordingButton = document.getElementById("startRecording");
	const stopRecordingButton = document.getElementById("stopRecording");
	const transcriptionOutput = document.getElementById("transcriptionOutput");
	const transcriptionCard = document.getElementById("transcriptionCard");
	let mediaRecorder;

	function showTranscription(transcription) {
		transcriptionOutput.innerHTML = transcription;
		transcriptionCard.style.display = "block";
	}

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
			showToast("Falha ao converter texto para fala.");
		}
	});

	startRecordingButton.addEventListener("click", () => {
		startRecording(
			(recorder) => {
				mediaRecorder = recorder;
				startRecordingButton.style.display = "none";
				stopRecordingButton.style.display = "inline-block";
				transcriptionCard.style.display = "none";
			},
			(transcription) => {
				showTranscription(transcription);
				startRecordingButton.style.display = "inline-block";
				stopRecordingButton.style.display = "none";
			}
		);
	});

	stopRecordingButton.addEventListener("click", () => {
		if (mediaRecorder && mediaRecorder.state !== "inactive") {
			mediaRecorder.stop();
			startRecordingButton.style.display = "inline-block";
			stopRecordingButton.style.display = "none";
		}
	});
});
