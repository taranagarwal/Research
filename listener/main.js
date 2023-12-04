document.addEventListener('DOMContentLoaded', () => {
  endpoint = "https://speech.googleapis.com";
  const startButton = document.getElementById('startBtn');
  const stopButton = document.getElementById('stopBtn');
  const audioElement = document.getElementById('audio');
  const transcriptsElement = document.getElementById('transcripts');

  let audioRecorder = null;
  let audioChunks = [];
  let recordingCounter = 0;

  const handleStream = (stream) => {
    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm';
    audioRecorder = new MediaRecorder(stream, { mimeType });

    audioRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    audioRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { 'type': mimeType });
      const audioUrl = URL.createObjectURL(audioBlob);
      audioElement.src = audioUrl;

      recordingCounter++;
      const downloadLink = document.createElement('a');
      downloadLink.href = audioUrl;
      downloadLink.download = `recorded_audio_${recordingCounter}.webm`;
      downloadLink.innerText = `Download Recorded Audio ${recordingCounter}`;
      downloadLink.classList.add('download-link');

      const transcriptItem = document.createElement('div');
      transcriptItem.classList.add('transcript-item');
      transcriptItem.appendChild(downloadLink);
      transcriptsElement.appendChild(transcriptItem);

      audioElement.controls = true;
      audioChunks = [];

      const formData = new FormData();
      formData.append('audio', audioBlob, downloadLink.download);
      try {
        const response = await fetch('URL_TO_YOUR_BACKEND_ENDPOINT', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        const wordsPerSecondText = document.createElement('span');
        wordsPerSecondText.textContent = ` - Words per second: ${data.wordsPerSecond.toFixed(2)}`;
        transcriptItem.appendChild(wordsPerSecondText);
      } catch (error) {
        console.error('Error processing audio:', error);
      }
    };

    audioRecorder.start();
  };

  const handleError = (error) => {
    console.error("Error accessing the microphone:", error);
    alert("Error accessing the microphone. Please check the console for more details.");
  };

  startButton.onclick = () => {
    startButton.disabled = true;
    stopButton.disabled = false;
    audioElement.controls = false;
    navigator.mediaDevices.getUserMedia({ audio: true }).then(handleStream).catch(handleError);
  };

  stopButton.onclick = () => {
    if (audioRecorder) {
      audioRecorder.stop();
      startButton.disabled = false;
      stopButton.disabled = true;
    }
  };
});
