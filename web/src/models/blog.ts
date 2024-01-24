export type Blog = {
  id: string;
  title: string;
  description: string;
  tags: string[] | null;
  createdAt: string;
};

export type BlogDetails = {
  id: string;
  title: string;
  description: string | null;
  content: string;
  tags: string[] | null;
  createdAt: string;
  updatedAt: string;
};
