import { Component } from '@angular/core';

@Component({
  selector: 'audate-permission-request',
  templateUrl: './permission-request.component.html',
  styleUrls: ['./permission-request.component.scss'],
})
export class PermissionRequestComponent {
  constructor() {}

  /*
   * Also request permissions to display popups,
   * This is necessary for opening search from content script.
   */
  requestPermission() {
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then((stream) => {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
        console.log('Perimission granted ', stream);
      })
      .catch((err) => {
        /*
         * TODO: Handle errors:
         *
         * Chrome error messages.
         * err: DOMException: Permission denied
         * err: DOMException: Permission dismissed
         * err: DOMException: Permission denied by system // browser doesn't have access
         *
         * Firefox:
         * err: DOMException: The request is not allowed by the user agent or the platform in the current context.
         * err: DOMException: The object can not be found here - (the browser doesn't have mic permission).
         *
         * Safari:
         * err: NotAllowedError: The request is not allowed by the user agent or the platform in the current context, possibly because the user denied permission.
         *
         */
        console.log('Error requesting permission ', err);
      });
  }
}
