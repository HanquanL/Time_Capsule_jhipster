import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { UserUploadFileComponent } from './list/user-upload-file.component';
import { UserUploadFileDetailComponent } from './detail/user-upload-file-detail.component';
import { UserUploadFileUpdateComponent } from './update/user-upload-file-update.component';
import { UserUploadFileDeleteDialogComponent } from './delete/user-upload-file-delete-dialog.component';
import { UserUploadFileRoutingModule } from './route/user-upload-file-routing.module';

@NgModule({
  imports: [SharedModule, UserUploadFileRoutingModule],
  declarations: [
    UserUploadFileComponent,
    UserUploadFileDetailComponent,
    UserUploadFileUpdateComponent,
    UserUploadFileDeleteDialogComponent,
  ],
})
export class UserUploadFileModule {}
