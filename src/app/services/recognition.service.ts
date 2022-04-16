import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

import { SpeechNotification } from '../model/speech-notification';
import { RecognitionState } from '../model/recognition-state';
import { RecognitionEvent } from '../model/recognition-event';
import { LocaleProperties } from '../model/languages';

// This is a strategy for adding the symbol webkitSpeechRecognition to the window object,
// Since TypeScript cannot find it.
interface IWindow extends Window {
  // tslint:disable-next-line:no-any
  webkitSpeechRecognition: any;
}
// tslint:disable-next-line:no-any
const { webkitSpeechRecognition }: IWindow = (window as any) as IWindow;

@Injectable({
  providedIn: 'root',
})
export class RecognitionService {
  recognition!: any;
  language!: LocaleProperties;
  isListening = false;
  recognitionState: RecognitionState = RecognitionState.UNKNOWN;

  constructor(private ngZone: NgZone) {}

  initialize(language: LocaleProperties): boolean {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new webkitSpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.setLanguage(language);
      return true;
    }

    return false;
  }

  setLanguage(language: LocaleProperties): void {
    this.language = language;
    this.recognition.lang = language.bcp_47;
  }

  start(): void {
    if (!this.recognition) {
      return;
    }

    this.recognition.start();
    this.isListening = true;
  }

  onStart(): Observable<SpeechNotification<never>> {
    if (!this.recognition) {
      this.initialize(this.language);
    }

    return new Observable(observer => {
      this.recognition.onstart = () => {
        this.ngZone.run(() => {
          observer.next({
            event: RecognitionEvent.Start
          });
        });
      };
    });
  }

  onEnd(): Observable<SpeechNotification<never>> {
    return new Observable(observer => {
      this.recognition.onend = () => {
        this.ngZone.run(() => {
          observer.next({
            event: RecognitionEvent.End
          });
          this.isListening = false;
        });
      };
    });
  }

  onResult(): Observable<SpeechNotification<string>> {
    return new Observable(observer => {
      this.recognition.onresult = (event: any) => {
        let interimContent = '';
        let finalContent = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalContent += event.results[i][0].transcript;
            this.ngZone.run(() => {
              observer.next({
                event: RecognitionEvent.FinalContent,
                content: finalContent
              });
            });
          } else {
            interimContent += event.results[i][0].transcript;
            // console.log('interim transcript', event, interimContent);
            this.ngZone.run(() => {
              observer.next({
                event: RecognitionEvent.InterimContent,
                content: interimContent
              });
            });
          }
        }
      };
    });
  }

  onError(): Observable<SpeechNotification<never>> {
    return new Observable(observer => {
      this.recognition.onerror = (event: any) => {
        // tslint:disable-next-line:no-any
        const eventError: string = (event as any).error;
        console.log('error', eventError);
        let error: RecognitionState;
        switch (eventError) {
          case 'no-speech':
            error = RecognitionState.NO_SPEECH_DETECTED;
            break;
          case 'audio-capture':
            error = RecognitionState.NO_AUDIO_INPUT_DEVICE;
            break;
          case 'not-allowed':
            error = RecognitionState.PERMISSION_NOT_GRANTED;
            break;
          default:
            error = RecognitionState.UNKNOWN;
            break;
        }

        this.ngZone.run(() => {
          observer.next({
            error
          });
        });
      };
    });
  }

  stop(): void {
    this.recognition.stop();
  }

  // Handle a mic-tap interaction.
  micTap(): void {


  }
}
