import { IUser } from 'app/entities/user/user.model';
import { IPost } from 'app/entities/post/post.model';
import { VoteType } from 'app/entities/enumerations/vote-type.model';

export interface IVote {
  id: number;
  voteType?: VoteType | null;
  userid?: Pick<IUser, 'id'> | null;
  postid?: Pick<IPost, 'id'> | null;
}

export type NewVote = Omit<IVote, 'id'> & { id: null };
