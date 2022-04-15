import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { RecognitionState } from '../recognition-state';

@Injectable({
  providedIn: 'root'
})
export class RecognitionService {

  recognitionState: RecognitionState = RecognitionState.UNKNOWN;

  constructor() {
    this.init();
  }

  init() {
    if (!('webkitSpeechRecognition' in window)) {
      this.recognitionState = RecognitionState.NOT_SUPPORTED;
      return;
    }
  }
}
