import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { State } from 'src/app/model/recognition-state';
import { RecognitionService } from 'src/app/services/recognition.service';

@Component({
  selector: 'audate-transcript',
  templateUrl: './transcript.component.html',
  styleUrls: ['./transcript.component.scss'],
})
export class TranscriptComponent implements OnInit {
  idleMessage = 'Click start to speaking';
  // TODO: Clear this timeout if a new event fires.
  idleTimeoutMs = 1000;
  message?: string = this.idleMessage;

  constructor(
    private speechRecognizer: RecognitionService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    let count = 1;
    this.speechRecognizer.getRecognitionState().subscribe((rstate) => {
      console.log('#event ', count++, rstate);
      switch (rstate.state) {
        case State.NOT_SUPPORTED:
          this.message = rstate.errorMessage;
          break;
        case State.PERMISSION_NOT_GRANTED:
          this.message = rstate.errorMessage;
          break;
        case State.NO_AUDIO_INPUT_DEVICE:
          this.message = rstate.errorMessage;
          break;
        case State.NO_CONNECTION:
          this.message = rstate.errorMessage;
          break;
        case State.NO_SPEECH_DETECTED:
          this.message = 'No Speech Detected';
          break;
        case State.START:
          this.message = 'Listening...';
          break;
        case State.TRANSCRIBING:
          if (rstate.transcript?.partialText) {
            this.message = rstate.transcript?.partialText;
          }
          break;
        case State.END:
          // Do nothing.
          break;
        case State.IDLE:
          setTimeout(() => {
            this.message = this.idleMessage;
            this.ref.detectChanges();
          }, this.idleTimeoutMs);
          break;
      }
      this.ref.detectChanges();
    });
  }
}
