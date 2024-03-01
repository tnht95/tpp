const tagEx = /@([\dA-Za-z]+-?[\dA-Za-z]*)/g;
export const highlight = (content: string) =>
  content.replaceAll(tagEx, (_, p1) => `[***@${p1}***](/users/name/${p1})`);
