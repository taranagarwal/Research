const speech = require('@google-cloud/speech');
const client = new speech.SpeechClient({ keyFilename: 'path-to-your-credentials-file.json' });

async function transcribeAudio(audioBuffer) {
  const audio = { content: audioBuffer.toString('base64') };
  const config = {
    encoding: 'LINEAR16', // update this based on audio format
    sampleRateHertz: 16000, // update this based on audio format
    languageCode: 'en-US',
    enableWordTimeOffsets: true, // important to get word timestamps
  };

  const request = {
    audio: audio,
    config: config,
  };

  const [response] = await client.recognize(request);
  const transcription = response.results
    .map(result => result.alternatives[0])
    .map(alternative => {
      const firstWord = alternative.words[0];
      const lastWord = alternative.words[alternative.words.length - 1];
      const startTime = firstWord.startTime.seconds + firstWord.startTime.nanos * 1e-9;
      const endTime = lastWord.endTime.seconds + lastWord.endTime.nanos * 1e-9;
      const duration = endTime - startTime;
      const wordsPerSecond = alternative.words.length / duration;

      return {
        transcript: alternative.transcript,
        wordsPerSecond: wordsPerSecond,
      };
    });

  return transcription;
}
