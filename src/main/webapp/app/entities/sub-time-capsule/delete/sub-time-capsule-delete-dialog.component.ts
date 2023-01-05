import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISubTimeCapsule } from '../sub-time-capsule.model';
import { SubTimeCapsuleService } from '../service/sub-time-capsule.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './sub-time-capsule-delete-dialog.component.html',
})
export class SubTimeCapsuleDeleteDialogComponent {
  subTimeCapsule?: ISubTimeCapsule;

  constructor(protected subTimeCapsuleService: SubTimeCapsuleService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.subTimeCapsuleService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
