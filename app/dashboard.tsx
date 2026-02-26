import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  Dimensions,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { HBLogo } from '../components/HBLogo';
import { LoadingScreen } from '../components/LoadingScreen';
import { formatDisplayName, getInitials } from '../utils/domainValidator';
import {
  COLORS,
  FONT_WEIGHT,
  RADIUS,
  SPACING,
  ROLES,
} from '../constants';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const CONTENT_MAX = 680;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (val: any): string => {
  if (!val) return 'Today';
  try {
    const d = val?.toDate ? val.toDate() : new Date(val);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return 'Today';
  }
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionHeader = ({ title }: { title: string }) => (
  <View style={styles.sectionHeaderRow}>
    <Text style={styles.sectionHeaderText}>{title}</Text>
    <View style={styles.sectionHeaderLine} />
  </View>
);

const InfoRow = ({ label, value, accent }: { label: string; value: string; accent?: boolean }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={[styles.infoValue, accent && styles.infoValueAccent]}>{value}</Text>
  </View>
);

const StatCard = ({
  icon, value, label, delay, gold,
}: {
  icon: string; value: string; label: string; delay: number; gold?: boolean;
}) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 450, delay, useNativeDriver: true }).start();
  }, []);
  return (
    <Animated.View
      style={[
        styles.statCard,
        gold && styles.statCardGold,
        {
          opacity: anim,
          transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
        },
      ]}
    >
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={[styles.statValue, gold && styles.statValueGold]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
  );
};

