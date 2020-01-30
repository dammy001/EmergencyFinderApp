import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MechanicPage } from './mechanic';

@NgModule({
  declarations: [
    MechanicPage,
  ],
  imports: [
    IonicPageModule.forChild(MechanicPage),
  ],
})
export class MechanicPageModule {}
