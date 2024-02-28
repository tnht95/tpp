export * from './game';
export * from './auth';
export * from './post';
export * from './blog';
export * from './user';
export * from './comment';
export * from './discussion';
export * from './search';
export * from './vote';
export * from './like';
export * from './activity';
export * from './notification';

export type Response<T> = {
  data: T;
};

export type RespErr = {
  code: string;
  msg: string;
};
