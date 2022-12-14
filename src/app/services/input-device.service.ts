import { Injectable } from '@angular/core';
import { Logger } from './logging/logger';
import { LoggingService } from './logging/logging.service';

/** Provide abstraction for audio input devices. */
@Injectable({
  providedIn: 'root',
})
export class InputDeviceService {
  logger: Logger;
  constructor(loggingService: LoggingService) {
    this.logger = loggingService.getLogger('InputDevService');
  }

  getInputDevices(): Promise<MediaDeviceInfo[]> {
    return navigator.mediaDevices.enumerateDevices().then((devices) => {
      const inputDevices = devices.filter(
        (device) => device.kind === 'audioinput'
      );

      // Remove the default device's normal input from this list.
      const defaultInputDevice = inputDevices.find(
        (d) => d.deviceId == 'default'
      );
      if (!defaultInputDevice) {
        return inputDevices;
      }
      return inputDevices.filter(
        (d) => d.groupId != defaultInputDevice?.groupId
      );
    });
  }

  getDefaultDevice(): Promise<MediaDeviceInfo> {
    return navigator.mediaDevices.enumerateDevices().then(
      (devices) => {
        const device = devices.find((d) => d.deviceId == 'default');
        if (device) {
          return device;
        } else {
          this.logger.warn(
            'Default device not found in devices list: ',
            devices
          );
          const audioInputDevices = devices.filter(d => d.kind === 'audioinput');
          const firstInputDevice = audioInputDevices.length > 0 ? audioInputDevices[0] : null;
          if (firstInputDevice) {
            return firstInputDevice;
          }
          throw 'Input device not found';
        }
      },
      (error) => {
        throw error;
      }
    );
  }
}
