export * from './game';
export * from './auth';
export * from './post';
export * from './blog';
export * from './user';
export * from './comment';

export type Response<T> = {
  data: T;
};

export type ResponseErr = {
  code: string;
  msg: string;
};
