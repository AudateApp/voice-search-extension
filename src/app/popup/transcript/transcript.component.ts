import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AppState, AudioState } from 'src/app/model/recognition-state';
import { RecognitionService } from 'src/app/services/recognition.service';

@Component({
  selector: 'audate-transcript',
  templateUrl: './transcript.component.html',
  styleUrls: ['./transcript.component.scss'],
})
export class TranscriptComponent implements OnInit {
  idleMessage = 'Click start to speaking';
  idleTimeoutMs = 1000;
  message: string = this.idleMessage;

  constructor(
    private speechRecognizer: RecognitionService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    let count = 1;
    this.speechRecognizer.getRecognitionState().subscribe((rstate) => {
      console.log('#event ', count++, rstate);
      if (rstate.state === AppState.ERROR) {
        this.message = rstate.error?.message || this.idleMessage;
      }
      if (rstate.state == AppState.RECOGNIZING) {
        const audioState = rstate.data?.audioState || AudioState.UNKNOWN;
        switch (audioState) {
          case AudioState.START:
            this.message = 'Listening...';
            break;
          case AudioState.NO_SPEECH_DETECTED:
            this.message = 'No Speech Detected';
            break;
          case AudioState.END:
            setTimeout(() => {
              this.message = this.idleMessage;
              this.ref.detectChanges();
            }, this.idleTimeoutMs);
            break;
          case AudioState.TRANSCRIBING:
            if (rstate.data?.transcript?.partialText) {
              this.message = rstate.data?.transcript?.partialText;
            }
            break;
        }
      }

      this.ref.detectChanges();
    });
  }
}
