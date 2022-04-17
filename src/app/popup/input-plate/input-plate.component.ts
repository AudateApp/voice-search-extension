import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {
  DefaultLocale,
  LocaleProperties,
  LocalesForDefaultModel,
} from '../../model/languages';
import { AppState } from '../../model/recognition-state';
import { RecognitionService } from '../../services/recognition.service';

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

  errorMessage?: string;
  transcript?: string;
  listening = false;

  constructor(
    private speechRecognizer: RecognitionService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    let count = 1;
    this.speechRecognizer.getRecognitionState().subscribe((rstate) => {
      console.log('#event ', count++, rstate);
      if (rstate.state === AppState.ERROR) {
        this.errorMessage = rstate.error?.message;
      }
      if (rstate.state == AppState.RECOGNIZING) {
        this.listening = true;
        this.transcript = rstate.data?.transcript?.partialText || '#underfined';
      } else {
        this.listening = false;
      }
      this.ref.detectChanges();
    });
  }

  micTap(): void {
    if (this.listening) {
      this.speechRecognizer.stop();
    } else {
      this.speechRecognizer.start(true);
    }
  }

  selectLanguage(language: LocaleProperties): void {
    this.currentLocale = language;
  }
}
