import api from "@/lib/axios";


export type TokenResponse = { access_token: string; token_type: string };
export type Role = "admin" | "customer";
export type User = { id?: string; username: string; disabled?: boolean; role?: Role; };

export async function login(username: string, password: string): Promise<TokenResponse> {
  const params = new URLSearchParams();
  params.append("username", username);
  params.append("password", password);
  return (await api.post("/auth/token", params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  })).data;
}

export async function registerUser(username: string, password: string): Promise<User> {
  return (await api.post("/users/", { username, password })).data;
}

export async function getCurrentUser(): Promise<User> {
  return (await api.get("/users/me")).data;
}
