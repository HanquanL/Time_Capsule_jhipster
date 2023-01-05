import dayjs from 'dayjs/esm';

import { ISubTimeCapsule, NewSubTimeCapsule } from './sub-time-capsule.model';

export const sampleWithRequiredData: ISubTimeCapsule = {
  id: 46733,
};

export const sampleWithPartialData: ISubTimeCapsule = {
  id: 61889,
  subtimecapsuleid: '9b62d2a7-6f78-44af-9c5d-e4ee2040aa69',
  subtimecapsulename: 'haptic',
  createdate: dayjs('2023-01-05T00:33'),
};

export const sampleWithFullData: ISubTimeCapsule = {
  id: 43871,
  subtimecapsuleid: '625b83c3-c44c-4c97-89b7-1c8170ad3170',
  subtimecapsulename: 'open-source Credit solid',
  description: 'olive Virginia',
  createdate: dayjs('2023-01-04T10:43'),
};

export const sampleWithNewData: NewSubTimeCapsule = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
