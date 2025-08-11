export type LoginPayload = { email: string; password: string };
export type User = { email: string };

export async function login(payload: LoginPayload): Promise<User> {
  await new Promise((r) => setTimeout(r, 300));
  return { email: payload.email };
}

export async function logout(): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
}

export async function deleteAccount(): Promise<void> {
  await new Promise((r) => setTimeout(r, 500));
}
