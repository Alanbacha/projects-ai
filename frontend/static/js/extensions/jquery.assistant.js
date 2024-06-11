(function ($) {
	// Definindo um novo plugin jQuery chamado createAssistant
	$.fn.createAssistant = function (options) {
		// Definindo configurações padrão e mesclando com as opções fornecidas
		const settings = $.extend({
			assistant: null
		}, options);

		// Obtendo o assistente das configurações
		const assistant = settings.assistant;

		// Definindo classes CSS usadas no plugin
		const Classes = {
			ContentForm: "assistant-content-form",
			ContentChat: "assistant-content-chat",
			FrmAssistant: "assistant-form",
			RngTemperature: "assistant-rng-temperature",
			TemperatureValue: "assistant-temperature-value",
			RngTopP: "assistant-rng-top-p",
			TopPValue: "assistant-top-p-value",
			TxtaInstructions: "assistant-txta-instructions",
			BtnDelete: "assistant-btn-delete",
			Chat: "assistant-chat"
		};

		// Iterando sobre cada elemento jQuery selecionado
		return this.each(function () {
			const jqThis = $(this); // Armazenando a referência ao elemento jQuery atual

			// Função de inicialização
			const Init = () => {
				LoadHtml();   // Carregar o HTML necessário
				LoadEvents(); // Adicionar eventos necessários
			};

			// Função para adicionar eventos
			const LoadEvents = () => {
				jqThis
					.on("submit", `.${Classes.FrmAssistant}`, function (e) { e.preventDefault(); UpdateAssistant(); }) // Evento de envio do formulário
					.on("click", `.${Classes.BtnDelete}`, () => DeleteAssistant()) // Evento de clique no botão de exclusão do assistente
					.on("input", `.${Classes.RngTemperature}`, function () { jqThis.find(`.${Classes.TemperatureValue}`).text(parseFloat($(this).val()).toFixed(2)); }) // Evento de entrada no controle deslizante de temperatura
					.on("input", `.${Classes.RngTopP}`, function () { jqThis.find(`.${Classes.TopPValue}`).text(parseFloat($(this).val()).toFixed(2)); }); // Evento de entrada no controle deslizante de Top P
			};

			// Função para carregar o HTML
			const LoadHtml = () => {
				const html = `
					<h2 class="accordion-header">
						<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#assistantCollapse-${assistant.id}" aria-expanded="true" aria-controls="assistantCollapse-${assistant.id}">
							${assistant.name}
						</button>
					</h2>
					<div class="accordion-collapse collapse" id="assistantCollapse-${assistant.id}">
						<div class="accordion-body bg-body-tertiary p-2">
							<div class="list-group list-group-horizontal" role="tablist">
							<a class="list-group-item list-group-item-action active" id="assistant-chat-${assistant.id}" data-bs-toggle="list" href="#assistant-chat-content${assistant.id}" role="tab" aria-controls="assistant-chat-content${assistant.id}"><i class="bi bi-chat"></i> Chat</a>
								<a class="list-group-item list-group-item-action" id="assistant-crud-${assistant.id}" data-bs-toggle="list" href="#assistant-crud-content-${assistant.id}" role="tab" aria-controls="assistant-crud-content-${assistant.id}"><i class="bi bi-person"></i> Assistente</a>
							</div>
							<div class="tab-content border mt-2">
								<div class="tab-pane fade show active" id="assistant-chat-content${assistant.id}" role="tabpanel" aria-labelledby="assistant-chat-${assistant.id}">
									<div class="p-2 ${Classes.ContentChat}"></div>
								</div>
								<div class="tab-pane fade" id="assistant-crud-content-${assistant.id}" role="tabpanel" aria-labelledby="assistant-crud-${assistant.id}">
									<div class="p-2 ${Classes.ContentForm}">
										${GetFormContent()}
									</div>	
								</div>
							</div>
						</div>
					</div>
				`;

				jqThis.append(html); // Adicionando o HTML ao elemento jQuery atual
				LoadChat(); // Carregando o chat do assistente
			};

			// Função para obter o conteúdo do formulário
			const GetFormContent = () => {
				// Criando opções HTML com base nos modelos de assistentes disponíveis
				const optionsHtml = CommonApp.AssistantsListModels.map(model =>
					`<option value="${model.value}" ${assistant.model === model.value ? "selected" : ""}>${model.text}</option>`
				).join("");

				// Retornando o HTML do formulário
				return `
					<form class="${Classes.FrmAssistant}">
						<div class="d-flex justify-content-between gap-2 mb-2">
							<div class="w-50">
								<label for="name-${assistant.id}" class="form-label">Nome do Assistente</label>
								<input id="name-${assistant.id}" type="text" class="form-control" name="name" value="${assistant.name}" required>
							</div>
							<div class="w-50">
								<label for="model-${assistant.id}" class="form-label">Modelo</label>
								<select id="model-${assistant.id}" class="form-select" name="model" required>
									${optionsHtml}
								</select>
							</div>
						</div>
						<div class="d-flex justify-content-between gap-2 mb-2">
							<div class="w-50">
								<div class="form-check form-switch">
									<input class="form-check-input" type="checkbox" role="switch" id="file_search-${assistant.id}" name="file_search" ${assistant.tool_resources.hasOwnProperty("file_search") ? "checked" : ""}>
									<label class="form-check-label" for="file_search-${assistant.id}">Pesquisa de Arquivos</label>
								</div>
							</div>
							<div class="w-50">
								<div class="form-check form-switch">
									<input class="form-check-input" type="checkbox" role="switch" id="code_interpreter-${assistant.id}" name="code_interpreter" ${assistant.tool_resources.hasOwnProperty("code_interpreter") ? "checked" : ""}>
									<label class="form-check-label" for="code_interpreter-${assistant.id}">Interpretador de código</label>
								</div>
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
			};

			// Função para carregar o chat do assistente
			const LoadChat = () => {
				const chatElement = $(`<div class="mt-2 p-2 ${Classes.Chat}"></div>`); // Criando o elemento do chat
				chatElement.createChat({ title: `Chat com seu assistente <b>${assistant.name}</b>`, urlChat: `/api/openai/assistants/${assistant.id}/thread` }); // Adicionando o plugin de chat ao elemento

				jqThis.find(`.${Classes.ContentChat}`).append(chatElement); // Adicionando o chat ao elemento de conteúdo do chat
			};

			// Função para atualizar o assistente
			const UpdateAssistant = () => {
				const formData = new FormData(jqThis.find(`.${Classes.FrmAssistant}`)[0]); // Obtendo os dados do formulário como FormData

				fetch(`/api/openai/assistants/${assistant.id}`, { method: "PUT", body: formData }) // Enviando os dados para atualizar o assistente
					.then(response => {
						if (response.ok) {
							response.json().then(data => {
								OpenAiAssistants.LoadAssistants(assistant.id); // Recarregando a lista de assistentes após a atualização
								CommonApp.ShowToast("Assistente atualizado com sucesso.", "success"); // Exibindo uma mensagem de sucesso
							});
						} else {
							CommonApp.ShowToast("Falha ao atualizar assistente.", "danger"); // Exibindo uma mensagem de falha
						}
					});
			};

			// Função para excluir o assistente
			const DeleteAssistant = () => {
				if (confirm("Tem certeza de que deseja excluir este assistente?")) { // Solicitando confirmação antes da exclusão
					fetch(`/api/openai/assistants/${assistant.id}`, { method: "DELETE" }) // Enviando a solicitação de exclusão
						.then(response => {
							if (response.ok) {
								OpenAiAssistants.LoadAssistants(); // Recarregando a lista de assistentes após a exclusão
								CommonApp.ShowToast("Assistente deletado com sucesso.", "success"); // Exibindo uma mensagem de sucesso
							} else {
								CommonApp.ShowToast("Falha ao deletar assistente.", "danger"); // Exibindo uma mensagem de falha
							}
						});
				}
			};

			Init(); // Inicializando o plugin ao criar o assistente
		});
	};
}(jQuery));
