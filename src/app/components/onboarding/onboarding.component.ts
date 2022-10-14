import { Component, OnInit } from '@angular/core';
import { Logger } from 'src/app/services/logging/logger';
import { LoggingService } from 'src/app/services/logging/logging.service';
import { applyConfig, DefaultConfig } from '../audio-waves/audio-wave';

@Component({
  selector: 'audate-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
})
export class OnboardingComponent {
  steps = ['hello', 'world'];
  notice = "";
  headerWave = DefaultConfig;
  footerWave = DefaultConfig;
  logger: Logger;

  constructor(loggingService: LoggingService) {
    this.logger = loggingService.getLogger("onboarding");

    this.headerWave = applyConfig({
      width: 0,
      height: 30,
      nodeCount: 70,
      opaqueColor: '#410ff8',
    });

    this.footerWave = applyConfig({
      width: 0,
      height: 20,
      opaqueColor: '#410ff8',
      rotation: 180,
      nodeCount: 180,
    });
  }

  requestPermission() {
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then((stream) => {
        stream.getTracks().forEach((track) => {
          track.stop();
          // Wait a second then close the tab.
          setTimeout(() => {
            window.close();
          }, 2000);
        });
        this.notice = 'Permission Granted';
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
        this.logger.error('Error requesting permission ', err);
        this.notice = 'Permission not granted';
      });
  }
}
