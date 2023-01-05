import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { UserUploadFileFormService, UserUploadFileFormGroup } from './user-upload-file-form.service';
import { IUserUploadFile } from '../user-upload-file.model';
import { UserUploadFileService } from '../service/user-upload-file.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-user-upload-file-update',
  templateUrl: './user-upload-file-update.component.html',
})
export class UserUploadFileUpdateComponent implements OnInit {
  isSaving = false;
  userUploadFile: IUserUploadFile | null = null;

  usersSharedCollection: IUser[] = [];

  editForm: UserUploadFileFormGroup = this.userUploadFileFormService.createUserUploadFileFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected userUploadFileService: UserUploadFileService,
    protected userUploadFileFormService: UserUploadFileFormService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userUploadFile }) => {
      this.userUploadFile = userUploadFile;
      if (userUploadFile) {
        this.updateForm(userUploadFile);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('oneTimaCapsuleApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userUploadFile = this.userUploadFileFormService.getUserUploadFile(this.editForm);
    if (userUploadFile.id !== null) {
      this.subscribeToSaveResponse(this.userUploadFileService.update(userUploadFile));
    } else {
      this.subscribeToSaveResponse(this.userUploadFileService.create(userUploadFile));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserUploadFile>>): void {
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

  protected updateForm(userUploadFile: IUserUploadFile): void {
    this.userUploadFile = userUploadFile;
    this.userUploadFileFormService.resetForm(this.editForm, userUploadFile);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, userUploadFile.userid);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.userUploadFile?.userid)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
