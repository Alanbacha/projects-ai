const TTSWhisperApp = (() => {
	const Selectors = {
		ConvertToSpeechButton: "#convertToSpeech",
		TextToConvert: "#textToConvert",
		StartRecordingButton: "#startRecording",
		StopRecordingButton: "#stopRecording",
		TranscriptionOutput: "#transcriptionOutput",
		TranscriptionCard: "#transcriptionCard",
		ParentSelector: "#ttsWhisperApp",
	};

	let mediaRecorder;

	const Init = () => {
		$(function () {
			LoadEvents();
		});
	};

	const LoadEvents = () => {
		$(Selectors.ParentSelector)
			.on("click", Selectors.ConvertToSpeechButton, ConvertToSpeech)
			.on("click", Selectors.StartRecordingButton, StartRecording)
			.on("click", Selectors.StopRecordingButton, StopRecording)
			;
	};

	const ShowTranscription = (transcription) => {
		$(Selectors.TranscriptionOutput).html(transcription);
		$(Selectors.TranscriptionCard).show();
	};

	const ConvertToSpeech = async () => {
		const text = $(Selectors.TextToConvert).val();
		if (text.trim() === "") {
			CommonApp.ShowToast("Digite um texto para converter.");
			return;
		}

		const audio = await CommonApp.TextToSpeech(text);
		if (!audio) {
			CommonApp.ShowToast("Falha ao converter texto para fala.");
		}
	};

	const StartRecording = () => {
		$(Selectors.ConvertToSpeechButton).prop("disabled", true);
		CommonApp.StartRecording(
			(recorder) => {
				mediaRecorder = recorder;
				$(Selectors.StartRecordingButton).hide();
				$(Selectors.StopRecordingButton).show();
				$(Selectors.TranscriptionCard).hide();
			},
			(transcription) => {
				ShowTranscription(transcription);
				$(Selectors.StartRecordingButton).show();
				$(Selectors.StopRecordingButton).hide();
				$(Selectors.ConvertToSpeechButton).prop("disabled", false);
			}
		);
	};

	const StopRecording = () => {
		if (mediaRecorder && mediaRecorder.state !== "inactive") {
			mediaRecorder.stop();
			$(Selectors.StartRecordingButton).show();
			$(Selectors.StopRecordingButton).hide();
		}
	};

	Init();

	return {};
})();