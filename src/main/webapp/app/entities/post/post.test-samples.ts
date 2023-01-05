import { IPost, NewPost } from './post.model';

export const sampleWithRequiredData: IPost = {
  id: 35989,
  postname: 'Fantastic',
};

export const sampleWithPartialData: IPost = {
  id: 79841,
  postid: '9e3c6fec-51d5-47d2-a7dc-90aacde4a88a',
  postname: 'Romania Producer',
  url: 'http://sonia.org',
  votecount: 30653,
};

export const sampleWithFullData: IPost = {
  id: 74676,
  postid: 'd14a22b6-cd00-4a0c-a113-a069f9496b95',
  postname: 'Shirt deposit',
  url: 'http://rosie.name',
  descrption: 'portal Functionality',
  votecount: 80966,
};

export const sampleWithNewData: NewPost = {
  postname: 'Rubber parsing Market',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
