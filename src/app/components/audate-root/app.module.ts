import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PopupComponent } from '../popup/popup.component';
import { InputPlateComponent } from '../input-plate/input-plate.component';
import { TranscriptComponent } from '../transcript/transcript.component';
import { AudioWavesComponent } from '../audio-waves/audio-waves.component';
import { QuickSettingsComponent } from '../quick-settings/quick-settings.component';
import { FormsModule } from '@angular/forms';
import { BackgroundPageComponent } from '../background-page/background-page.component';
import { OptionsPageComponent } from '../options-page/options-page.component';

@NgModule({
  declarations: [
    AppComponent,
    PopupComponent,
    InputPlateComponent,
    TranscriptComponent,
    AudioWavesComponent,
    QuickSettingsComponent,
    BackgroundPageComponent,
    OptionsPageComponent,
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
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
