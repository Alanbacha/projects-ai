(function ($) {
    $.fn.createWhisper = function () {
        const Classes = {
            BtnStartRecording: "whisper-btn-start-recording",
            BtnStopRecording: "whisper-btn-stop-recording",
            TranscriptionCard: "whisper-transcription-card",
            TranscriptionOutput: "whisper-transcription-output"
        };

        let mediaRecorder;

        return this.each(function () {
            const jqThis = $(this);

            const Init = () => {
                LoadHtml();
                LoadEvents();
            };

            const LoadHtml = () => {
                jqThis.html(`
                    <h5 class="card-title">Serviço de Transcrição (Whisper)</h5>
                    <button class="btn btn-success ${Classes.BtnStartRecording}"><i class="bi bi-mic-fill"></i> Iniciar Gravação</button>
                    <button class="btn btn-danger ${Classes.BtnStopRecording}" style="display: none"><i class="bi bi-stop-fill"></i> Parar Gravação</button>
                    <div class="card mt-2 ${Classes.TranscriptionCard}" style="display: none">
                        <div class="card-header bg-info text-dark">Transcrição</div>
                        <div class="card-body">
                            <p class="card-text text-light ${Classes.TranscriptionOutput}"></p>
                        </div>
                    </div>
                `);
            };

            const LoadEvents = () => {
                jqThis
                    .on("click", `.${Classes.BtnStartRecording}`, StartRecording)
                    .on("click", `.${Classes.BtnStopRecording}`, StopRecording);
            };

            const ShowTranscription = (transcription) => {
                jqThis.find(`.${Classes.TranscriptionOutput}`).html(transcription);
                jqThis.find(`.${Classes.TranscriptionCard}`).show();
            };

            const StartRecording = () => {
                jqThis.find(`.${Classes.convertToSpeechButton}`).prop("disabled", true);
                CommonApp.StartRecording(
                    (recorder) => {
                        mediaRecorder = recorder;
                        jqThis.find(`.${Classes.BtnStartRecording}`).hide();
                        jqThis.find(`.${Classes.BtnStopRecording}`).show();
                        jqThis.find(`.${Classes.TranscriptionCard}`).hide();
                    },
                    (transcription) => {
                        ShowTranscription(transcription);
                        jqThis.find(`.${Classes.BtnStartRecording}`).show();
                        jqThis.find(`.${Classes.BtnStopRecording}`).hide();
                        jqThis.find(`.${Classes.convertToSpeechButton}`).prop("disabled", false);
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

            Init();
        });
    };
}(jQuery));
