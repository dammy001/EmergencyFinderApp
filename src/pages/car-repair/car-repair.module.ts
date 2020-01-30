import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CarRepairPage } from './car-repair';

@NgModule({
  declarations: [
    CarRepairPage,
  ],
  imports: [
    IonicPageModule.forChild(CarRepairPage),
  ],
})
export class CarRepairPageModule {}
