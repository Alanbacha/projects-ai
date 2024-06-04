const AssistantsApp = (() => {
	const Selectors = {
		CreateAssistantButton: "#createAssistantButton", // Seletor do botão para criar assistente
		CreateAssistantForm: "#createAssistantForm", // Seletor do formulário para criar assistente
		AssistantsList: "#assistantsList", // Seletor da lista de assistentes
		ParentSelector: "#assistantsApp", // Seletor do elemento pai da aplicação de assistentes
		AssistantModal: "#assistantModal", // Seletor do modal para criar/editar assistente
		AssistantModel: "#assistantModel", // Seletor do campo de seleção de modelo de assistente
		AssistantTemperature: "#assistantTemperature", // Seletor do campo de temperatura do assistente
		TemperatureValue: "#temperatureValue", // Seletor para exibir o valor da temperatura
		AssistantTopP: "#assistantTopP", // Seletor do campo de Top P do assistente
		TopPValue: "#topPValue", // Seletor para exibir o valor do Top P
		AssistantAccordionItem: ".assistant-accordion-item" // Seletor do accordion-item do assistente
	};

	// Função de inicialização da aplicação
	const Init = () => {
		$(function () {
			LoadEvents(); // Carregando os eventos
			LoadAssistants(); // Carregando os assistentes
			ModalUpdateModels(); // Atualizando os modelos no modal
		});
	};

	// Carrega os eventos da aplicação
	const LoadEvents = () => {
		$(Selectors.ParentSelector)
			.on("click", Selectors.CreateAssistantButton, ShowCreateAssistantForm); // Evento para mostrar o formulário de criação de assistente

		$(Selectors.AssistantModal)
			.on("submit", Selectors.CreateAssistantForm, function (event) {
				event.preventDefault();
				CreateAssistant();
			}) // Evento de submissão do formulário de criação de assistente
			.on("input", Selectors.AssistantTemperature, function () {
				$(Selectors.TemperatureValue).text(parseFloat($(this).val()).toFixed(2)); // Atualiza o valor da temperatura exibido
			}) // Evento de alteração do campo de temperatura
			.on("input", Selectors.AssistantTopP, function () {
				$(Selectors.TopPValue).text(parseFloat($(this).val()).toFixed(2)); // Atualiza o valor do Top P exibido
			}); // Evento de alteração do campo de Top P
	};

	// Carrega os assistentes da API
	const LoadAssistants = async (assistantId = 0) => {
		const response = await fetch("/openai/assistants"); // Requisição para obter os assistentes
		if (response.ok) {
			const assistants = await response.json(); // Obtém os assistentes da resposta
			DisplayAssistants(assistants); // Exibe os assistentes na interface
			OpenAssistant(assistantId); // Abre o assistente passado como parametro
		} else {
			CommonApp.ShowToast("Falha ao carregar assistentes.", "danger"); // Exibe um toast em caso de falha na requisição
		}
	};

	// Exibe os assistentes na lista
	const DisplayAssistants = (assistants) => {
		const list = $(Selectors.AssistantsList); // Seleciona a lista de assistentes
		list.html(""); // Limpa o conteúdo atual da lista

		assistants.forEach(assistant => {
			const assistantElement = $(`<div class="accordion-item assistant-accordion-item" data-assistant-id="${assistant.id}"></div>`); // Cria um elemento para o assistente
			assistantElement.createAssistant({ assistant }); // Chama a função para criar o assistente
			list.append(assistantElement); // Adiciona o assistente à lista
		});
	};

	// Abre o assistente passado como parametro
	const OpenAssistant = (assistantId = 0) => {
		const list = $(Selectors.AssistantsList); // Seleciona a lista de assistentes
		const listAccordionItem = list.find(`${Selectors.AssistantAccordionItem}`);

		if (listAccordionItem.length > 0) {
			if (assistantId == 0) {
				assistantId = listAccordionItem.first().data("assistant-id"); // Obtém o primeiro id de assistente da lista
			}

			listAccordionItem.filter(`[data-assistant-id="${assistantId}"]`).find('.accordion-button').click(); // Invoca o evento de click do botão para abrir o accordion
		}
	};

	// Mostra o formulário de criação de assistente
	const ShowCreateAssistantForm = () => {
		$(Selectors.CreateAssistantForm).trigger("reset"); // Limpa o formulário
		$(Selectors.AssistantModal).modal("show"); // Mostra o modal
	};

	// Atualiza os modelos disponíveis no modal
	const ModalUpdateModels = () => {
		const optionsHtml = CommonApp.AssistantsListModels.map(model =>
			`<option value="${model.value}">${model.text}</option>` // Gera as opções de seleção com base nos modelos disponíveis
		).join("");

		$(Selectors.AssistantModel).html(optionsHtml); // Atualiza o HTML do campo de seleção de modelo
	};

	// Cria um novo assistente
	const CreateAssistant = () => {
		const formData = new FormData($(Selectors.CreateAssistantForm)[0]); // Obtém os dados do formulário

		fetch("/openai/assistants", { method: "POST", body: formData }) // Envia uma requisição para criar o assistente
			.then(response => {
				if (response.ok) {
					LoadAssistants(); // Recarrega a lista de assistentes
					CommonApp.ShowToast("Assistente criado com sucesso.", "success"); // Exibe um toast de sucesso
					$(Selectors.AssistantModal).modal("hide"); // Esconde o modal de criação de assistente
				} else {
					CommonApp.ShowToast("Falha ao criar assistente.", "danger"); // Exibe um toast em caso de falha
				}
			});
	};

	Init(); // Inicializa a aplicação

	return { LoadAssistants }; // Retorna o método para carregar os assistentes
})();
