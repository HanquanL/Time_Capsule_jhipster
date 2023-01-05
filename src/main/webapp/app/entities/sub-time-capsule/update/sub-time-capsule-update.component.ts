import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { SubTimeCapsuleFormService, SubTimeCapsuleFormGroup } from './sub-time-capsule-form.service';
import { ISubTimeCapsule } from '../sub-time-capsule.model';
import { SubTimeCapsuleService } from '../service/sub-time-capsule.service';

@Component({
  selector: 'jhi-sub-time-capsule-update',
  templateUrl: './sub-time-capsule-update.component.html',
})
export class SubTimeCapsuleUpdateComponent implements OnInit {
  isSaving = false;
  subTimeCapsule: ISubTimeCapsule | null = null;

  editForm: SubTimeCapsuleFormGroup = this.subTimeCapsuleFormService.createSubTimeCapsuleFormGroup();

  constructor(
    protected subTimeCapsuleService: SubTimeCapsuleService,
    protected subTimeCapsuleFormService: SubTimeCapsuleFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ subTimeCapsule }) => {
      this.subTimeCapsule = subTimeCapsule;
      if (subTimeCapsule) {
        this.updateForm(subTimeCapsule);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const subTimeCapsule = this.subTimeCapsuleFormService.getSubTimeCapsule(this.editForm);
    if (subTimeCapsule.id !== null) {
      this.subscribeToSaveResponse(this.subTimeCapsuleService.update(subTimeCapsule));
    } else {
      this.subscribeToSaveResponse(this.subTimeCapsuleService.create(subTimeCapsule));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISubTimeCapsule>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(subTimeCapsule: ISubTimeCapsule): void {
    this.subTimeCapsule = subTimeCapsule;
    this.subTimeCapsuleFormService.resetForm(this.editForm, subTimeCapsule);
  }
}
