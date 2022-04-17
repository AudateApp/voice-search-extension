import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AppState } from 'src/app/model/recognition-state';
import { RecognitionService } from 'src/app/services/recognition.service';

@Component({
  selector: 'audate-transcript',
  templateUrl: './transcript.component.html',
  styleUrls: ['./transcript.component.scss']
})
export class TranscriptComponent implements OnInit {


  idleMessage = "Click start to being";
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
        this.message = rstate.error?.message || this.idleMessage ;
      }
      if (rstate.state == AppState.RECOGNIZING) {
        this.message = rstate.data?.transcript?.partialText || this.idleMessage;
      }

      this.ref.detectChanges();
    });
  }

}
