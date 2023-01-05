import { VoteType } from 'app/entities/enumerations/vote-type.model';

import { IVote, NewVote } from './vote.model';

export const sampleWithRequiredData: IVote = {
  id: 770,
};

export const sampleWithPartialData: IVote = {
  id: 78378,
};

export const sampleWithFullData: IVote = {
  id: 72140,
  voteType: VoteType['UPVOTE'],
};

export const sampleWithNewData: NewVote = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
