import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentPopupComponent } from '../content-popup/content-popup.component';
import { OptionsPageComponent } from '../options-page/options-page.component';
import { PermissionRequestComponent } from '../permission-request/permission-request.component';
import { PopupComponent } from '../popup/popup.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: 'popup',
    component: PopupComponent,
  },
  {
    path: 'content-popup',
    component: ContentPopupComponent,
  },
  {
    path: 'options',
    component: OptionsPageComponent,
  },
  {
    path: 'request-permissions',
    component: PermissionRequestComponent,
  },
  {
    path: '',
    component: AppComponent,
    pathMatch: 'full',
  },
  {
    path: '**',
    component: AppComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
