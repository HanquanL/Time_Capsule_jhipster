import { IEmail, NewEmail } from './email.model';

export const sampleWithRequiredData: IEmail = {
  id: 42618,
};

export const sampleWithPartialData: IEmail = {
  id: 37697,
  subject: 'interface Creative Kip',
  recipient: 'Ameliorated pixel',
};

export const sampleWithFullData: IEmail = {
  id: 24560,
  subject: 'Camp input Home',
  recipient: 'cultivate Cotton',
  body: 'Tonga Cotton',
};

export const sampleWithNewData: NewEmail = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
