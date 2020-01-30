import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FavoritePlacePage } from './favorite-place';

@NgModule({
  declarations: [
    FavoritePlacePage,
  ],
  imports: [
    IonicPageModule.forChild(FavoritePlacePage),
  ],
})
export class FavoritePlacePageModule {}
