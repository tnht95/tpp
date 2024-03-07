export * from './user';
export * from './post';
export * from './game';
export * from './blog';
export * from './comment';
export * from './discussion';
export * from './search';
export * from './vote';
export * from './subscribe';
export * from './like';
export * from './activity';
export * from './notification';

export const errHandler = async (r: Response) => {
  if (r.status >= 400 && r.status <= 500) {
    throw new Error(JSON.stringify(await r.json()));
  }
  return r.json();
};

export type QueryWIthTargetInput = {
  targetId?: string | undefined;
  limit?: number;
  offset?: number;
};
