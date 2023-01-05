import { IUser } from 'app/entities/user/user.model';

export interface IUserUploadFile {
  id: number;
  fileid?: string | null;
  filename?: string | null;
  contentype?: string | null;
  filesize?: string | null;
  filedata?: string | null;
  filedataContentType?: string | null;
  userid?: Pick<IUser, 'id'> | null;
}

export type NewUserUploadFile = Omit<IUserUploadFile, 'id'> & { id: null };
