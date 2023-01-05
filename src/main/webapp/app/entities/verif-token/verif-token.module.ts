import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { VerifTokenComponent } from './list/verif-token.component';
import { VerifTokenDetailComponent } from './detail/verif-token-detail.component';
import { VerifTokenUpdateComponent } from './update/verif-token-update.component';
import { VerifTokenDeleteDialogComponent } from './delete/verif-token-delete-dialog.component';
import { VerifTokenRoutingModule } from './route/verif-token-routing.module';

@NgModule({
  imports: [SharedModule, VerifTokenRoutingModule],
  declarations: [VerifTokenComponent, VerifTokenDetailComponent, VerifTokenUpdateComponent, VerifTokenDeleteDialogComponent],
})
export class VerifTokenModule {}
