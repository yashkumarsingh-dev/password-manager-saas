import api from "./api";
import axios from "axios";

export async function register(email, password) {
  const res = await api.post("/auth/register", { email, password });
  return res.data;
}

export async function login(email, password, token) {
  const res = await api.post("/auth/login", { email, password, token });
  return res.data;
}

export async function verify2FA(email, token) {
  const res = await api.post("/auth/verify-2fa", { email, token });
  return res.data;
}

export async function requestPasswordReset(email) {
  const res = await api.post("/auth/request-reset", { email });
  return res.data;
}

export async function resetPassword(token, password) {
  const res = await api.post("/auth/reset-password", { token, password });
  return res.data;
}
