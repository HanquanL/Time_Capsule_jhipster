import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IUserUploadFile, NewUserUploadFile } from '../user-upload-file.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUserUploadFile for edit and NewUserUploadFileFormGroupInput for create.
 */
type UserUploadFileFormGroupInput = IUserUploadFile | PartialWithRequiredKeyOf<NewUserUploadFile>;

type UserUploadFileFormDefaults = Pick<NewUserUploadFile, 'id'>;

type UserUploadFileFormGroupContent = {
  id: FormControl<IUserUploadFile['id'] | NewUserUploadFile['id']>;
  fileid: FormControl<IUserUploadFile['fileid']>;
  filename: FormControl<IUserUploadFile['filename']>;
  contentype: FormControl<IUserUploadFile['contentype']>;
  filesize: FormControl<IUserUploadFile['filesize']>;
  filedata: FormControl<IUserUploadFile['filedata']>;
  filedataContentType: FormControl<IUserUploadFile['filedataContentType']>;
  userid: FormControl<IUserUploadFile['userid']>;
};

export type UserUploadFileFormGroup = FormGroup<UserUploadFileFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UserUploadFileFormService {
  createUserUploadFileFormGroup(userUploadFile: UserUploadFileFormGroupInput = { id: null }): UserUploadFileFormGroup {
    const userUploadFileRawValue = {
      ...this.getFormDefaults(),
      ...userUploadFile,
    };
    return new FormGroup<UserUploadFileFormGroupContent>({
      id: new FormControl(
        { value: userUploadFileRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      fileid: new FormControl(userUploadFileRawValue.fileid),
      filename: new FormControl(userUploadFileRawValue.filename, {
        validators: [Validators.required],
      }),
      contentype: new FormControl(userUploadFileRawValue.contentype),
      filesize: new FormControl(userUploadFileRawValue.filesize),
      filedata: new FormControl(userUploadFileRawValue.filedata),
      filedataContentType: new FormControl(userUploadFileRawValue.filedataContentType),
      userid: new FormControl(userUploadFileRawValue.userid),
    });
  }

  getUserUploadFile(form: UserUploadFileFormGroup): IUserUploadFile | NewUserUploadFile {
    return form.getRawValue() as IUserUploadFile | NewUserUploadFile;
  }

  resetForm(form: UserUploadFileFormGroup, userUploadFile: UserUploadFileFormGroupInput): void {
    const userUploadFileRawValue = { ...this.getFormDefaults(), ...userUploadFile };
    form.reset(
      {
        ...userUploadFileRawValue,
        id: { value: userUploadFileRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): UserUploadFileFormDefaults {
    return {
      id: null,
    };
  }
}
