import dayjs from 'dayjs/esm';

import { IVerifToken, NewVerifToken } from './verif-token.model';

export const sampleWithRequiredData: IVerifToken = {
  id: 32361,
};

export const sampleWithPartialData: IVerifToken = {
  id: 44278,
  token: 'Idaho Islands object-oriented',
  expirydate: dayjs('2023-01-04T18:33'),
};

export const sampleWithFullData: IVerifToken = {
  id: 73144,
  tokenid: '8db38302-36b8-4e73-b275-65d8df56e1fe',
  token: 'quantify Account calculate',
  expirydate: dayjs('2023-01-04T13:25'),
};

export const sampleWithNewData: NewVerifToken = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
