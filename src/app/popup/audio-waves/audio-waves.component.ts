import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'audate-audio-waves',
  templateUrl: './audio-waves.component.html',
  styleUrls: ['./audio-waves.component.scss']
})
export class AudioWavesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log("Hello");
  }

  // Samples here https://www.cssscript.com/tag/wave/,
  // Desired UI - https://in.pinterest.com/pin/527836018814735661/
  // Inspiration - https://codepen.io/justiceo/pens/loved.
}
