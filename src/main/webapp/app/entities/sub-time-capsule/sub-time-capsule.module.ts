import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SubTimeCapsuleComponent } from './list/sub-time-capsule.component';
import { SubTimeCapsuleDetailComponent } from './detail/sub-time-capsule-detail.component';
import { SubTimeCapsuleUpdateComponent } from './update/sub-time-capsule-update.component';
import { SubTimeCapsuleDeleteDialogComponent } from './delete/sub-time-capsule-delete-dialog.component';
import { SubTimeCapsuleRoutingModule } from './route/sub-time-capsule-routing.module';

@NgModule({
  imports: [SharedModule, SubTimeCapsuleRoutingModule],
  declarations: [
    SubTimeCapsuleComponent,
    SubTimeCapsuleDetailComponent,
    SubTimeCapsuleUpdateComponent,
    SubTimeCapsuleDeleteDialogComponent,
  ],
})
export class SubTimeCapsuleModule {}
