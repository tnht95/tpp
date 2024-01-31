export * from './user';
export * from './post';
export * from './game';
export * from './blog';
export * from './comment';

export const errHandler = async (r: Response) => {
  if (r.status >= 400 && r.status <= 500) {
    throw await r.json();
  }
  return r.json();
};
