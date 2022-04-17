import { TranscriptComponent } from "../popup/transcript/transcript.component";

export interface RecognitionState {
  state: AppState;
  error?: AppError;
  data?: Recognizing;
}

export enum AppState {
  UNKNOWN = "unknown",
  ERROR = "error",
  IDLE = "idle",
  RECOGNIZING = "recognizing",
}

export interface AppError {
  type: ErrorType;
  message: string;
}

// Full error-list here - https://wicg.github.io/speech-api/#dom-speechrecognitionerrorcode-service-not-allowed
export enum ErrorType {
  UNKNOWN,
  NOT_SUPPORTED, // The browser does not support speech recognition natively
  PERMISSION_NOT_GRANTED,
  NO_AUDIO_INPUT_DEVICE,
  NO_CONNECTION,
}

export interface Idle {
  keep: boolean;
}

export interface Recognizing {
  transcript?: Transcript;
  audioState: AudioState;
  audioLevel?: number;
}

export interface Transcript {
  finalText?: string;
  partialText?: string;
  alternatives?: string[];
}

export enum AudioState {
  UNKNOWN,
  START,
  TRANSCRIBING,
  NO_SPEECH_DETECTED,
  END, // For a continuous session, fired when user closes mic. For a single sentence, fired after end-of-speech.
}
