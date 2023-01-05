import { IUserUploadFile, NewUserUploadFile } from './user-upload-file.model';

export const sampleWithRequiredData: IUserUploadFile = {
  id: 16930,
  filename: 'Pizza',
};

export const sampleWithPartialData: IUserUploadFile = {
  id: 7447,
  fileid: '2ceda4b9-f161-418d-8da3-d5db51940a31',
  filename: 'system',
  contentype: 'deposit',
};

export const sampleWithFullData: IUserUploadFile = {
  id: 19851,
  fileid: '47d92d78-49ee-4e23-8a8b-76ca51c586ab',
  filename: 'Unbranded web-readiness',
  contentype: 'green',
  filesize: 'Pennsylvania Producer',
  filedata: '../fake-data/blob/hipster.png',
  filedataContentType: 'unknown',
};

export const sampleWithNewData: NewUserUploadFile = {
  filename: 'Ball',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
