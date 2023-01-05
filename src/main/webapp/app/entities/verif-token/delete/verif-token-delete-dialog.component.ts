import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IVerifToken } from '../verif-token.model';
import { VerifTokenService } from '../service/verif-token.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './verif-token-delete-dialog.component.html',
})
export class VerifTokenDeleteDialogComponent {
  verifToken?: IVerifToken;

  constructor(protected verifTokenService: VerifTokenService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.verifTokenService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
