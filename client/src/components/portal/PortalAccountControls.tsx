import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/portal-account.css";
import {
  USER_CHANGED_EVENT,
  changeCurrentUserPassword,
  fetchCurrentUser,
  getStoredUser,
  getUserDisplayName,
  logoutUser,
  type StoredUser,
  type UserType,
  updateCurrentUserProfile,
} from "../../services/authService";
import {
  getProfilePreferences,
  saveProfilePreferences,
  type ProfilePreferences,
} from "../../services/profilePreferencesService";

type AccountTab = "profile" | "security" | "settings";

type PortalAccountControlsProps = {
  portal: UserType;
};

type PortalConfig = {
  summaryPath: string;
  filingPath: string;
  loginPath: string;
  summaryLabel: string;
  filingLabel: string;
};

const portalConfig: Record<UserType, PortalConfig> = {
  individual: {
    summaryPath: "/individual/tax-summary",
    filingPath: "/individual/review-file",
    loginPath: "/individual/login",
    summaryLabel: "Tax Summary",
    filingLabel: "Review & File",
  },
  sme: {
    summaryPath: "/sme/tax-summary",
    filingPath: "/sme/file-tax",
    loginPath: "/sme/login",
    summaryLabel: "Tax Summary",
    filingLabel: "Review & File",
  },
  company: {
    summaryPath: "/company/tax-summary",
    filingPath: "/company/filing",
    loginPath: "/company/login",
    summaryLabel: "Tax Summary",
    filingLabel: "Review & File",
  },
};

function SummaryIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 5h14v14H5z" fill="none" stroke="currentColor" strokeWidth="1.8" rx="2" />
      <path d="M8 9h8M8 13h8M8 17h5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function FilingIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 7h12v10H6z" fill="none" stroke="currentColor" strokeWidth="1.8" rx="2" />
      <path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5a4 4 0 0 1 4 4v2.4c0 .8.28 1.58.79 2.2L18 15H6l1.21-1.4c.51-.62.79-1.4.79-2.2V9a4 4 0 0 1 4-4Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M10 18a2 2 0 0 0 4 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m7 10 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "A";
  }

  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("");
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error("Unable to read the selected image."));
    reader.readAsDataURL(file);
  });
}

