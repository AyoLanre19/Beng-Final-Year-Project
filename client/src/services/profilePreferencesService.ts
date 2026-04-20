export interface ProfilePreferences {
  avatarDataUrl?: string;
  reminderEmails: boolean;
  filingAlerts: boolean;
  compactTopbar: boolean;
}

const PROFILE_PREFERENCES_STORAGE_KEY = "taxSystemProfilePreferences";

const DEFAULT_PROFILE_PREFERENCES: ProfilePreferences = {
  avatarDataUrl: undefined,
  reminderEmails: true,
  filingAlerts: true,
  compactTopbar: false,
};

type PreferenceMap = Record<string, ProfilePreferences>;

function readPreferenceMap(): PreferenceMap {
  if (typeof window === "undefined") {
    return {};
  }

  const raw = localStorage.getItem(PROFILE_PREFERENCES_STORAGE_KEY);

  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw) as PreferenceMap;
  } catch {
    return {};
  }
}

function writePreferenceMap(preferences: PreferenceMap): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(PROFILE_PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
}

export const getProfilePreferences = (userId?: string | null): ProfilePreferences => {
  if (!userId) {
    return { ...DEFAULT_PROFILE_PREFERENCES };
  }

  const preferences = readPreferenceMap();

  return {
    ...DEFAULT_PROFILE_PREFERENCES,
    ...preferences[userId],
  };
};

export const saveProfilePreferences = (
  userId: string,
  updates: Partial<ProfilePreferences>
): ProfilePreferences => {
  const preferences = readPreferenceMap();
  const nextPreferences = {
    ...DEFAULT_PROFILE_PREFERENCES,
    ...preferences[userId],
    ...updates,
  };

  preferences[userId] = nextPreferences;
  writePreferenceMap(preferences);

  return nextPreferences;
};
