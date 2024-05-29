const ChatApp = (() => {
	const Selectors = {
		SendMessageButton: "#sendMessage",
		ChatInput: "#chatInput",
		ChatWindow: "#chatWindow",
		StartRecordingButton: "#startRecording",
		StopRecordingButton: "#stopRecording",
		FileInput: "#fileInput",
		FilePreview: "#filePreview",
		ParentSelector: "#chatApp",
	};

	let chatId = null;
	let mediaRecorder;
	let attachedFiles = [];

	const Init = () => {
		$(function () {
			LoadEvents();
		});
	};

	const LoadEvents = () => {
		$(Selectors.ParentSelector).on("click", Selectors.SendMessageButton, SendMessage).on("click", Selectors.StartRecordingButton, StartRecording).on("click", Selectors.StopRecordingButton, StopRecording).on("change", Selectors.FileInput, PreviewFiles);
	};

	const CreateMessage = (content, isUser = true, files = [], audioUrl = null) => {
		const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
		const filesHtml = files.map((file) => CreateFileCard(file, isUser, false)).join("");
		const audioPlayerHtml = audioUrl ? `<div class="audio-container" id="audio-${Date.now()}"></div>` : "";
		return `
            <div class="card ${isUser ? "text-bg-primary align-self-end" : "text-bg-secondary align-self-start"} mb-2" style="max-width: 80%;">
                <div class="card-body">
                    <p class="card-text" style="font-size: 1em;">${content}</p>
                    ${filesHtml}
                    ${audioPlayerHtml}
                    <div class="text-end text-white-50" style="font-size: 0.8em;">${time}</div>
                </div>
            </div>
        `;
	};

	const AddMessageToChat = (content, isUser = true, files = [], audioUrl = null) => {
		const messageHtml = CreateMessage(content, isUser, files, audioUrl);
		const messageElement = $(`<div class="d-flex ${isUser ? "justify-content-end" : "justify-content-start"}">${messageHtml}</div>`);
		$(Selectors.ChatWindow).append(messageElement);
		$(Selectors.ChatWindow).scrollTop($(Selectors.ChatWindow)[0].scrollHeight);

		if (audioUrl) {
			const audioContainer = messageElement.find(".audio-container");
			const audioElement = $(`<audio controls autoplay class="w-100">`).attr("src", audioUrl);
			audioContainer.append(audioElement);
			//audioElement.createAudioController({ appendTo: audioContainer, autoplay: true });
		}
	};

	const SendMessage = async () => {
		const message = $(Selectors.ChatInput).val();
		if (message.trim() === "") {
			CommonApp.ShowToast("Digite uma mensagem para enviar.");
			return;
		}

		const files = attachedFiles;
		AddMessageToChat(message, true, files);
		$(Selectors.ChatInput).val("");
		$(Selectors.FileInput).val("");
		$(Selectors.FilePreview).html("");
		attachedFiles = [];
		await SendChatMessage(message, files);
	};

	const StartRecording = () => {
		$(Selectors.SendMessageButton).prop("disabled", true);
		CommonApp.StartRecording(
			(recorder) => {
				mediaRecorder = recorder;
				$(Selectors.StartRecordingButton).hide();
				$(Selectors.StopRecordingButton).show();
			},
			(transcription) => {
				AddMessageToChat(transcription, true);
				SendChatMessage(transcription);
				$(Selectors.StartRecordingButton).show();
				$(Selectors.StopRecordingButton).hide();
				$(Selectors.SendMessageButton).prop("disabled", false);
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

	const PreviewFiles = () => {
		Array.from($(Selectors.FileInput)[0].files).forEach((file) => {
			attachedFiles.push(file);
		});
		$(Selectors.FilePreview).html("");
		attachedFiles.forEach((file, index) => {
			const fileCard = CreateFileCard(file, true, true); // showRemove = true
			$(Selectors.FilePreview).append(`
                <div class="card mb-2">
                    <div class="card-body">
                        ${fileCard}
                    </div>
                </div>
            `);
		});
	};

	const SendChatMessage = async (message, files = []) => {
		const formData = new FormData();
		formData.append("message", message);
		if (chatId != null) {
			formData.append("chat_id", chatId);
		}

		files.forEach((file) => {
			formData.append("files", file);
		});

		const response = await fetch("/openai/chat", {
			method: "POST",
			body: formData,
		});

		if (response.ok) {
			const data = await response.json();
			chatId = data.chat_id;

			AddMessageToChat("Chat está processando sua mensagem...", false);

			const audio = await CommonApp.TextToSpeech(data.response, false);
			if (audio) {
				$(Selectors.ChatWindow).children().last().remove();
				AddMessageToChat(data.response, false, [], audio.src);
			} else {
				$(Selectors.ChatWindow).children().last().remove();
				AddMessageToChat(data.response, false);
			}
		} else {
			CommonApp.ShowToast("Falha ao obter resposta do chat.");
		}
	};

	Init();
	return {};
})();
