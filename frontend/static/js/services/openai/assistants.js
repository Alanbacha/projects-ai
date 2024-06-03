const AssistantsApp = (() => {
    const Selectors = {
        CreateAssistantButton: "#createAssistantButton",
        CreateAssistantForm: "#createAssistantForm",
        AssistantsList: "#assistantsList",
        ParentSelector: "#assistantsApp",
        AssistantModal: "#assistantModal",
        AssistantTemperature: "#assistantTemperature",
        TemperatureValue: "#temperatureValue",
        AssistantTopP: "#assistantTopP",
        TopPValue: "#topPValue",
    };

    const Init = () => {
        $(function () {
            LoadEvents();
            LoadAssistants();
        });
    };

    const LoadEvents = () => {
        $(Selectors.ParentSelector)
            .on("click", Selectors.CreateAssistantButton, ShowCreateAssistantForm)

        $(Selectors.AssistantModal)
            .on("submit", Selectors.CreateAssistantForm, function (event) {
                event.preventDefault();
                CreateAssistant();
            })
            .on("input", Selectors.AssistantTemperature, function () {
                $(Selectors.TemperatureValue).text(parseFloat($(this).val()).toFixed('2'));
            })
            .on("input", Selectors.AssistantTopP, function () {
                $(Selectors.TopPValue).text(parseFloat($(this).val()).toFixed('2'));
            })
            ;
    };

    const LoadAssistants = async () => {
        const response = await fetch("/openai/assistants");
        if (response.ok) {
            const assistants = await response.json();
            DisplayAssistants(assistants);
        } else {
            CommonApp.ShowToast("Falha ao carregar assistentes.", "danger");
        }
    };

    const DisplayAssistants = (assistants) => {
        const list = $(Selectors.AssistantsList);
        list.html("");

        assistants.forEach(assistant => {
            const assistantElement = $(`<div class="accordion-item"></div>`);
            assistantElement.createAssistant({ assistant });
            list.append(assistantElement);
        });
    };

    const ShowCreateAssistantForm = () => {
        $(Selectors.CreateAssistantForm).trigger("reset");
        $(Selectors.AssistantModal).modal("show");
    };

    const CreateAssistant = () => {
        const formData = new FormData($(Selectors.CreateAssistantForm)[0]);

        fetch("/openai/assistants", { method: "POST", body: formData })
            .then(response => {
                if (response.ok) {
                    LoadAssistants();
                    CommonApp.ShowToast("Assistente criado com sucesso.", "success");
                    $(Selectors.AssistantModal).modal("hide");
                } else {
                    CommonApp.ShowToast("Falha ao criar assistente.", "danger");
                }
            });


    };

    Init();

    return { LoadAssistants };
})();
