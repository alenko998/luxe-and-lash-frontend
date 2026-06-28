import client from "./client";

export const register = (data) => client.post("/auth/register", data);
export const login    = (data) => client.post("/auth/login", data);
export const forgotPassword = (email) => client.post("/auth/forgot-password", { email });
export const resetPassword  = (data)  => client.post("/auth/reset-password", data);