import { apiClient, clearStoredToken, storeToken } from "./apiClient";

export type UserType = "individual" | "sme" | "company";

export interface StoredUser {
  id: string;
  fullName: string;
  companyName?: string;
  displayName: string;
  email: string;
  phone?: string;
  userType: UserType;
  role: string;
}

type RawUser = {
  id: string;
  full_name?: string | null;
  company_name?: string | null;
  email: string;
  phone?: string | null;
  user_type: string;
  role: string;
};

const USER_STORAGE_KEY = "taxSystemUser";
export const USER_CHANGED_EVENT = "tax-system-user-changed";

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

function emitUserChanged(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(USER_CHANGED_EVENT));
  }
}

function normaliseUser(raw: RawUser): StoredUser {
  const fullName = raw.full_name?.trim() || raw.company_name?.trim() || "";
  const companyName = raw.company_name?.trim() || undefined;

  return {
    id: raw.id,
    fullName,
    companyName,
    displayName: fullName || raw.email,
    email: raw.email,
    phone: raw.phone?.trim() || undefined,
    userType: raw.user_type as UserType,
    role: raw.role,
  };
}

export const getUserDisplayName = (user: StoredUser | null): string => {
  if (!user) return "Account";
  return user.displayName || user.fullName || user.email;
};

export const storeUser = (user: StoredUser): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    emitUserChanged();
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
    emitUserChanged();
  }
};

export const logoutUser = (): void => {
  clearStoredToken();
  clearStoredUser();

  if (typeof window !== "undefined") {
    localStorage.removeItem("portalType");
    localStorage.removeItem("companyVerified");
  }
};

export interface SignupInput {
  fullName: string;
  email: string;
  password: string;
  userType: UserType;
  organizationName?: string;
}

export const signupUser = async (
  input: SignupInput
): Promise<{ data: { message: string; user: StoredUser } }> => {
  try {
    const response = await apiClient.post<{
      message: string;
      user: RawUser;
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

export interface LoginInput {
  email: string;
  password: string;
}

export const loginUser = async (
  input: LoginInput
): Promise<{ data: { message: string; token: string; user: StoredUser } }> => {
  try {
    const response = await apiClient.post<{
      message: string;
      token: string;
      user: RawUser;
    }>("/auth/login", input);

    const user = normaliseUser(response.data.user);
    storeToken(response.data.token);
    storeUser(user);

    return { data: { message: response.data.message, token: response.data.token, user } };
  } catch (error) {
    throw new Error(getAuthErrorMessage(error, "Unable to login right now."));
  }
};

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

export const fetchCurrentUser = async (): Promise<{ data: { message: string; user: StoredUser } }> => {
  try {
    const response = await apiClient.get<{ message: string; user: RawUser }>("/auth/me");
    const user = normaliseUser(response.data.user);
    storeUser(user);
    return { data: { message: response.data.message, user } };
  } catch (error) {
    throw new Error(getAuthErrorMessage(error, "Unable to load your account details."));
  }
};

export interface UpdateProfileInput {
  displayName: string;
  email: string;
  phone?: string;
}

export const updateCurrentUserProfile = async (
  input: UpdateProfileInput
): Promise<{ data: { message: string; user: StoredUser } }> => {
  try {
    const response = await apiClient.put<{ message: string; user: RawUser }>("/auth/me", input);
    const user = normaliseUser(response.data.user);
    storeUser(user);
    return { data: { message: response.data.message, user } };
  } catch (error) {
    throw new Error(getAuthErrorMessage(error, "Unable to update your profile."));
  }
};

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export const changeCurrentUserPassword = async (
  input: ChangePasswordInput
): Promise<{ data: { message: string } }> => {
  try {
    const response = await apiClient.put<{ message: string }>("/auth/change-password", input);
    return { data: { message: response.data.message } };
  } catch (error) {
    throw new Error(getAuthErrorMessage(error, "Unable to change your password."));
  }
};
