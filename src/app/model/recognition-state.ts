export enum RecognitionState {
  UNKNOWN,
  NOT_SUPPORTED, // // The browser does not support speech recognition natively
  PERMISSION_NOT_GRANTED,
  NO_AUDIO_INPUT_DEVICE,
  AVAILABLE,
  NO_SPEECH_DETECTED,
}
