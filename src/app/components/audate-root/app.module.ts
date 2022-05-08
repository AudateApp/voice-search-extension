import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import * as Sentry from '@sentry/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VoiceSearchComponent } from '../voice-search/voice-search.component';
import { InputPlateComponent } from '../input-plate/input-plate.component';
import { TranscriptComponent } from '../transcript/transcript.component';
import { AudioWavesComponent } from '../audio-waves/audio-waves.component';
import { QuickSettingsComponent } from '../quick-settings/quick-settings.component';
import { OptionsPageComponent } from '../options-page/options-page.component';
import { ContentPopupComponent } from '../content-popup/content-popup.component';
import { PermissionRequestComponent } from '../permission-request/permission-request.component';
import { Router } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    VoiceSearchComponent,
    InputPlateComponent,
    TranscriptComponent,
    AudioWavesComponent,
    QuickSettingsComponent,
    OptionsPageComponent,
    ContentPopupComponent,
    PermissionRequestComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ButtonModule,
    DropdownModule,
    DialogModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler({
        showDialog: true,
      }),
    },
    {
      provide: Sentry.TraceService,
      deps: [Router],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(trace: Sentry.TraceService) {
    // myUndefinedFunction();
  }
}
