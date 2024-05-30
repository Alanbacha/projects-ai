const ChatApp = (() => {
	const Selectors = {
		SendMessageButton: "#sendMessage",
		ChatInput: "#chatInput",
		ChatWindow: "#chatWindow",
		StartRecordingButton: "#startRecording",
		StopRecordingButton: "#stopRecording",
		FileInput: "#fileInput",
		FilePreview: "#filePreview",
		RemoveFile: ".remove-file",
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
		$(Selectors.ParentSelector)
			.on("click", Selectors.SendMessageButton, SendMessage)
			.on("click", Selectors.StartRecordingButton, StartRecording)
			.on("click", Selectors.StopRecordingButton, StopRecording)
			.on("change", Selectors.FileInput, PreviewFiles)
			.on("click", Selectors.RemoveFile, function () {
				const index = $(this).data("index");
				RemoveFile(index);
			});
	};

	const CreateMessage = (content, isUser = true, files = [], audioUrl = null) => {
		const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
		const filesHtml = files.map((file, index) => CreateFileCard(file, index, false)).join("");
		const audioPlayerHtml = audioUrl ? `<div class="audio-container" id="audio-${Date.now()}"></div>` : "";

		return `
            <div class="card ${isUser ? "text-bg-primary align-self-end" : "text-bg-secondary align-self-start"}" style="min-width: 40%; max-width: 80%;">
                <div class="card-body d-flex flex-column gap-2">
                    <p class="card-text">${content}</p>
                    ${filesHtml}
                    ${audioPlayerHtml}
                    <div class="text-end text-white-50 small">${time}</div>
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
				$(Selectors.ChatInput).val(transcription);
				SendMessage();
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
		attachedFiles = Array.from($(Selectors.FileInput)[0].files);

		$(Selectors.FilePreview).html("");

		attachedFiles.forEach((file, index) => {
			const fileCard = CreateFileCard(file, index, true);

			$(Selectors.FilePreview).append(`
                <div class="card flex-grow-1">
                    <div class="card-body d-flex">
                        ${fileCard}
                    </div>
                </div>
            `);
		});
	};

	const CreateFileCard = (file, index, showRemove) => {
		const fileType = file.type.split("/")[0];
		const fileIcon = fileType === "image" ? `<img src="${URL.createObjectURL(file)}" class="object-fit-cover rounded w-100 h-100">` : `<i class="bi bi-file-earmark-text" style="font-size: 2em;"></i>`;
		const downloadButton = !showRemove ? `<a href="${URL.createObjectURL(file)}" download="${file.name}" class="btn btn-sm btn-primary"><i class="bi bi-download"></i></a>` : "";
		const removeButton = showRemove ? `<button class="btn btn-sm btn-danger remove-file" data-index="${index}"><i class="bi bi-trash"></i></button>` : "";

		return `
            <div class="d-flex gap-2 align-items-center align-content-between flex-grow-1 p-2 rounded text-bg-dark">
                <div class="border rounded d-flex align-items-center justify-content-center p-1" style="width: 50px; height: 50px;">
                    ${fileIcon}
                </div>
                <div class="flex-grow-1">
                    <div>${file.name}</div>
                    <div class="small">${(file.size / 1024).toFixed(1)} KB</div>
                </div>
                <div class="d-flex gap-2 p-2">
                    ${downloadButton}
                    ${removeButton}
                </div>
            </div>
        `;
	};

	const RemoveFile = (index) => {
		// Remover do attachedFiles
		attachedFiles.splice(index, 1);

		// Criar um novo DataTransfer para atualizar o input file
		const dataTransfer = new DataTransfer();
		attachedFiles.forEach(file => dataTransfer.items.add(file));
		$(Selectors.FileInput)[0].files = dataTransfer.files;

		// Atualizar a visualização dos arquivos
		PreviewFiles();
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
