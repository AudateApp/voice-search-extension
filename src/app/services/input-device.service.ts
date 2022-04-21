import { Injectable } from '@angular/core';

/** Provide abstraction for audio input devices. */
@Injectable({
  providedIn: 'root',
})
export class InputDeviceService {

  constructor() {
  }

  getInputDevices(): Promise<MediaDeviceInfo[]> {
    return navigator.mediaDevices.enumerateDevices().then((devices) => {
      // this.devices = devices.filter(d => d.kind === "audioinput");
      // this.currentDevice = this.devices.find(d => d.deviceId == "default");
      // console.log("audio devices", this.devices, this.currentDevice);
      return devices;
    });
  }

  getDefaultDevice(): Promise<MediaDeviceInfo> {
    return navigator.mediaDevices.enumerateDevices().then((devices) => {
      const device = devices.find(d => d.deviceId == "default");
      if(device) {
        console.log(device, devices);
        return device;
      } else {
        console.error("Default device not found in devices list: ", devices);
        throw "Default device not found";
      }
    }, (error) => {
      throw error;
    });
  }
}
