import { api } from "./api.js";

export async function getPosts() {
  const { data } = await api.get("/posts");
  return data.posts;
}

export async function createPost(description) {
  const { data } = await api.post("/posts", { description });
  return data.post;
}

export async function updatePost(postId, description) {
  const { data } = await api.patch(`/posts/${postId}`, { description });
  return data.post;
}

export async function deletePost(postId) {
  await api.delete(`/posts/${postId}`);
}

export async function likePost(postId) {
  const { data } = await api.post(`/posts/${postId}/like`);
  return data.post;
}

export async function unlikePost(postId) {
  const { data } = await api.delete(`/posts/${postId}/like`);
  return data.post;
}
