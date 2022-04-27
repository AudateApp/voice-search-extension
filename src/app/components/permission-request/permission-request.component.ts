import { Component } from '@angular/core';

@Component({
  selector: 'audate-permission-request',
  templateUrl: './permission-request.component.html',
  styleUrls: ['./permission-request.component.scss'],
})
export class PermissionRequestComponent {
  constructor() {}

  requestPermission() {
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then((stream) => {
        (window as any).localStream = stream; // A
        (window as any).localAudio.srcObject = stream; // B
        (window as any).localAudio.autoplay = true; // C
      })
      .catch((err) => {
        // Check error to see if dismissed or denied.
        console.log('Permission not granted' + err);
      });
  }
}
