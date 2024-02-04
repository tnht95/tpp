export const getTagValue = (tags: string): string[] | undefined => {
  if (tags === '') return undefined;
  return tags.split(',');
};

export const getStrVal = (v: string): string | undefined => {
  if (v === '') return undefined;
  return v;
};
