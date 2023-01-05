import { IUser } from 'app/entities/user/user.model';
import { ISubTimeCapsule } from 'app/entities/sub-time-capsule/sub-time-capsule.model';

export interface IPost {
  id: number;
  postid?: string | null;
  postname?: string | null;
  url?: string | null;
  descrption?: string | null;
  votecount?: number | null;
  userid?: Pick<IUser, 'id'> | null;
  subTimeCapsule?: Pick<ISubTimeCapsule, 'id'> | null;
}

export type NewPost = Omit<IPost, 'id'> & { id: null };