const AdminPanel = () => {
  const items = [
    { icon: '👥', title: 'User Management', desc: 'View and manage all domain users', status: 'Active' },
    { icon: '📊', title: 'Analytics', desc: 'Login stats and user activity', status: 'Active' },
    { icon: '⚙️', title: 'System Settings', desc: 'Domain rules and access control', status: 'Active' },
    { icon: '🔐', title: 'Security Audit', desc: 'Auth logs and failed attempts', status: 'Active' },
  ];

  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 500, delay: 300, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={[styles.adminPanel, { opacity: anim }]}>
      <LinearGradient
        colors={['rgba(201,168,76,0.1)', 'rgba(201,168,76,0.02)']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <View style={styles.adminPanelTop}>
        <View style={styles.adminBadge}>
          <Text style={styles.adminBadgeText}>👑 ADMIN</Text>
        </View>
        <Text style={styles.adminPanelTitle}>Administration Panel</Text>
        <Text style={styles.adminPanelSub}>
          You have elevated permissions. The following modules are accessible to you.
        </Text>
      </View>
      {items.map((item, i) => (
        <View key={i} style={styles.adminItem}>
          <View style={styles.adminItemIconWrap}>
            <Text style={styles.adminItemIcon}>{item.icon}</Text>
          </View>
          <View style={styles.adminItemBody}>
            <Text style={styles.adminItemTitle}>{item.title}</Text>
            <Text style={styles.adminItemDesc}>{item.desc}</Text>
          </View>
          <View style={styles.adminItemStatus}>
            <View style={styles.activeIndicator} />
            <Text style={styles.activeText}>{item.status}</Text>
          </View>
        </View>
      ))}
    </Animated.View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function DashboardScreen() {
  const router = useRouter();
  const { user, appUser, loading, authLoading, signOut, isAdmin } = useAuth();
  const [confirmSignOut, setConfirmSignOut] = useState(false);

  const navAnim = useRef(new Animated.Value(0)).current;
  const heroAnim = useRef(new Animated.Value(0)).current;
  const bodyAnim = useRef(new Animated.Value(0)).current;

  // ── Guard: redirect if unauthenticated ──────────────────────────────────
  useEffect(() => {
    if (!loading && !user) router.replace('/');
  }, [user, loading]);

  // ── Entrance animation ──────────────────────────────────────────────────
  useEffect(() => {
    if (user) {
      Animated.stagger(150, [
        Animated.timing(navAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(heroAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(bodyAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]).start();
    }
  }, [user]);

  // ── Sign out with tap-twice confirm ────────────────────────────────────
  const handleSignOut = async () => {
    if (!confirmSignOut) {
      setConfirmSignOut(true);
      setTimeout(() => setConfirmSignOut(false), 3500);
      return;
    }
    await signOut();
    router.replace('/');
  };

  if (loading || !user) return <LoadingScreen message="Loading dashboard…" />;

  // ── Derived display values ──────────────────────────────────────────────
  const displayName = formatDisplayName(user.displayName, user.email || '');
  const initials = getInitials(displayName);
  const role = appUser?.role || ROLES.USER;
  const loginCount = appUser?.loginCount ?? 1;
  const lastLogin = formatDate(appUser?.lastLoginAt);
  const memberSince = formatDate(appUser?.createdAt);

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#0a0a0a', '#0f0f0f']} style={StyleSheet.absoluteFill} />

      {/* ── Navigation Bar ─────────────────────────────────────────── */}
      <Animated.View
        style={[
          styles.navbar,
          {
            opacity: navAnim,
            transform: [{ translateY: navAnim.interpolate({ inputRange: [0, 1], outputRange: [-16, 0] }) }],
          },
        ]}
      >
        <HBLogo size="sm" />
        <Text style={styles.navTitle}>Dashboard</Text>
        <View style={styles.navRight}>
          {isAdmin && (
            <View style={styles.navAdminBadge}>
              <Text style={styles.navAdminText}>ADMIN</Text>
            </View>
          )}
          <Pressable
            onPress={handleSignOut}
            disabled={authLoading}
            style={({ pressed }) => [
              styles.navSignOut,
              confirmSignOut && styles.navSignOutConfirm,
              pressed && { opacity: 0.7 },
            ]}
          >
            {authLoading ? (
              <ActivityIndicator size="small" color={COLORS.error} />
            ) : (
              <Text style={[styles.navSignOutText, confirmSignOut && styles.navSignOutTextConfirm]}>
                {confirmSignOut ? 'Confirm?' : 'Sign Out'}
              </Text>
            )}
          </Pressable>
        </View>
      </Animated.View>

      {/* ── Content ────────────────────────────────────────────────── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Profile Hero ─────────────────────────────────────────── */}
        <Animated.View
          style={[
            styles.hero,
            {
              opacity: heroAnim,
              transform: [{ translateY: heroAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(201,168,76,0.07)', 'transparent']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          />

          {/* Avatar */}
          <View style={styles.avatarContainer}>
            {user.photoURL ? (
              <Image
                source={{ uri: user.photoURL }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarInitials}>{initials}</Text>
              </View>
            )}
            <View style={[styles.roleTag, isAdmin && styles.roleTagAdmin]}>
              <Text style={[styles.roleTagText, isAdmin && styles.roleTagTextAdmin]}>
                {isAdmin ? '👑 ADMIN' : '● USER'}
              </Text>
            </View>
          </View>

          <Text style={styles.heroName}>{displayName}</Text>
          <Text style={styles.heroEmail}>{user.email}</Text>

          <View style={styles.verifiedRow}>
            <View style={styles.verifiedDot} />
            <Text style={styles.verifiedText}>Verified Domain Member · @{user.email?.split('@')[1]}</Text>
          </View>
        </Animated.View>

        {/* ── Body ─────────────────────────────────────────────────── */}
        <Animated.View style={[styles.body, { opacity: bodyAnim }]}>

          {/* Stats */}
          <View style={styles.statsRow}>
            <StatCard icon="🔑" value={String(loginCount)} label="Total Logins" delay={100} />
            <StatCard icon={isAdmin ? '👑' : '👤'} value={isAdmin ? 'Admin' : 'Member'} label="Role" delay={200} gold={isAdmin} />
            <StatCard icon="✅" value="Active" label="Status" delay={300} />
          </View>

          {/* Admin panel */}
          {isAdmin && (
            <View style={styles.section}>
              <SectionHeader title="Administration" />
              <AdminPanel />
            </View>
          )}

          {/* Account details */}
          <View style={styles.section}>
            <SectionHeader title="Account Details" />
            <View style={styles.infoCard}>
              <InfoRow label="Full Name" value={displayName} />
              <View style={styles.sep} />
              <InfoRow label="Email Address" value={user.email || '—'} />
              <View style={styles.sep} />
              <InfoRow label="Account Role" value={role.charAt(0).toUpperCase() + role.slice(1)} accent={isAdmin} />
              <View style={styles.sep} />
              <InfoRow label="Member Since" value={memberSince} />
              <View style={styles.sep} />
              <InfoRow label="Last Login" value={lastLogin} />
              <View style={styles.sep} />
              <InfoRow label="Total Sessions" value={`${loginCount} session${loginCount !== 1 ? 's' : ''}`} />
              <View style={styles.sep} />
              <InfoRow label="Auth Provider" value="Google OAuth 2.0" />
              <View style={styles.sep} />
              <InfoRow label="UID" value={user.uid.slice(0, 18) + '…'} />
            </View>
          </View>

          {/* Security */}
          <View style={styles.section}>
            <SectionHeader title="Security" />
            <View style={styles.securityCard}>
              {[
                { icon: '🔒', text: 'Session secured with Firebase ID tokens', ok: true },
                { icon: '✉️', text: `Domain-restricted to @${user.email?.split('@')[1]}`, ok: true },
                { icon: '🛡️', text: 'Google OAuth 2.0 — zero passwords stored', ok: true },
                { icon: '🔄', text: 'Automatic token refresh active', ok: true },
                { icon: '🗄️', text: 'User data stored in Cloud Firestore', ok: true },
              ].map(({ icon, text, ok }, i) => (
                <View key={i} style={styles.secRow}>
                  <Text style={styles.secIcon}>{icon}</Text>
                  <Text style={styles.secText}>{text}</Text>
                  <Text style={styles.secStatus}>{ok ? '✓' : '✗'}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Sign out button */}
          <View style={styles.section}>
            <Pressable
              onPress={handleSignOut}
              disabled={authLoading}
              style={({ pressed }) => [
                styles.signOutFull,
                confirmSignOut && styles.signOutFullConfirm,
                pressed && { opacity: 0.8 },
              ]}
            >
              {authLoading ? (
                <ActivityIndicator size="small" color={COLORS.error} />
              ) : (
                <Text style={[styles.signOutFullText, confirmSignOut && styles.signOutFullTextConfirm]}>
                  {confirmSignOut ? '⚠ Tap again to confirm sign out' : '→  Sign Out of HB+'}
                </Text>
              )}
            </Pressable>
          </View>

          {/* Footer */}
          <Text style={styles.footerNote}>
            HB+ Platform · Secured by Firebase · All rights reserved
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.black },

  // Navbar
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    paddingTop: Platform.OS === 'ios' ? 58 : SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.blackBorder,
    backgroundColor: 'rgba(10,10,10,0.97)',
    gap: SPACING.md,
  },
  navTitle: {
    flex: 1,
    color: COLORS.whiteMuted,
    fontSize: 13,
    fontWeight: FONT_WEIGHT.medium,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  navRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  navAdminBadge: {
    backgroundColor: COLORS.goldGlow,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.4)',
  },
  navAdminText: {
    color: COLORS.gold,
    fontSize: 9,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 1.5,
  },
  navSignOut: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,68,68,0.25)',
    ...(isWeb ? { cursor: 'pointer' as any } : {}),
  },
  navSignOutConfirm: {
    borderColor: COLORS.error,
    backgroundColor: COLORS.errorBg,
  },
  navSignOutText: {
    color: 'rgba(255,68,68,0.65)',
    fontSize: 12,
    fontWeight: FONT_WEIGHT.medium,
  },
  navSignOutTextConfirm: { color: COLORS.error },

  scroll: { flex: 1 },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: SPACING.xxxl,
  },

  // Hero
  hero: {
    width: '100%',
    maxWidth: CONTENT_MAX,
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    overflow: 'hidden',
  },
  avatarContainer: { position: 'relative', marginBottom: SPACING.sm },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2.5,
    borderColor: COLORS.gold,
  },
  avatarFallback: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.blackElevated,
    borderWidth: 2.5,
    borderColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    color: COLORS.gold,
    fontSize: 30,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 2,
  },
  roleTag: {
    position: 'absolute',
    bottom: -6,
    right: -8,
    backgroundColor: COLORS.blackCard,
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: COLORS.blackBorder,
  },
  roleTagAdmin: {
    borderColor: 'rgba(201,168,76,0.5)',
    backgroundColor: COLORS.goldGlowSoft,
  },
  roleTagText: {
    color: COLORS.whiteMuted,
    fontSize: 9,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 1,
  },
  roleTagTextAdmin: { color: COLORS.gold },

  heroName: {
    color: COLORS.white,
    fontSize: 26,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  heroEmail: {
    color: COLORS.whiteMuted,
    fontSize: 14,
    letterSpacing: 0.3,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.xs,
  },
  verifiedDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.success,
  },
  verifiedText: {
    color: COLORS.success,
    fontSize: 12,
    fontWeight: FONT_WEIGHT.medium,
    letterSpacing: 0.3,
  },

  // Body
  body: {
    width: '100%',
    maxWidth: CONTENT_MAX,
    paddingHorizontal: SPACING.lg,
    gap: 0,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.blackCard,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.blackBorder,
    padding: SPACING.md,
    alignItems: 'center',
    gap: 4,
  },
  statCardGold: {
    borderColor: 'rgba(201,168,76,0.3)',
    backgroundColor: COLORS.goldGlowSoft,
  },
  statIcon: { fontSize: 22, marginBottom: 2 },
  statValue: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: FONT_WEIGHT.bold,
  },
  statValueGold: { color: COLORS.gold },
  statLabel: {
    color: COLORS.whiteSubtle,
    fontSize: 10,
    letterSpacing: 0.5,
    textAlign: 'center',
  },

  // Section
  section: { marginBottom: SPACING.xl },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  sectionHeaderText: {
    color: COLORS.whiteMuted,
    fontSize: 10,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  sectionHeaderLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.blackBorder,
  },

  // Info card
  infoCard: {
    backgroundColor: COLORS.blackCard,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.blackBorder,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  infoLabel: { color: COLORS.whiteSubtle, fontSize: 13 },
  infoValue: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: FONT_WEIGHT.medium,
    maxWidth: '55%',
    textAlign: 'right',
  },
  infoValueAccent: { color: COLORS.gold },
  sep: { height: 1, backgroundColor: COLORS.blackBorder, marginHorizontal: SPACING.lg },

  // Security card
  securityCard: {
    backgroundColor: COLORS.blackCard,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.blackBorder,
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  secRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  secIcon: { fontSize: 16, width: 22 },
  secText: { flex: 1, color: COLORS.whiteMuted, fontSize: 13, lineHeight: 20 },
  secStatus: { color: COLORS.success, fontSize: 14, fontWeight: FONT_WEIGHT.bold },

  // Admin panel
  adminPanel: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.25)',
    overflow: 'hidden',
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  adminPanelTop: { gap: SPACING.sm, marginBottom: SPACING.xs },
  adminBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.goldGlow,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.4)',
  },
  adminBadgeText: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 2,
  },
  adminPanelTitle: {
    color: COLORS.goldLight,
    fontSize: 17,
    fontWeight: FONT_WEIGHT.semibold,
  },
  adminPanelSub: {
    color: COLORS.whiteMuted,
    fontSize: 13,
    lineHeight: 20,
  },
  adminItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(201,168,76,0.1)',
  },
  adminItemIconWrap: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    backgroundColor: 'rgba(201,168,76,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminItemIcon: { fontSize: 18 },
  adminItemBody: { flex: 1 },
  adminItemTitle: { color: COLORS.whiteSoft, fontSize: 13, fontWeight: FONT_WEIGHT.medium },
  adminItemDesc: { color: COLORS.whiteSubtle, fontSize: 11, marginTop: 2 },
  adminItemStatus: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  activeIndicator: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.success },
  activeText: { color: COLORS.success, fontSize: 11, fontWeight: FONT_WEIGHT.medium },

  // Sign out
  signOutFull: {
    height: 54,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,68,68,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    ...(isWeb ? { cursor: 'pointer' as any } : {}),
  },
  signOutFullConfirm: {
    borderColor: COLORS.error,
    backgroundColor: COLORS.errorBg,
  },
  signOutFullText: {
    color: 'rgba(255,68,68,0.65)',
    fontSize: 14,
    fontWeight: FONT_WEIGHT.medium,
    letterSpacing: 0.5,
  },
  signOutFullTextConfirm: { color: COLORS.error },

  footerNote: {
    color: COLORS.whiteSubtle,
    fontSize: 11,
    letterSpacing: 0.8,
    textAlign: 'center',
    marginTop: SPACING.lg,
    opacity: 0.5,
  },
});
