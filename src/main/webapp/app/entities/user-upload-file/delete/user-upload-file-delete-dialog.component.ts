import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IUserUploadFile } from '../user-upload-file.model';
import { UserUploadFileService } from '../service/user-upload-file.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './user-upload-file-delete-dialog.component.html',
})
export class UserUploadFileDeleteDialogComponent {
  userUploadFile?: IUserUploadFile;

  constructor(protected userUploadFileService: UserUploadFileService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.userUploadFileService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
