export type MediaType =
  | "none"
  | "image"
  | "gif"
  | "video"
  | "url";

export interface BlogMedia {
  type: MediaType;
  url?: string;
  thumbnail?: string;
}

export interface BlogAuthor {
  _id: string;
  name: string;
  email?: string;
}

export interface Comment {
  _id: string;
  blog: string;
  name: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  description: string;

  media: BlogMedia;

  author: BlogAuthor;

  likesCount: number;
  commentsCount: number;

  published: boolean;

  likedByUser?: boolean;

  comments?: Comment[];

  createdAt: string;
  updatedAt: string;
}

export interface BlogFormData {
  title: string;
  description: string;
  mediaType: MediaType;
  mediaUrl: string;
  thumbnail: string;
  published: boolean;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}