(function ($) {
    $.fn.createAssistant = function (options) {
        const settings = $.extend({
            assistant: null
        }, options);

        const assistant = settings.assistant;

        const Classes = {
            FrmAssistant: "assistant-form",
            BtnDelete: "assistant-btn-delete",
            RngTemperature: "assistant-rng-temperature",
            TemperatureValue: "assistant-temperature-value",
            RngTopP: "assistant-rng-top-p",
            TopPValue: "assistant-top-p-value",
            TxtaInstructions: "assistant-txta-instructions",
            Content: "assistant-content",
            Collapse: "assistant-collapse",
            Chat: "assistant-chat"
        };

        return this.each(function () {
            const jqThis = $(this);

            const Init = () => {
                LoadHtml();
                LoadEvents();
            };

            const LoadEvents = () => {
                jqThis
                    .on("submit", `.${Classes.FrmAssistant}`, function (event) {
                        event.preventDefault();
                        UpdateAssistant();
                    })
                    .on("click", `.${Classes.BtnDelete}`, function () {
                        DeleteAssistant();
                    })
                    .on("input", `.${Classes.RngTemperature}`, function () {
                        jqThis.find(`.${Classes.TemperatureValue}`).text(parseFloat($(this).val()).toFixed(2));
                    })
                    .on("input", `.${Classes.RngTopP}`, function () {
                        jqThis.find(`.${Classes.TopPValue}`).text(parseFloat($(this).val()).toFixed(2));
                    });
            };

            const LoadHtml = () => {
                const html = `
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#assistantCollapse-${assistant.id}" aria-expanded="true" aria-controls="assistantCollapse-${assistant.id}">
                            ${assistant.name}
                        </button>
                    </h2>
                    <div class="accordion-collapse collapse ${Classes.Collapse}" id="assistantCollapse-${assistant.id}">
                        <div class="accordion-body">
                            <div class="p-2 ${Classes.Content}"></div>
                        </div>
                    </div>
                `;

                jqThis.append(html);

                LoadForm();
                LoadChat();
            };

            const LoadForm = () => {
                const html = `
                    <form class="${Classes.FrmAssistant}">
                        <div class="d-flex justify-content-between gap-2 mb-2">
                            <div class="w-50">
                                <label for="name-${assistant.id}" class="form-label">Nome do Assistente</label>
                                <input id="name-${assistant.id}" type="text" class="form-control" name="name" value="${assistant.name}" required>
                            </div>
                            <div class="w-50">
                                <label for="model-${assistant.id}" class="form-label">Modelo</label>
                                <select id="model-${assistant.id}" class="form-select" name="model" required>
                                    <option value="gpt-4" ${assistant.model === "gpt-4" ? "selected" : ""}>GPT-4</option>
                                    <option value="gpt-4-turbo" ${assistant.model === "gpt-4-turbo" ? "selected" : ""}>GPT-4 Turbo</option>
                                    <option value="gpt-3.5-turbo" ${assistant.model === "gpt-3.5-turbo" ? "selected" : ""}>GPT-3.5 Turbo</option>
                                </select>
                            </div>
                        </div>
                        <div class="d-flex justify-content-between gap-2 mb-2">
                            <div class="w-50">
                                <div class="d-flex justify-content-between align-items-center">
                                    <label for="temperature-${assistant.id}" class="form-label flex-grow-1">Temperatura</label>
                                    <span class="badge text-bg-secondary ${Classes.TemperatureValue}">${assistant.temperature.toFixed(2)}</span>
                                </div>
                                <input type="range" id="temperature-${assistant.id}" class="form-range ${Classes.RngTemperature}" min="0" max="2" step="0.01" name="temperature" value="${assistant.temperature}">
                            </div>
                            <div class="w-50">
                                <div class="d-flex justify-content-between align-items-center">
                                    <label for="top_p-${assistant.id}" class="form-label flex-grow-1">Top P</label>
                                    <span class="badge text-bg-secondary ${Classes.TopPValue}">${assistant.top_p.toFixed(2)}</span>
                                </div>
                                <input type="range" id="top_p-${assistant.id}" class="form-range ${Classes.RngTopP}" min="0" max="1" step="0.01" name="top_p" value="${assistant.top_p}">
                            </div>
                        </div>
                        <div class="mb-2">
                            <label for="instructions-${assistant.id}" class="form-label">Instruções</label>
                            <textarea id="instructions-${assistant.id}" class="form-control ${Classes.TxtaInstructions}" name="instructions" rows="8" required>${assistant.instructions}</textarea>
                        </div>
                        <div class="d-flex justify-content-between">
                            <button type="button" class="btn btn-danger ${Classes.BtnDelete}"><i class="bi bi-trash"></i> Excluir</button>
                            <button type="submit" class="btn btn-success"><i class="bi bi-floppy"></i> Salvar</button>
                        </div>
                    </form>
                `;

                jqThis.find(`.${Classes.Content}`).append(html);
            };

            const LoadChat = () => {
                const chatElement = $(`<div class="mt-2 p-2 ${Classes.Chat}"></div>`);
                chatElement.createChat({ appendTo: chatElement });
                jqThis.find(`.${Classes.Content}`).append(chatElement);
            };

            const UpdateAssistant = () => {
                const formData = new FormData(jqThis.find(`.${Classes.FrmAssistant}`)[0]);

                fetch(`/openai/assistants/${assistant.id}`, { method: "PUT", body: formData })
                    .then(response => {
                        if (response.ok) {
                            response.json().then(data => {
                                jqThis.find(`.${Classes.Collapse}`).collapse('hide');
                                AssistantsApp.LoadAssistants();
                                CommonApp.ShowToast("Assistente atualizado com sucesso.", "success");
                            });
                        } else {
                            CommonApp.ShowToast("Falha ao atualizar assistente.", "danger");
                        }
                    });
            };

            const DeleteAssistant = () => {
                if (confirm("Tem certeza de que deseja excluir este assistente?")) {
                    fetch(`/openai/assistants/${assistant.id}`, { method: "DELETE" })
                        .then(response => {
                            if (response.ok) {
                                AssistantsApp.LoadAssistants();
                                CommonApp.ShowToast("Assistente deletado com sucesso.", "success");
                            } else {
                                CommonApp.ShowToast("Falha ao deletar assistente.", "danger");
                            }
                        });
                }
            };

            Init();
        });
    };
}(jQuery));
