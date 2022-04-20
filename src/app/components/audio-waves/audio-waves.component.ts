import { Component, ViewChild } from '@angular/core';
import { AudioWave } from './audio-wave';

@Component({
  selector: 'audate-audio-waves',
  templateUrl: './audio-waves.component.html',
  styleUrls: ['./audio-waves.component.scss']
})
export class AudioWavesComponent extends AudioWave  {

  @ViewChild('waveCanvas') canvasView: any;
  constructor() {
    super();
   }

  ngAfterViewInit() {
    if(!this.init(this.canvasView.nativeElement)) {
      console.error("Unable to initialize audio waves");
    }
  }

  // Samples here https://www.cssscript.com/tag/wave/,
  // Desired UI - https://in.pinterest.com/pin/527836018814735661/
  // Inspiration - https://codepen.io/justiceo/pens/loved.
}
