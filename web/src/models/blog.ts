export type BlogSummary = {
  id: string;
  title: string;
  description: string;
  tags: string[] | undefined;
  createdAt: string;
};

export type Blog = {
  id: string;
  title: string;
  description: string | undefined;
  content: string;
  tags: string[] | undefined;
  createdAt: string;
  updatedAt: string;
};

export type BlogRequest = {
  title: string;
  description: string;
  tags: string[] | undefined;
  content: string;
};
