import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OptionsPageComponent } from '../options-page/options-page.component';
import { PopupComponent } from '../popup/popup.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: 'popup.html',
    component: PopupComponent,
  },
  {
    path: 'options.html',
    component: OptionsPageComponent,
  },
  {
    path: '',
    component: AppComponent,
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
