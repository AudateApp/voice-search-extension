import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SearchEngineService } from 'src/app/services/search-engine.service';
import { State } from '../../services/recognition/recognition-state';
import { RecognitionService } from '../../services/recognition/recognition.service';

@Component({
  selector: 'audate-voice-search',
  templateUrl: './voice-search.component.html',
  styleUrls: ['./voice-search.component.scss'],
})
export class VoiceSearchComponent implements OnInit {
  finalTrascript?: string;

  constructor(
    private speechRecognizer: RecognitionService,
    private searchEngineService: SearchEngineService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.speechRecognizer.getRecognitionState().subscribe((rstate) => {
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
            window.close();
          }
          this.finalTrascript = undefined;
      }
    });
  }
}
