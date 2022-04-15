export enum RecognitionState {
    UNKNOWN = 0,
    NOT_SUPPORTED, // The browser does not support speech recognition natively
    PERMISSION_NOT_GRANTED, 
    AVAILABLE,
    RECOGNIZING,
}
