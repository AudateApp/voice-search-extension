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
  UNKNOWN = "unknown",
  // Full error-list here - https://wicg.github.io/speech-api/#dom-speechrecognitionerrorcode-service-not-allowed
  NOT_SUPPORTED = "not-supported", // The browser does not support speech recognition natively
  PERMISSION_NOT_GRANTED = "permission-not-granted",
  NO_AUDIO_INPUT_DEVICE = "no-audio-capture",
  NO_CONNECTION = "no-connection",
  NO_SPEECH_DETECTED = "no-speech-detected",
  ABORTED = "aborted",

  IDLE = "idle",
  START = "start",
  TRANSCRIBING = "transcribing",
  END = "end", // For a continuous session, fired when user closes mic. For a single sentence, fired after end-of-speech.
}
