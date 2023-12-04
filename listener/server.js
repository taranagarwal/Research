// Import the Cloud Speech-to-Text library
import { v2 as speech } from '@google-cloud/speech';

// Instantiates a client
const client = new speech.SpeechClient();

// Your local audio file to transcribe
const audioFilePath = "gs://test_bucket_taran/audio-files/recorded_audio_2 (1).webm";
// Full recognizer resource name
const recognizerName = "projects/lively-epsilon-406718/locations/us/recognizers/_";
// The output path of the transcription result.
const workspace = "gs://test_bucket_taran/transcripts";

const recognitionConfig = {
  autoDecodingConfig: {},
  model: "short",
  languageCodes: ["en-US"],
  features: {
  enableWordTimeOffsets: true,
  enable_word_confidence: true,
  },
};

const audioFiles = [
  { uri: audioFilePath }
];
const outputPath = {
  gcsOutputConfig: {
    uri: workspace
  }
};

async function transcribeSpeech() {
  const transcriptionRequest = {
    recognizer: recognizerName,
    config: recognitionConfig,
    files: audioFiles,
    recognitionOutputConfig: outputPath,
  };

  await client.batchRecognize(transcriptionRequest);
}

transcribeSpeech();
