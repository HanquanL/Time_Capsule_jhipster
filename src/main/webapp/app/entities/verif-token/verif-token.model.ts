import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface IVerifToken {
  id: number;
  tokenid?: string | null;
  token?: string | null;
  expirydate?: dayjs.Dayjs | null;
  userid?: Pick<IUser, 'id'> | null;
}

export type NewVerifToken = Omit<IVerifToken, 'id'> & { id: null };