export default function PortalAccountControls({ portal }: PortalAccountControlsProps) {
  const navigate = useNavigate();
  const config = portalConfig[portal];
  const notificationsRef = useRef<HTMLDivElement | null>(null);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  const initialUser = getStoredUser();
  const [user, setUser] = useState<StoredUser | null>(initialUser);
  const [preferences, setPreferences] = useState<ProfilePreferences>(
    () => getProfilePreferences(initialUser?.id)
  );
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AccountTab>("profile");
  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [panelError, setPanelError] = useState("");
  const [panelStatus, setPanelStatus] = useState("");
  const [profileForm, setProfileForm] = useState({
    displayName: getUserDisplayName(initialUser),
    email: initialUser?.email ?? "",
    phone: initialUser?.phone ?? "",
  });
  const [avatarPreview, setAvatarPreview] = useState(preferences.avatarDataUrl ?? "");
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [settingsForm, setSettingsForm] = useState({
    reminderEmails: preferences.reminderEmails,
    filingAlerts: preferences.filingAlerts,
    compactTopbar: preferences.compactTopbar,
  });

  useEffect(() => {
    const syncFromStorage = () => {
      const storedUser = getStoredUser();
      const nextPreferences = getProfilePreferences(storedUser?.id);

      setUser(storedUser);
      setPreferences(nextPreferences);
      setAvatarPreview(nextPreferences.avatarDataUrl ?? "");
      setSettingsForm({
        reminderEmails: nextPreferences.reminderEmails,
        filingAlerts: nextPreferences.filingAlerts,
        compactTopbar: nextPreferences.compactTopbar,
      });

      if (storedUser) {
        setProfileForm({
          displayName: getUserDisplayName(storedUser),
          email: storedUser.email,
          phone: storedUser.phone || "",
        });
      }
    };

    const handleWindowClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setNotificationsOpen(false);
      }

      if (profileMenuRef.current && !profileMenuRef.current.contains(target)) {
        setProfileMenuOpen(false);
      }
    };

    window.addEventListener(USER_CHANGED_EVENT, syncFromStorage);
    document.addEventListener("mousedown", handleWindowClick);

    return () => {
      window.removeEventListener(USER_CHANGED_EVENT, syncFromStorage);
      document.removeEventListener("mousedown", handleWindowClick);
    };
  }, []);

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const response = await fetchCurrentUser();
        const nextUser = response.data.user;
        const nextPreferences = getProfilePreferences(nextUser.id);

        setUser(nextUser);
        setPreferences(nextPreferences);
        setAvatarPreview(nextPreferences.avatarDataUrl ?? "");
        setSettingsForm({
          reminderEmails: nextPreferences.reminderEmails,
          filingAlerts: nextPreferences.filingAlerts,
          compactTopbar: nextPreferences.compactTopbar,
        });
        setProfileForm({
          displayName: getUserDisplayName(nextUser),
          email: nextUser.email,
          phone: nextUser.phone ?? "",
        });
      } catch {
        // Keep the locally stored user if the session fetch is unavailable.
      }
    };

    void loadCurrentUser();
  }, []);

  const notifications = useMemo(() => {
    const displayName = getUserDisplayName(user);

    if (portal === "company") {
      return [
        { title: "Compliance Reminder", body: "Annual filing review is ready for finance approval." },
        { title: "Tax Summary Updated", body: `${displayName} can review the latest corporate estimate.` },
        { title: "Document Check", body: "Upload confirmation slips before submitting the final return." },
      ];
    }

    if (portal === "sme") {
      return [
        { title: "Revenue Classification", body: "AI categorization finished for your latest transactions." },
        { title: "VAT Watch", body: "Estimated VAT changed after your most recent business expenses." },
        { title: "Filing Reminder", body: "Review your SME filing summary before the due date." },
      ];
    }

    return [
      { title: "Income Update", body: "New income entries were included in your tax estimate." },
      { title: "Relief Suggestion", body: "You have fresh deductions to review in your summary." },
      { title: "Filing Reminder", body: `${displayName}, your individual filing review is ready.` },
    ];
  }, [portal, user]);

  const unreadCount = notifications.length;
  const displayName = getUserDisplayName(user);
  const phoneValue = profileForm.phone;

  const openPanel = (tab: AccountTab) => {
    setActiveTab(tab);
    setPanelOpen(true);
    setPanelError("");
    setPanelStatus("");
    setNotificationsOpen(false);
    setProfileMenuOpen(false);
  };

  const handleSummaryClick = () => {
    navigate(config.summaryPath);
    setNotificationsOpen(false);
    setProfileMenuOpen(false);
  };

  const handleFilingClick = () => {
    navigate(config.filingPath);
    setNotificationsOpen(false);
    setProfileMenuOpen(false);
  };

  const handleLogout = () => {
    logoutUser();
    navigate(config.loginPath);
  };

  const handleAvatarUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setAvatarPreview(dataUrl);
      setPanelStatus("Profile picture selected. Save your profile to keep it.");
      setPanelError("");
    } catch (error) {
      setPanelError(error instanceof Error ? error.message : "Unable to use the selected image.");
    }
  };

  const handleProfileSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!profileForm.displayName.trim() || !profileForm.email.trim()) {
      setPanelError("Display name and email are required.");
      setPanelStatus("");
      return;
    }

    try {
      setProfileSaving(true);
      setPanelError("");
      const response = await updateCurrentUserProfile({
        displayName: profileForm.displayName.trim(),
        email: profileForm.email.trim(),
        phone: phoneValue.trim() || undefined,
      });

      const nextUser = response.data.user;
      const nextPreferences = nextUser.id
        ? saveProfilePreferences(nextUser.id, { avatarDataUrl: avatarPreview || undefined })
        : preferences;

      setUser(nextUser);
      setPreferences(nextPreferences);
      setPanelStatus("Profile updated successfully.");
    } catch (error) {
      setPanelError(error instanceof Error ? error.message : "Unable to update your profile.");
      setPanelStatus("");
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPanelError("Complete all password fields before saving.");
      setPanelStatus("");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPanelError("New password must be at least 8 characters long.");
      setPanelStatus("");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPanelError("New password and confirmation do not match.");
      setPanelStatus("");
      return;
    }

    try {
      setPasswordSaving(true);
      setPanelError("");
      const response = await changeCurrentUserPassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPanelStatus(response.data.message);
    } catch (error) {
      setPanelError(error instanceof Error ? error.message : "Unable to change your password.");
      setPanelStatus("");
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleSettingsSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!user?.id) {
      setPanelError("Unable to save settings right now.");
      setPanelStatus("");
      return;
    }

    setSettingsSaving(true);

    const nextPreferences = saveProfilePreferences(user.id, {
      avatarDataUrl: avatarPreview || undefined,
      reminderEmails: settingsForm.reminderEmails,
      filingAlerts: settingsForm.filingAlerts,
      compactTopbar: settingsForm.compactTopbar,
    });

    setPreferences(nextPreferences);
    setPanelStatus("Account settings saved.");
    setPanelError("");
    setSettingsSaving(false);
  };

  return (
    <>
      <div className={`portal-account ${preferences.compactTopbar ? "portal-account--compact" : ""}`}>
        <button
          type="button"
          className="portal-account__action"
          onClick={handleSummaryClick}
        >
          <span className="portal-account__icon" aria-hidden="true">
            <SummaryIcon />
          </span>
          <span className="portal-account__label">{config.summaryLabel}</span>
        </button>

        <button
          type="button"
          className="portal-account__action"
          onClick={handleFilingClick}
        >
          <span className="portal-account__icon" aria-hidden="true">
            <FilingIcon />
          </span>
          <span className="portal-account__label">{config.filingLabel}</span>
        </button>

        <div className="portal-account__popover-wrap" ref={notificationsRef}>
          <button
            type="button"
            className="portal-account__action portal-account__action--icon"
            aria-label="Open notifications"
            aria-expanded={notificationsOpen}
            onClick={() => {
              setNotificationsOpen((open) => !open);
              setProfileMenuOpen(false);
            }}
          >
            <span className="portal-account__icon" aria-hidden="true">
              <BellIcon />
            </span>
            <span className="portal-account__badge">{unreadCount}</span>
          </button>

          {notificationsOpen && (
            <div className="portal-account__popover">
              <div className="portal-account__popover-header">
                <h4>Notifications</h4>
                <span>{unreadCount} new</span>
              </div>

              <div className="portal-account__notification-list">
                {notifications.map((notification) => (
                  <article key={notification.title} className="portal-account__notification">
                    <strong>{notification.title}</strong>
                    <p>{notification.body}</p>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="portal-account__popover-wrap" ref={profileMenuRef}>
          <button
            type="button"
            className="portal-account__profile"
            aria-label="Open account menu"
            aria-expanded={profileMenuOpen}
            onClick={() => {
              setProfileMenuOpen((open) => !open);
              setNotificationsOpen(false);
            }}
          >
            {avatarPreview ? (
              <img
                className="portal-account__avatar-image"
                src={avatarPreview}
                alt={displayName}
              />
            ) : (
              <span className="portal-account__avatar-fallback">{getInitials(displayName)}</span>
            )}

            <span className="portal-account__profile-copy">
              <strong>{displayName}</strong>
              <small>{portal.toUpperCase()} Portal</small>
            </span>

            <span className="portal-account__chevron" aria-hidden="true">
              <ChevronIcon />
            </span>
          </button>

          {profileMenuOpen && (
            <div className="portal-account__menu">
              <button type="button" onClick={() => openPanel("profile")}>Edit profile</button>
              <button type="button" onClick={() => openPanel("security")}>Change password</button>
              <button type="button" onClick={() => openPanel("settings")}>Settings</button>
              <button type="button" onClick={handleLogout}>Log out</button>
            </div>
          )}
        </div>
      </div>

      {panelOpen && (
        <div
          className="portal-account__panel-backdrop"
          onClick={() => setPanelOpen(false)}
        >
          <section
            className="portal-account__panel"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="portal-account__panel-header">
              <div>
                <h3>Account Center</h3>
                <p>Manage your profile, password, and workspace preferences.</p>
              </div>

              <button
                type="button"
                className="portal-account__panel-close"
                onClick={() => setPanelOpen(false)}
              >
                x
              </button>
            </header>

            <div className="portal-account__tabs">
              <button
                type="button"
                className={activeTab === "profile" ? "active" : ""}
                onClick={() => setActiveTab("profile")}
              >
                Profile
              </button>
              <button
                type="button"
                className={activeTab === "security" ? "active" : ""}
                onClick={() => setActiveTab("security")}
              >
                Security
              </button>
              <button
                type="button"
                className={activeTab === "settings" ? "active" : ""}
                onClick={() => setActiveTab("settings")}
              >
                Settings
              </button>
            </div>

            {panelError && <p className="portal-account__message portal-account__message--error">{panelError}</p>}
            {panelStatus && <p className="portal-account__message portal-account__message--success">{panelStatus}</p>}

            {activeTab === "profile" && (
              <form className="portal-account__form" onSubmit={handleProfileSubmit}>
                <div className="portal-account__avatar-block">
                  <div className="portal-account__avatar-preview">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt={displayName} />
                    ) : (
                      <span>{getInitials(displayName)}</span>
                    )}
                  </div>

                  <label className="portal-account__upload-button">
                    <span>Change picture</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                    />
                  </label>
                </div>

                <label className="portal-account__field">
                  <span>{portal === "company" ? "Company name" : "Full name"}</span>
                  <input
                    type="text"
                    value={profileForm.displayName}
                    onChange={(event) => setProfileForm((current) => ({
                      ...current,
                      displayName: event.target.value,
                    }))}
                  />
                </label>

                <label className="portal-account__field">
                  <span>Email address</span>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(event) => setProfileForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }))}
                  />
                </label>

                <label className="portal-account__field">
                  <span>Phone number</span>
                  <input
                    type="text"
                    value={profileForm.phone}
                    placeholder="Optional"
                    onChange={(event) => setProfileForm((current) => ({
                      ...current,
                      phone: event.target.value,
                    }))}
                  />
                </label>

                <button
                  type="submit"
                  className="portal-account__primary"
                  disabled={profileSaving}
                >
                  {profileSaving ? "Saving profile..." : "Save profile"}
                </button>
              </form>
            )}

            {activeTab === "security" && (
              <form className="portal-account__form" onSubmit={handlePasswordSubmit}>
                <label className="portal-account__field">
                  <span>Current password</span>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(event) => setPasswordForm((current) => ({
                      ...current,
                      currentPassword: event.target.value,
                    }))}
                  />
                </label>

                <label className="portal-account__field">
                  <span>New password</span>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(event) => setPasswordForm((current) => ({
                      ...current,
                      newPassword: event.target.value,
                    }))}
                  />
                </label>

                <label className="portal-account__field">
                  <span>Confirm new password</span>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(event) => setPasswordForm((current) => ({
                      ...current,
                      confirmPassword: event.target.value,
                    }))}
                  />
                </label>

                <button
                  type="submit"
                  className="portal-account__primary"
                  disabled={passwordSaving}
                >
                  {passwordSaving ? "Updating password..." : "Update password"}
                </button>
              </form>
            )}

            {activeTab === "settings" && (
              <form className="portal-account__form" onSubmit={handleSettingsSubmit}>
                <label className="portal-account__toggle">
                  <input
                    type="checkbox"
                    checked={settingsForm.reminderEmails}
                    onChange={(event) => setSettingsForm((current) => ({
                      ...current,
                      reminderEmails: event.target.checked,
                    }))}
                  />
                  <span>Send reminder emails for upcoming due dates</span>
                </label>

                <label className="portal-account__toggle">
                  <input
                    type="checkbox"
                    checked={settingsForm.filingAlerts}
                    onChange={(event) => setSettingsForm((current) => ({
                      ...current,
                      filingAlerts: event.target.checked,
                    }))}
                  />
                  <span>Show filing alerts and tax-summary notices in the topbar</span>
                </label>

                <label className="portal-account__toggle">
                  <input
                    type="checkbox"
                    checked={settingsForm.compactTopbar}
                    onChange={(event) => setSettingsForm((current) => ({
                      ...current,
                      compactTopbar: event.target.checked,
                    }))}
                  />
                  <span>Use a more compact action layout on smaller screens</span>
                </label>

                <button
                  type="submit"
                  className="portal-account__primary"
                  disabled={settingsSaving}
                >
                  {settingsSaving ? "Saving settings..." : "Save settings"}
                </button>
              </form>
            )}
          </section>
        </div>
      )}
    </>
  );
}
