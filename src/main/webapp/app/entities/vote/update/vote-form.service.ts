import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IVote, NewVote } from '../vote.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IVote for edit and NewVoteFormGroupInput for create.
 */
type VoteFormGroupInput = IVote | PartialWithRequiredKeyOf<NewVote>;

type VoteFormDefaults = Pick<NewVote, 'id'>;

type VoteFormGroupContent = {
  id: FormControl<IVote['id'] | NewVote['id']>;
  voteType: FormControl<IVote['voteType']>;
  userid: FormControl<IVote['userid']>;
  postid: FormControl<IVote['postid']>;
};

export type VoteFormGroup = FormGroup<VoteFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class VoteFormService {
  createVoteFormGroup(vote: VoteFormGroupInput = { id: null }): VoteFormGroup {
    const voteRawValue = {
      ...this.getFormDefaults(),
      ...vote,
    };
    return new FormGroup<VoteFormGroupContent>({
      id: new FormControl(
        { value: voteRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      voteType: new FormControl(voteRawValue.voteType),
      userid: new FormControl(voteRawValue.userid),
      postid: new FormControl(voteRawValue.postid),
    });
  }

  getVote(form: VoteFormGroup): IVote | NewVote {
    return form.getRawValue() as IVote | NewVote;
  }

  resetForm(form: VoteFormGroup, vote: VoteFormGroupInput): void {
    const voteRawValue = { ...this.getFormDefaults(), ...vote };
    form.reset(
      {
        ...voteRawValue,
        id: { value: voteRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): VoteFormDefaults {
    return {
      id: null,
    };
  }
}
