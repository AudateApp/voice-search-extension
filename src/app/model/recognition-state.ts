export interface RecognitionState {
  state: State;
  transcript?: Transcript;
  soundLevel?: number;
  errorMessage?: string;
}

export interface Transcript {
  finalText?: string;
  partialText?: string;
  alternatives?: string[];
}

export enum State {
  UNKNOWN,
  // Full error-list here - https://wicg.github.io/speech-api/#dom-speechrecognitionerrorcode-service-not-allowed
  NOT_SUPPORTED, // The browser does not support speech recognition natively
  PERMISSION_NOT_GRANTED,
  NO_AUDIO_INPUT_DEVICE,
  NO_CONNECTION,
  NO_SPEECH_DETECTED,

  IDLE,
  START,
  TRANSCRIBING,
  END, // For a continuous session, fired when user closes mic. For a single sentence, fired after end-of-speech.
}
