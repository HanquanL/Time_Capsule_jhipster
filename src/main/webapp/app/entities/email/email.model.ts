export interface IEmail {
  id: number;
  subject?: string | null;
  recipient?: string | null;
  body?: string | null;
}

export type NewEmail = Omit<IEmail, 'id'> & { id: null };
