(function ($) {
    $.fn.createTTS = function () {
        const Selectors = {
            convertToSpeechButton: ".convert-to-speech",
            audioContainer: ".audio-container",
            textToConvert: ".text-to-convert"
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
                    <textarea class="text-to-convert form-control mb-2" placeholder="Digite o texto aqui..."></textarea>
                    <div class="d-flex mb-2 gap-2 justify-content-center align-items-center">
                        <button class="convert-to-speech btn btn-primary"><i class="bi bi-volume-up"></i> Converter para Fala</button>
                        <div class="audio-container flex-grow-1"></div>
                    </div>
                `);
            };

            const LoadEvents = () => {
                jqThis
                    .on("click", Selectors.convertToSpeechButton, ConvertToSpeech);
            };

            const ConvertToSpeech = async () => {
                const text = jqThis.find(Selectors.textToConvert).val();
                if (text.trim() === "") {
                    CommonApp.ShowToast("Digite um texto para converter.", "danger");
                    return;
                }

                const audio = await CommonApp.TextToSpeech(text, false);
                if (audio) {
                    const audioContainer = jqThis.find(Selectors.audioContainer);
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
