import {
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { SearchEngineService } from 'src/app/services/search-engine.service';
import { State } from '../../model/recognition-state';
import { RecognitionService } from '../../services/recognition.service';

@Component({
  selector: 'audate-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
})
export class PopupComponent implements OnInit {
  showQuickSettings = true;
  finalTrascript?: string;

  constructor(
    private speechRecognizer: RecognitionService,
    private searchEngineService: SearchEngineService,
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
            this.searchEngineService.performSearch(this.finalTrascript);
          }
          this.finalTrascript = undefined;
      }
    });
  }

  toggleQuickSettings() {
    this.showQuickSettings = !this.showQuickSettings;
  }
}
