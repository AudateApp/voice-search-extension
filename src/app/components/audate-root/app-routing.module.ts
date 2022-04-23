import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InputPlateComponent } from '../input-plate/input-plate.component';
import { PopupComponent } from '../popup/popup.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: 'popup',
    component: PopupComponent,
  },
  {
    path: 'input',
    component: InputPlateComponent,
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
