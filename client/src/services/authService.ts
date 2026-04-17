import { apiClient, storeToken } from "./apiClient";

export type UserType = "individual" | "sme" | "company";

interface StoredUser {
  id: string;
  fullName: string;
  email: string;
  userType: UserType;
  role: string;
}

const USER_STORAGE_KEY = "taxSystemUser";

function getAuthErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    if (typeof response?.data?.message === "string" && response.data.message.length > 0) {
      return response.data.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export const storeUser = (user: StoredUser): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }
};

export const getStoredUser = (): StoredUser | null => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
};

export const clearStoredUser = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(USER_STORAGE_KEY);
  }
};

interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  userType: UserType;
  role: string;
}

function normaliseUser(raw: {
  id: string;
  full_name: string;
  email: string;
  user_type: string;
  role: string;
}): AuthUser {
  return {
    id: raw.id,
    fullName: raw.full_name,
    email: raw.email,
    userType: raw.user_type as UserType,
    role: raw.role,
  };
}

// ─── Signup ────────────────────────────────────────────────────────────────

export interface SignupInput {
  fullName: string;
  email: string;
  password: string;
  userType: UserType;
  organizationName?: string;
}

export const signupUser = async (
  input: SignupInput
): Promise<{ data: { message: string; user: AuthUser } }> => {
  try {
    const response = await apiClient.post<{
      message: string;
      user: { id: string; full_name: string; email: string; user_type: string; role: string };
    }>("/auth/signup", {
      fullName: input.fullName,
      email: input.email,
      password: input.password,
      userType: input.userType,
    });

    return { data: { message: response.data.message, user: normaliseUser(response.data.user) } };
  } catch (error) {
    throw new Error(getAuthErrorMessage(error, "Unable to create your account."));
  }
};

// ─── Login ─────────────────────────────────────────────────────────────────

export interface LoginInput {
  email: string;
  password: string;
}

export const loginUser = async (
  input: LoginInput
): Promise<{ data: { message: string; token: string; user: AuthUser } }> => {
  try {
    const response = await apiClient.post<{
      message: string;
      token: string;
      user: { id: string; full_name: string; email: string; user_type: string; role: string };
    }>("/auth/login", input);

    const user = normaliseUser(response.data.user);
    storeToken(response.data.token);
    storeUser(user);

    return { data: { message: response.data.message, token: response.data.token, user } };
  } catch (error) {
    throw new Error(getAuthErrorMessage(error, "Unable to login right now."));
  }
};

// ─── Company verification ──────────────────────────────────────────────────

export interface CompanyVerifyInput {
  companyName: string;
  email: string;
  password: string;
  cacNumber: string;
  phone: string;
}

export const verifyCompany = async (
  input: CompanyVerifyInput
): Promise<{ data: { message: string } }> => {
  try {
    const response = await apiClient.post<{ message: string }>("/company/verify", input);
    return { data: { message: response.data.message } };
  } catch (error) {
    throw new Error(getAuthErrorMessage(error, "Unable to submit company verification."));
  }
};