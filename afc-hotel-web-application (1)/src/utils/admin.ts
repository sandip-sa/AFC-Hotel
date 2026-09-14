export type AdminUser = {
  username: string;
  name: string;
  role: string;
  loginAt: number;
};

const CREDS_KEY = "afc_admin_creds_v1";
const SESSION_KEY = "afc_admin_session_v1";

export const DEFAULT_CREDS = {
  username: "admin",
  password: "afc123",
  name: "AFC Manager",
  role: "Super Admin",
};

export function getAdminCreds() {
  try {
    const raw = localStorage.getItem(CREDS_KEY);
    if (raw) return JSON.parse(raw) as typeof DEFAULT_CREDS;
  } catch {}
  return { ...DEFAULT_CREDS };
}

export function saveAdminCreds(c: typeof DEFAULT_CREDS) {
  try {
    localStorage.setItem(CREDS_KEY, JSON.stringify(c));
  } catch {}
}

export function validateLogin(username: string, password: string): AdminUser | null {
  const creds = getAdminCreds();
  if (
    username.trim().toLowerCase() === creds.username.toLowerCase() &&
    password === creds.password
  ) {
    return {
      username: creds.username,
      name: creds.name,
      role: creds.role,
      loginAt: Date.now(),
    };
  }
  return null;
}

export function saveSession(user: AdminUser, remember: boolean) {
  try {
    if (remember) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
    }
  } catch {}
}

export function getSession(): AdminUser | null {
  try {
    const a = localStorage.getItem(SESSION_KEY);
    if (a) return JSON.parse(a) as AdminUser;
    const b = sessionStorage.getItem(SESSION_KEY);
    if (b) return JSON.parse(b) as AdminUser;
  } catch {}
  return null;
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  } catch {}
}

export function changePassword(current: string, next: string): { ok: boolean; msg: string } {
  const creds = getAdminCreds();
  if (current !== creds.password) return { ok: false, msg: "Current password is incorrect." };
  if (next.length < 4) return { ok: false, msg: "New password must be at least 4 characters." };
  saveAdminCreds({ ...creds, password: next });
  return { ok: true, msg: "Password updated successfully." };
}
