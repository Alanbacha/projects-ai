document.addEventListener("DOMContentLoaded", () => {
	const sendMessageButton = document.getElementById("sendMessage");
	const chatInput = document.getElementById("chatInput");
	const chatWindow = document.getElementById("chatWindow");
	const startRecordingButton = document.getElementById("startRecording");
	const stopRecordingButton = document.getElementById("stopRecording");
	let chatId = null;
	let mediaRecorder;

	function addMessageToChat(content, isUser = true) {
		const messageDiv = document.createElement("div");
		messageDiv.className = isUser ? "text-end" : "text-start";
		messageDiv.innerHTML = `
            <div class="card ${isUser ? "bg-primary text-white" : "bg-light text-dark"} mb-2">
                <div class="card-body">
                    ${content}
                </div>
            </div>
        `;
		chatWindow.appendChild(messageDiv);
		chatWindow.scrollTop = chatWindow.scrollHeight;
	}

	async function sendChatMessage(message) {
		const response = await fetch("/openai/chat", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ chat_id: chatId, message }),
		});

		if (response.ok) {
			const data = await response.json();
			chatId = data.chat_id;

			// Adicionar mensagem de "processando"
			addMessageToChat("Chat está processando sua mensagem...", false);

			// Converter resposta para fala
			const audio = await textToSpeech(data.response);
			if (audio) {
				// Remover mensagem de "processando" e adicionar a resposta ao chat
				chatWindow.removeChild(chatWindow.lastChild);
				addMessageToChat(data.response, false);
				// Quando o áudio terminar, destacar a resposta no chat
				audio.onended = () => {
					chatWindow.lastChild.classList.add("highlight");
				};
			} else {
				// Remover mensagem de "processando" se houver falha no TTS
				chatWindow.removeChild(chatWindow.lastChild);
				addMessageToChat(data.response, false);
			}
		} else {
			showToast("Falha ao obter resposta do chat.");
		}
	}

	sendMessageButton.addEventListener("click", () => {
		const message = chatInput.value;
		if (message.trim() === "") {
			showToast("Digite uma mensagem para enviar.");
			return;
		}

		addMessageToChat(message, true);
		chatInput.value = "";
		sendChatMessage(message);
	});

	startRecordingButton.addEventListener("click", () => {
		startRecording(
			(recorder) => {
				mediaRecorder = recorder;
				startRecordingButton.style.display = "none";
				stopRecordingButton.style.display = "inline-block";
			},
			(transcription) => {
				addMessageToChat(transcription, true);
				sendChatMessage(transcription);
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
