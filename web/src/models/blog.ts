export type BlogSummary = {
  id: string;
  title: string;
  description: string;
  tags: string[] | null;
  createdAt: string;
};

export type Blog = {
  id: string;
  title: string;
  description: string | null;
  content: string;
  tags: string[] | null;
  createdAt: string;
  updatedAt: string;
};

export type BlogRequest = {
  title: string;
  description: string;
  tags: string[] | undefined;
  content: string;
};
