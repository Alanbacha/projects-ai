(function ($) {
    $.fn.createChat = function (options) {
        const settings = $.extend({
            minHeight: '200px',
            maxHeight: '400px',
            urlChat: '/openai/chat',
            title: 'Chat OpenAI'
        }, options);

        const Classes = {
            TxtaChatMessage: "chat-txta-chat-message",
            ContentMessages: "chat-content-messages",
            BtnStartRecording: "chat-btn-start-recording",
            BtnStopRecording: "chat-btn-stop-recording",
            BtnSendMessage: "chat-btn-send-message",
            FileInput: "chat-file-input",
            LblFileInput: "chat-file-input-label",
            FilePreview: "chat-file-preview",
            BtnRemoveFile: "chat-btn-remove-file"
        };

        return this.each(function () {
            const jqThis = $(this);

            let chatId = null;
            let threadId = null;
            let mediaRecorder;
            let attachedFiles = [];

            const Init = () => {
                LoadHtml();
                LoadEvents();
            };

            const LoadHtml = () => {
                jqThis.html(`
                    ${settings.title.length ? `<h3 class="card-title"><i class="bi bi-chat"></i> ${settings.title}</h3>` : ''}
                    <div class="d-flex flex-column gap-2 p-2 bg-white rounded overflow-y-auto ${Classes.ContentMessages}" style="min-height: ${settings.minHeight}; max-height: ${settings.maxHeight}"></div>
                    <textarea class="form-control mt-2 ${Classes.TxtaChatMessage}" placeholder="Digite sua mensagem..." rows="3"></textarea>
                    <div class="mt-2">
                        <div class="d-flex justify-content-between align-items-center">
                            <label class="btn btn-secondary ${Classes.LblFileInput}"><i class="bi bi-paperclip"></i> Adicionar Arquivos</label>
                            <input type="file" class="d-none ${Classes.FileInput}" multiple />
                            <div>
                                <button class="btn btn-success ms-2 ${Classes.BtnStartRecording}"><i class="bi bi-mic-fill"></i> Iniciar Gravação</button>
                                <button class="btn btn-danger ms-2 ${Classes.BtnStopRecording}" style="display: none"><i class="bi bi-stop-fill"></i> Parar Gravação</button>
                                <button class="btn btn-primary ms-2 ${Classes.BtnSendMessage}"><i class="bi bi-send"></i> Enviar Mensagem</button>
                            </div>
                        </div>
                        <div class="d-flex gap-2 flex-wrap mt-2 ${Classes.FilePreview}"></div>
                    </div>
                `);
            };

            const LoadEvents = () => {
                jqThis
                    .on("click", `.${Classes.BtnSendMessage}`, SendMessage)
                    .on("click", `.${Classes.BtnStartRecording}`, StartRecording)
                    .on("click", `.${Classes.BtnStopRecording}`, StopRecording)
                    .on("change", `.${Classes.FileInput}`, PreviewFiles)
                    .on("click", `.${Classes.LblFileInput}`, () => jqThis.find(`.${Classes.FileInput}`).click())
                    .on("click", `.${Classes.BtnRemoveFile}`, function () { const index = $(this).data("index"); RemoveFile(index); })
                    ;
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

                jqThis.find(`.${Classes.ContentMessages}`).append(messageElement);
                jqThis.find(`.${Classes.ContentMessages}`).scrollTop(jqThis.find(`.${Classes.ContentMessages}`)[0].scrollHeight);

                if (audioUrl) {
                    const audioContainer = messageElement.find(".audio-container");
                    const audioElement = $(`<audio controls autoplay class="w-100">`).attr("src", audioUrl);
                    audioContainer.append(audioElement);
                }
            };

            const SendMessage = async () => {
                const message = jqThis.find(`.${Classes.TxtaChatMessage}`).val();

                if (message.trim() === "") {
                    CommonApp.ShowToast("Digite uma mensagem para enviar.");
                    return;
                }

                const files = attachedFiles;
                AddMessageToChat(message, true, files);

                jqThis.find(`.${Classes.TxtaChatMessage}`).val("");
                jqThis.find(`.${Classes.FileInput}`).val("");
                jqThis.find(`.${Classes.FilePreview}`).html("");

                attachedFiles = [];

                await SendChatMessage(message, files);
            };

            const StartRecording = () => {
                jqThis.find(`.${Classes.BtnSendMessage}`).prop("disabled", true);

                CommonApp.StartRecording(
                    (recorder) => {
                        mediaRecorder = recorder;
                        jqThis.find(`.${Classes.BtnStartRecording}`).hide();
                        jqThis.find(`.${Classes.BtnStopRecording}`).show();
                    },
                    (transcription) => {
                        jqThis.find(`.${Classes.TxtaChatMessage}`).val(transcription);
                        SendMessage();
                        jqThis.find(`.${Classes.BtnStartRecording}`).show();
                        jqThis.find(`.${Classes.BtnStopRecording}`).hide();
                        jqThis.find(`.${Classes.BtnSendMessage}`).prop("disabled", false);
                    }
                );
            };

            const StopRecording = () => {
                if (mediaRecorder && mediaRecorder.state !== "inactive") {
                    mediaRecorder.stop();
                    jqThis.find(`.${Classes.BtnStartRecording}`).show();
                    jqThis.find(`.${Classes.BtnStopRecording}`).hide();
                }
            };

            const PreviewFiles = () => {
                attachedFiles = Array.from(jqThis.find(`.${Classes.FileInput}`)[0].files);

                jqThis.find(`.${Classes.FilePreview}`).html("");

                attachedFiles.forEach((file, index) => {
                    const fileCard = CreateFileCard(file, index, true);

                    jqThis.find(`.${Classes.FilePreview}`).append(`
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
                const removeButton = showRemove ? `<button class="btn btn-sm btn-danger ${Classes.BtnRemoveFile}" data-index="${index}"><i class="bi bi-trash"></i></button>` : "";

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
                jqThis.find(`.${Classes.FileInput}`)[0].files = dataTransfer.files;

                // Atualizar a visualização dos arquivos
                PreviewFiles();
            };

            const SendChatMessage = async (message, files = []) => {
                const formData = new FormData();
                formData.append("message", message);

                if (chatId != null) {
                    formData.append("chat_id", chatId);
                }

                if (threadId != null) {
                    formData.append("thread_id", threadId);
                }

                files.forEach((file) => formData.append("files", file));

                const response = await fetch(settings.urlChat, { method: "POST", body: formData, });

                if (response.ok) {
                    const data = await response.json();
                    chatId = data.chat_id;
                    threadId = data.thread_id;

                    AddMessageToChat("Chat está processando sua mensagem...", false);

                    const audio = await CommonApp.TextToSpeech(data.response, false);
                    if (audio) {
                        jqThis.find(`.${Classes.ContentMessages}`).children().last().remove();
                        AddMessageToChat(data.response, false, [], audio.src);
                    } else {
                        jqThis.find(`.${Classes.ContentMessages}`).children().last().remove();
                        AddMessageToChat(data.response, false);
                    }
                } else {
                    CommonApp.ShowToast("Falha ao obter resposta do chat.");
                }
            };

            Init();
        });
    };
}(jQuery));