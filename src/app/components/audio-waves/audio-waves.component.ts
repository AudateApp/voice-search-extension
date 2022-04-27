import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Logger } from 'src/app/services/logging/logger';
import { LoggingService } from 'src/app/services/logging/logging.service';
import { State } from 'src/app/services/recognition/recognition-state';
import { RecognitionService } from 'src/app/services/recognition/recognition.service';
import { AudioWave } from './audio-wave';

@Component({
  selector: 'audate-audio-waves',
  templateUrl: './audio-waves.component.html',
  styleUrls: ['./audio-waves.component.scss'],
})
export class AudioWavesComponent
  extends AudioWave
  implements OnInit, AfterViewInit
{
  logger: Logger;

  @ViewChild('waveCanvas') canvasView: any;
  constructor(
    private speechRecognizer: RecognitionService,
    private ref: ChangeDetectorRef,
    loggingService: LoggingService
  ) {
    super();
    this.logger = loggingService.getLogger('audio-waves');
  }

  ngOnInit(): void {
    this.speechRecognizer.getRecognitionState().subscribe((rstate) => {
      switch (rstate.state) {
        case State.START:
          this.nodeCount = 10;
          this.init(this.canvasView.nativeElement);
          break;
        case State.TRANSCRIBING:
          if (rstate.transcript?.partialText) {
            if (this.nodeCount != 20) {
              this.nodeCount = 20;
              this.init(this.canvasView.nativeElement);
            }
          }
          break;
        case State.END:
          this.nodeCount = 2;
          this.init(this.canvasView.nativeElement);
          break;
        case State.IDLE:
          this.nodeCount = 2;
          this.init(this.canvasView.nativeElement);
          break;
        case State.NOT_SUPPORTED:
        case State.PERMISSION_NOT_GRANTED:
        case State.NO_AUDIO_INPUT_DEVICE:
        case State.NO_CONNECTION:
        case State.NO_SPEECH_DETECTED:
        case State.ABORTED:
        case State.LANGUAGE_NOT_SUPPORTED:
        case State.SERVICE_NOT_ALLOWED:
          break;
      }
      this.ref.detectChanges();
    });
  }

  ngAfterViewInit() {
    if (!this.init(this.canvasView.nativeElement)) {
      this.logger.error('Unable to initialize audio waves');
    }
  }

  /*
   * Samples here https://www.cssscript.com/tag/wave/,
   * Desired UI - https://in.pinterest.com/pin/527836018814735661/
   * Inspiration - https://codepen.io/justiceo/pens/loved.
   */
}
