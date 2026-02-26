import { ALLOWED_DOMAIN, ADMIN_EMAILS, ROLES, UserRole } from '../constants';

/** Returns true only if email ends with @hbplus.fit */
export const isAllowedDomain = (email: string): boolean => {
  if (!email) return false;
  return email.toLowerCase().trim().endsWith(`@${ALLOWED_DOMAIN}`);
};

/** Admin if in the admin list, otherwise regular user */
export const getUserRole = (email: string): UserRole => {
  if (ADMIN_EMAILS.includes(email.toLowerCase().trim())) return ROLES.ADMIN;
  return ROLES.USER;
};

/** Friendly display name from Google profile or derived from email */
export const formatDisplayName = (
  displayName: string | null,
  email: string
): string => {
  if (displayName && displayName.trim()) return displayName.trim();
  const local = email.split('@')[0];
  return local
    .replace(/[._-]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

/** Returns 2-letter initials for avatar fallback */
export const getInitials = (displayName: string): string => {
  const parts = displayName.trim().split(' ').filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return 'HB';
};
