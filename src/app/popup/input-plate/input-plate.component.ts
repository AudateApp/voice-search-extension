import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { merge, Observable, of, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { DefaultLocale, LocaleProperties, LocalesForDefaultModel } from '../../model/languages';
import { RecognitionState } from '../../model/recognition-state';
import { RecognitionEvent } from '../../model/recognition-event';
import { RecognitionService } from '../../services/recognition.service';
import { SpeechNotification } from '../../model/speech-notification';

@Component({
  selector: 'audate-input-plate',
  templateUrl: './input-plate.component.html',
  styleUrls: ['./input-plate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputPlateComponent implements OnInit {
  locales: LocaleProperties[] = LocalesForDefaultModel;
  currentLocale: LocaleProperties = DefaultLocale;
  totalTranscript?: string;

  transcript$?: Observable<string>;
  listening$?: Observable<boolean>;
  errorMessage$?: Observable<string>;
  defaultError$ = new Subject<string | undefined>();

  constructor(
    private speechRecognizer: RecognitionService,
  ) {}

  ngOnInit(): void {
    const webSpeechReady = this.speechRecognizer.initialize(this.currentLocale);
    if (webSpeechReady) {
      this.initRecognition();
    }else {
      this.errorMessage$ = of('Your Browser is not supported. Please try Google Chrome.');
    }
  }

  start(): void {
    if (this.speechRecognizer.isListening) {
      this.stop();
      return;
    }

    this.defaultError$.next(undefined);
    this.speechRecognizer.start();
  }

  stop(): void {
    this.speechRecognizer.stop();
  }

  selectLanguage(language: LocaleProperties): void {
    if (this.speechRecognizer.isListening) {
      this.stop();
    }
    this.currentLocale = language;
    this.speechRecognizer.setLanguage(this.currentLocale);
  }

  private initRecognition(): void {
    this.transcript$ = this.speechRecognizer.onResult().pipe(
      tap((notification) => {
        this.processNotification(notification);
      }),
      map((notification) => notification.content || '')
    );

    this.listening$ = merge(
      this.speechRecognizer.onStart(),
      this.speechRecognizer.onEnd()
    ).pipe(map((notification) => notification.event === RecognitionEvent.Start));

    this.errorMessage$ = merge(
      this.speechRecognizer.onError(),
      this.defaultError$
    ).pipe(
      map((data) => {
        if (data === undefined) {
          return '';
        }
        if (typeof data === 'string') {
          return data;
        }
        let message;
        switch (data.error) {
          case RecognitionState.PERMISSION_NOT_GRANTED:
            message = `Cannot run the demo.
            Your browser is not authorized to access your microphone.
            Verify that your browser has access to your microphone and try again.`;
            break;
          case RecognitionState.NO_SPEECH_DETECTED:
            message = `No speech has been detected. Please try again.`;
            break;
          case RecognitionState.NO_AUDIO_INPUT_DEVICE:
            message = `Microphone is not available. Plese verify the connection of your microphone and try again.`;
            break;
          default:
            message = '';
            break;
        }
        return message;
      })
    );
  }

  private processNotification(notification: SpeechNotification<string>): void {
    if (notification.event === RecognitionEvent.FinalContent) {
      const message = notification.content?.trim() || '';
      this.totalTranscript = this.totalTranscript
        ? `${this.totalTranscript}\n${message}`
        : notification.content;
    }
  }
}
