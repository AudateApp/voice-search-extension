import { RecognitionState } from './recognition-state';
import { RecognitionEvent } from './recognition-event';

export interface SpeechNotification<T> {
    event?: RecognitionEvent;
    error?: RecognitionState;
    content?: T;
}
