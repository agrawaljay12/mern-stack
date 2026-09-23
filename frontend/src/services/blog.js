import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getBlogs = (params = {}) =>
  api.get("/blogs", {
    params,
  });

export const getBlogBySlug = (slug) =>
  api.get(`/blogs/${slug}`);

export const getAdminBlogs = () =>
  api.get("/blogs/admin/all");

export const createBlog = (data) =>
  api.post("/blogs", data);

export const updateBlog = (id, data) =>
  api.put(`/blogs/${id}`, data);

export const deleteBlog = (id) =>
  api.delete(`/blogs/${id}`);

export const toggleLike = (blogId) =>
  api.post(`/blogs/${blogId}`);

export const addComment = (blogId, text) =>
  api.post(`/comments/${blogId}`, {
    text,
  });

export const deleteComment = (commentId) =>
  api.delete(`/comments/${commentId}`);