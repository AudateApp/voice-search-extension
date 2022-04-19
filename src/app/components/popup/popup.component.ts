import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { State } from '../../model/recognition-state';
import { RecognitionService } from '../../services/recognition.service';

@Component({
  selector: 'audate-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PopupComponent implements OnInit {
  display: boolean = false;
  finalTrascript?: string;

  constructor(
    private speechRecognizer: RecognitionService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    let count = 1;
    this.speechRecognizer.getRecognitionState().subscribe((rstate) => {
      console.log('#event ', count++, rstate.state);
      switch (rstate.state) {
        case State.START:
          this.finalTrascript = undefined;
          break;
        case State.TRANSCRIBING:
          if (rstate.transcript?.finalText) {
            this.finalTrascript = rstate.transcript?.finalText;
          }
          break;
        case State.IDLE:
          if (this.finalTrascript) {
            // this.openSearch(this.finalTrascript);
          }
          this.finalTrascript = undefined;
      }
    });
  }

  openSearch(query: string, inNewTab = true) {
    const url = 'https://google.com/search?q=' + query;
    if (inNewTab) {
      (window as any).open(url, '_blank').focus();
    } else {
      (window as any).open(url).focus();
    }
  }

  showDialog() {
    this.display = true;
  }
}
