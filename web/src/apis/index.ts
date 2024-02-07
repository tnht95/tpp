export * from './user';
export * from './post';
export * from './game';
export * from './blog';
export * from './comment';
export * from './discussion';
export * from './search';

export const errHandler = async (r: Response) => {
  if (r.status >= 400 && r.status <= 500) {
    throw await r.json();
  }
  return r.json();
};

export type QueryWIthTargetInput = {
  targetId: string;
  limit?: number;
  offset?: number;
};
