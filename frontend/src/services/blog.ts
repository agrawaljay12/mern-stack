import api from "../config/api/axios";

import type {
  Blog,
  BlogFormData,
  Comment,
  Pagination,
} from "../types/blog";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

interface BlogsResponse {
  data: Blog[];
  pagination: Pagination;
}

export const getBlogs = async (
  page = 1,
  limit = 12,
  search = ""
): Promise<BlogsResponse> => {
  const response = await api.get<ApiResponse<Blog[]>>(
    "/blogs",
    {
      params: {
        page,
        limit,
        search,
      },
    }
  );

  return {
    data: response.data.data,
    pagination:
      (
        response.data as ApiResponse<Blog[]> & {
          pagination: Pagination;
        }
      ).pagination,
  };
};

export const getBlogBySlug = async (
  slug: string
): Promise<Blog> => {
  const response = await api.get<ApiResponse<Blog>>(
    `/blogs/${slug}`
  );

  return response.data.data;
};

export const getAdminBlogs = async (): Promise<
  Blog[]
> => {
  const response = await api.get<ApiResponse<Blog[]>>(
    "/blogs/admin/all"
  );

  return response.data.data;
};

export const createBlog = async (
  data: BlogFormData
): Promise<Blog> => {
  const response = await api.post<ApiResponse<Blog>>(
    "/blogs",
    data
  );

  return response.data.data;
};

export const updateBlog = async (
  id: string,
  data: BlogFormData
): Promise<Blog> => {
  const response = await api.put<ApiResponse<Blog>>(
    `/blogs/admin/${id}`,
    data
  );

  return response.data.data;
};

export const deleteBlog = async (
  id: string
): Promise<void> => {
  await api.delete(`/blogs/${id}`);
};

export const toggleLike = async (
  blogId: string
): Promise<{
  liked: boolean;
}> => {
  const response = await api.post<
    ApiResponse<{ liked: boolean }>
  >(`/blogs/${blogId}/like`);

  return response.data.data;
};

export const addComment = async (
  blogId: string,
  name: string,
  text: string
): Promise<Comment> => {
  const response = await api.post<ApiResponse<Comment>>(
    `/blogs/${blogId}/comments`,
    {
      name,
      text,
    }
  );

  return response.data.data;
};