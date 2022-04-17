import { Injectable, NgZone } from '@angular/core';
import { Observable, share, Subject } from 'rxjs';
import {
  RecognitionState,
  ErrorType,
  AudioState,
  AppState,
} from '../model/recognition-state';
import { LocaleProperties } from '../model/locale';

// This is a strategy for adding the symbol webkitSpeechRecognition to the window object,
// Since TypeScript cannot find it.
interface IWindow extends Window {
  // tslint:disable-next-line:no-any
  webkitSpeechRecognition: any;
}
// tslint:disable-next-line:no-any
const { webkitSpeechRecognition }: IWindow = window as any as IWindow;
const IdleState: RecognitionState = { state: AppState.IDLE };

@Injectable({
  providedIn: 'root',
})
export class RecognitionService {
  recognition!: any;
  language!: LocaleProperties;
  recognitionState: RecognitionState = IdleState;
  recognitionState$: Subject<RecognitionState> = new Subject();

  constructor(private ngZone: NgZone) {}

  #initialize(language: LocaleProperties, isContinuous: boolean): ErrorType {
    // When using the chrome recognition API via popup, no special permission is required.
    // See permsisiosn list here - https://developer.chrome.com/docs/extensions/mv3/declare_permissions/
    // When accessing on a webpage, microphone access is a required permission. If this extension is installed, it has it.

    if (!('webkitSpeechRecognition' in window)) {
      return ErrorType.NOT_SUPPORTED;
    }

    this.recognition = new webkitSpeechRecognition();
    // When disabled, recognition would automatically stop after the first continguous audio streams.
    // The final transcript is sent one, after #onAudioEnd.
    this.recognition.continuous = isContinuous; // TODO: Parameterize.
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 3;
    this.recognition.lang = 'en-US'; // TODO: Parameterize.

    // Wire up life-cycle methods, in the order they are invoked.
    this.recognition.onstart = this.#onStart;
    this.recognition.onaudiostart = this.#onAudioStart;
    this.recognition.onsoundstart = this.#onSoundStart;
    this.recognition.onspeechstart = this.#onSpeechStart;
    this.recognition.onspeechend = this.#onSpeechEnd;
    this.recognition.onsoundend = this.#onSoundEnd;
    this.recognition.onaudioend = this.#onAudioEnd;
    this.recognition.onend = this.#onEnd;

    // Wire up response handlers.
    this.recognition.onresult = this.#onResult;
    this.recognition.onerror = this.#onError;
    return ErrorType.UNKNOWN;
  }

  /**
   * Fired when the speech recognition service has begun listening to
   * incoming audio with intent to recognize grammars associated with
   * the current SpeechRecognition.
   */
  #onStart = () => {
    console.log('#onStart');
    this.recognitionState = {
      state: AppState.RECOGNIZING,
      data: { audioState: AudioState.START },
    };
    this.recognitionState$.next(this.recognitionState);
  };

  /** Fired when the user agent has started to capture audio. */
  #onAudioStart = () => {
    console.log('#onAudioStart');
  };

  /** Fired when any sound — recognizable speech or not — has been detected. */
  #onSoundStart = () => {
    console.log('#onSoundStart');
  };

  /** Fired when sound that is recognized by the speech recognition service as speech has been detected. */
  #onSpeechStart = () => {
    console.log('#onSpeechStart');
  };

  /** Fired when speech recognized by the speech recognition service has stopped being detected. */
  #onSpeechEnd = () => {
    console.log('#onSpeechEnd');
  };

  /** Fired when any sound — recognizable speech or not — has stopped being detected. */
  #onSoundEnd = () => {
    console.log('#onSoundEnd');
  };

  /** Fired when the user agent has finished capturing audio. */
  #onAudioEnd = () => {
    console.log('#onAudioEnd');
    this.recognitionState = {
      state: AppState.RECOGNIZING,
      data: { audioState: AudioState.END },
    };
    this.recognitionState$.next(this.recognitionState);
  };

  /** Fired when the speech recognition service has disconnected.
   *
   * This method is guaranteed to be executed, even if #onStart was never called,
   * and even in instances where #onSpeechEnd or #onAudioEnd are not invoked.
   */
  #onEnd = () => {
    console.log('#onEnd');
    this.recognitionState = IdleState;
    this.recognitionState$.next(this.recognitionState);
    this.recognition = null;
  };

  /** Fired when a speech recognition error occurs. */
  #onError = (event: any) => {
    console.error('#onError', event);
    const eventError: string = (event as any).error;
    switch (eventError) {
      case 'no-speech':
        this.recognitionState = {
          state: AppState.RECOGNIZING,
          data: {
            audioState: AudioState.NO_SPEECH_DETECTED,
          },
        };
        break;
      case 'audio-capture':
        this.recognitionState = {
          state: AppState.ERROR,
          error: {
            type: ErrorType.NO_AUDIO_INPUT_DEVICE,
            message: 'No microphone devices detected or mic is muted.',
          },
        };
        break;
      case 'not-allowed':
        this.recognitionState = {
          state: AppState.ERROR,
          error: {
            type: ErrorType.PERMISSION_NOT_GRANTED,
            message: 'Microphone permission not yet granted.',
          },
        };
        break;
      case 'network':
        this.recognitionState = {
          state: AppState.ERROR,
          error: {
            type: ErrorType.NO_CONNECTION,
            message: 'Network disconnected.',
          },
        };
        break;
      case 'aborted':
        // Starting speech recognition while one ongoing.
        break;
      default:
        this.recognitionState = {
          state: AppState.ERROR,
          error: { type: ErrorType.UNKNOWN, message: 'TODO:Please set this' },
        };
        break;
    }
    this.recognitionState$.next(this.recognitionState);
  };

  /** Fired when the speech recognition service returns a
   * result — a word or phrase has been positively recognized
   * and this has been communicated back to the app.
   */
  #onResult = (event: any) => {
    console.log('#onResult', event);
    let interimContent = '';
    let finalContent = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalContent += event.results[i][0].transcript;
        this.recognitionState = {
          state: AppState.RECOGNIZING,
          data: {
            audioState: AudioState.TRANSCRIBING,
            transcript: { finalText: finalContent },
          },
        };
        this.recognitionState$.next(this.recognitionState);
      } else {
        interimContent += event.results[i][0].transcript;
        this.recognitionState = {
          state: AppState.RECOGNIZING,
          data: {
            audioState: AudioState.TRANSCRIBING,
            transcript: { partialText: interimContent },
          },
        };
        this.recognitionState$.next(this.recognitionState);
      }
    }
  };

  start(isContinuous: boolean): void {
    if (this.recognition) {
      console.log('stopping recognition');
      this.recognition.abort();
      
      // TODO: Wait for recognition object to become null, i.e. onEnd has fired.
      // If this function is invoked twice back-to-back, it would fail.
    }


    const errorType = this.#initialize(this.language, isContinuous);
    if (errorType !== ErrorType.UNKNOWN) {
      this.recognitionState = {
        state: AppState.ERROR,
        error: { type: errorType, message: 'Recognition not supported.' },
      };
      this.recognitionState$.next(this.recognitionState);
      return;
    }

    this.recognition.start();
  }

  stop(): void {
    if (!this.recognition) {
      console.error("Stopping recognition that isn't initialized");
      return;
    }
    
    // Aborting instead of stopping prevents streaming results after closure.
    this.recognition.abort();
  }

  getRecognitionState(): Observable<RecognitionState> {
    return this.recognitionState$.asObservable().pipe(share());
  }
}
