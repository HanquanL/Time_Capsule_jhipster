import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { VerifTokenFormService, VerifTokenFormGroup } from './verif-token-form.service';
import { IVerifToken } from '../verif-token.model';
import { VerifTokenService } from '../service/verif-token.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-verif-token-update',
  templateUrl: './verif-token-update.component.html',
})
export class VerifTokenUpdateComponent implements OnInit {
  isSaving = false;
  verifToken: IVerifToken | null = null;

  usersSharedCollection: IUser[] = [];

  editForm: VerifTokenFormGroup = this.verifTokenFormService.createVerifTokenFormGroup();

  constructor(
    protected verifTokenService: VerifTokenService,
    protected verifTokenFormService: VerifTokenFormService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ verifToken }) => {
      this.verifToken = verifToken;
      if (verifToken) {
        this.updateForm(verifToken);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const verifToken = this.verifTokenFormService.getVerifToken(this.editForm);
    if (verifToken.id !== null) {
      this.subscribeToSaveResponse(this.verifTokenService.update(verifToken));
    } else {
      this.subscribeToSaveResponse(this.verifTokenService.create(verifToken));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVerifToken>>): void {
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

  protected updateForm(verifToken: IVerifToken): void {
    this.verifToken = verifToken;
    this.verifTokenFormService.resetForm(this.editForm, verifToken);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, verifToken.userid);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.verifToken?.userid)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
