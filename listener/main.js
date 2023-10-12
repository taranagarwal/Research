document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('startBtn');
  const stopButton = document.getElementById('stopBtn');
  const audioElement = document.getElementById('audio');

  let audioRecorder = null;
  let audioChunks = [];
  let recordingCounter = 0; // Initialize the recording counter

  // Function to handle the stream
  const handleStream = (stream) => {
    // Check for browser support to determine the MIME type
    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm';
    audioRecorder = new MediaRecorder(stream, { mimeType });

    audioRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    audioRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { 'type': mimeType }); // use the correct MIME type
      const audioUrl = URL.createObjectURL(audioBlob);
      audioElement.src = audioUrl;

      recordingCounter++; // Increment the recording counter

      // Create a download link
      const downloadLink = document.createElement('a');
      downloadLink.href = audioUrl;
      downloadLink.download = `recorded_audio_${recordingCounter}.webm`; // save file with .webm extension
      downloadLink.innerText = `Download Recorded Audio ${recordingCounter}`; // Add counter to link text
      downloadLink.classList.add('download-link');

      // Append the link to the app content
      document.querySelector('.app-content').appendChild(downloadLink);

      // Enable the audio playback control
      audioElement.controls = true;

      // Resetting audioChunks for the next recording
      audioChunks = [];
    };

    audioRecorder.start();
  };

  // Function to handle errors
  const handleError = (error) => {
    console.error("Error accessing the microphone:", error);
    alert("Error accessing the microphone. Please check the console for more details.");
  };

  startButton.onclick = () => {
    startButton.disabled = true;
    stopButton.disabled = false;

    // Disable the audio playback control
    audioElement.controls = false;

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(handleStream)
      .catch(handleError);
  };

  stopButton.onclick = () => {
    if (audioRecorder) {
      audioRecorder.stop();
      startButton.disabled = false;
      stopButton.disabled = true;
    }
  };
});
