(function ($) {
    $.fn.createWhisper = function () {
        const Selectors = {
            startRecordingButton: ".start-recording",
            stopRecordingButton: ".stop-recording",
            transcriptionOutput: ".transcription-output",
            transcriptionCard: ".transcription-card"
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
                    <button class="start-recording btn btn-success"><i class="bi bi-mic-fill"></i> Iniciar Gravação</button>
                    <button class="stop-recording btn btn-danger" style="display: none"><i class="bi bi-stop-fill"></i> Parar Gravação</button>
                    <div class="transcription-card card mt-2" style="display: none">
                        <div class="card-header bg-info text-dark">Transcrição</div>
                        <div class="card-body">
                            <p class="transcription-output card-text text-light"></p>
                        </div>
                    </div>
                `);
            };

            const LoadEvents = () => {
                jqThis
                    .on("click", Selectors.startRecordingButton, StartRecording)
                    .on("click", Selectors.stopRecordingButton, StopRecording);
            };

            const ShowTranscription = (transcription) => {
                jqThis.find(Selectors.transcriptionOutput).html(transcription);
                jqThis.find(Selectors.transcriptionCard).show();
            };

            const StartRecording = () => {
                jqThis.find(Selectors.convertToSpeechButton).prop("disabled", true);
                CommonApp.StartRecording(
                    (recorder) => {
                        mediaRecorder = recorder;
                        jqThis.find(Selectors.startRecordingButton).hide();
                        jqThis.find(Selectors.stopRecordingButton).show();
                        jqThis.find(Selectors.transcriptionCard).hide();
                    },
                    (transcription) => {
                        ShowTranscription(transcription);
                        jqThis.find(Selectors.startRecordingButton).show();
                        jqThis.find(Selectors.stopRecordingButton).hide();
                        jqThis.find(Selectors.convertToSpeechButton).prop("disabled", false);
                    }
                );
            };

            const StopRecording = () => {
                if (mediaRecorder && mediaRecorder.state !== "inactive") {
                    mediaRecorder.stop();
                    jqThis.find(Selectors.startRecordingButton).show();
                    jqThis.find(Selectors.stopRecordingButton).hide();
                }
            };

            Init();
        });
    };
}(jQuery));
