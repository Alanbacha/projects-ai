(function ($) {
    $.fn.createTTS = function () {
        const Classes = {
            BtnConvertToSpeech: "tts-btn-convert-to-speech",
            AudioContainer: "tts-audio-container",
            TxtaToConvert: "tts-txta-to-convert"
        };

        return this.each(function () {
            const jqThis = $(this);

            const Init = () => {
                LoadHtml();
                LoadEvents();
            };

            const LoadHtml = () => {
                jqThis.html(`
                    <h5 class="card-title">Conversor de Texto para Fala (TTS)</h5>
                    <textarea class="form-control mb-2 ${Classes.TxtaToConvert}" placeholder="Digite o texto aqui..."></textarea>
                    <div class="d-flex mb-2 gap-2 justify-content-center align-items-center">
                        <button class="btn btn-primary ${Classes.BtnConvertToSpeech}"><i class="bi bi-volume-up"></i> Converter para Fala</button>
                        <div class="flex-grow-1 ${Classes.AudioContainer}"></div>
                    </div>
                `);
            };

            const LoadEvents = () => {
                jqThis
                    .on("click", `.${Classes.BtnConvertToSpeech}`, ConvertToSpeech);
            };

            const ConvertToSpeech = async () => {
                const text = jqThis.find(`.${Classes.TxtaToConvert}`).val();
                if (text.trim() === "") {
                    CommonApp.ShowToast("Digite um texto para converter.", "danger");
                    return;
                }

                const audio = await CommonApp.TextToSpeech(text, false);
                if (audio) {
                    const audioContainer = jqThis.find(`.${Classes.AudioContainer}`);
                    const audioElement = $(`<audio controls autoplay class="w-100">`).attr("src", audio.src);
                    audioContainer.html(audioElement);
                } else {
                    CommonApp.ShowToast("Falha ao converter texto para fala.", "danger");
                }
            };

            Init();
        });
    };
}(jQuery));
