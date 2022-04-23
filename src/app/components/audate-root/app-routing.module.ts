import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BackgroundPageComponent } from '../background-page/background-page.component';
import { OptionsPageComponent } from '../options-page/options-page.component';
import { PopupComponent } from '../popup/popup.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: 'popup',
    component: PopupComponent,
  },
  {
    path: 'background',
    component: BackgroundPageComponent,
  },
  {
    path: 'options',
    component: OptionsPageComponent,
  },
  {
    path: '',
    component: AppComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
