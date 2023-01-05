import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IVerifToken, NewVerifToken } from '../verif-token.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IVerifToken for edit and NewVerifTokenFormGroupInput for create.
 */
type VerifTokenFormGroupInput = IVerifToken | PartialWithRequiredKeyOf<NewVerifToken>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IVerifToken | NewVerifToken> = Omit<T, 'expirydate'> & {
  expirydate?: string | null;
};

type VerifTokenFormRawValue = FormValueOf<IVerifToken>;

type NewVerifTokenFormRawValue = FormValueOf<NewVerifToken>;

type VerifTokenFormDefaults = Pick<NewVerifToken, 'id' | 'expirydate'>;

type VerifTokenFormGroupContent = {
  id: FormControl<VerifTokenFormRawValue['id'] | NewVerifToken['id']>;
  tokenid: FormControl<VerifTokenFormRawValue['tokenid']>;
  token: FormControl<VerifTokenFormRawValue['token']>;
  expirydate: FormControl<VerifTokenFormRawValue['expirydate']>;
  userid: FormControl<VerifTokenFormRawValue['userid']>;
};

export type VerifTokenFormGroup = FormGroup<VerifTokenFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class VerifTokenFormService {
  createVerifTokenFormGroup(verifToken: VerifTokenFormGroupInput = { id: null }): VerifTokenFormGroup {
    const verifTokenRawValue = this.convertVerifTokenToVerifTokenRawValue({
      ...this.getFormDefaults(),
      ...verifToken,
    });
    return new FormGroup<VerifTokenFormGroupContent>({
      id: new FormControl(
        { value: verifTokenRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      tokenid: new FormControl(verifTokenRawValue.tokenid),
      token: new FormControl(verifTokenRawValue.token),
      expirydate: new FormControl(verifTokenRawValue.expirydate),
      userid: new FormControl(verifTokenRawValue.userid),
    });
  }

  getVerifToken(form: VerifTokenFormGroup): IVerifToken | NewVerifToken {
    return this.convertVerifTokenRawValueToVerifToken(form.getRawValue() as VerifTokenFormRawValue | NewVerifTokenFormRawValue);
  }

  resetForm(form: VerifTokenFormGroup, verifToken: VerifTokenFormGroupInput): void {
    const verifTokenRawValue = this.convertVerifTokenToVerifTokenRawValue({ ...this.getFormDefaults(), ...verifToken });
    form.reset(
      {
        ...verifTokenRawValue,
        id: { value: verifTokenRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): VerifTokenFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      expirydate: currentTime,
    };
  }

  private convertVerifTokenRawValueToVerifToken(
    rawVerifToken: VerifTokenFormRawValue | NewVerifTokenFormRawValue
  ): IVerifToken | NewVerifToken {
    return {
      ...rawVerifToken,
      expirydate: dayjs(rawVerifToken.expirydate, DATE_TIME_FORMAT),
    };
  }

  private convertVerifTokenToVerifTokenRawValue(
    verifToken: IVerifToken | (Partial<NewVerifToken> & VerifTokenFormDefaults)
  ): VerifTokenFormRawValue | PartialWithRequiredKeyOf<NewVerifTokenFormRawValue> {
    return {
      ...verifToken,
      expirydate: verifToken.expirydate ? verifToken.expirydate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
