import dayjs from 'dayjs/esm';

export interface ISubTimeCapsule {
  id: number;
  subtimecapsuleid?: string | null;
  subtimecapsulename?: string | null;
  description?: string | null;
  createdate?: dayjs.Dayjs | null;
}

export type NewSubTimeCapsule = Omit<ISubTimeCapsule, 'id'> & { id: null };
