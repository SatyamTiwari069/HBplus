import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { HBLogo } from '../components/HBLogo';
import { GoogleButton } from '../components/GoogleButton';
import { ErrorAlert } from '../components/ErrorAlert';
import { LoadingScreen } from '../components/LoadingScreen';
import { COLORS, FONT_WEIGHT, RADIUS, SPACING, ALLOWED_DOMAIN } from '../constants';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const CARD_MAX = 440;

// ─── Decorative grid ──────────────────────────────────────────────────────────
const GridLines = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {Array.from({ length: 10 }).map((_, i) => (
      <View key={`h${i}`} style={[styles.gridH, { top: `${i * 10 + 5}%` as any }]} />
    ))}
    {Array.from({ length: 10 }).map((_, i) => (
      <View key={`v${i}`} style={[styles.gridV, { left: `${i * 10 + 5}%` as any }]} />
    ))}
  </View>
);

// ─── Feature pill ─────────────────────────────────────────────────────────────
const FeaturePill = ({ icon, label, delay }: { icon: string; label: string; delay: number }) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 400, delay, useNativeDriver: true }).start();
  }, []);
  return (
    <Animated.View style={[styles.pill, { opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }] }]}>
      <Text style={styles.pillIcon}>{icon}</Text>
      <Text style={styles.pillLabel}>{label}</Text>
    </Animated.View>
  );
};

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function LoginScreen() {
  const router = useRouter();
  const { user, loading, authLoading, error, signInWithGoogle, clearError } = useAuth();

  const cardFade = useRef(new Animated.Value(0)).current;
  const cardSlide = useRef(new Animated.Value(32)).current;
  const taglineFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(cardFade, { toValue: 1, duration: 700, delay: 150, useNativeDriver: true }),
        Animated.timing(cardSlide, { toValue: 0, duration: 600, delay: 150, useNativeDriver: true }),
      ]),
      Animated.timing(taglineFade, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    if (!loading && user) router.replace('/dashboard');
  }, [user, loading]);

  if (loading) return <LoadingScreen message="Checking session…" />;

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#0a0a0a', '#0d0d0d', '#111111']}
        style={StyleSheet.absoluteFill}
      />
      <GridLines />

      {/* Ambient glow */}
      <View style={styles.ambientGlow} pointerEvents="none" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Card ──────────────────────────────────────────────────── */}
        <Animated.View
          style={[
            styles.card,
            { opacity: cardFade, transform: [{ translateY: cardSlide }] },
          ]}
        >
          {/* Gold top accent line */}
          <View style={styles.cardTopAccent} />

          {/* Logo */}
          <HBLogo size="lg" animate />

          {/* Brand name */}
          <View style={styles.brandRow}>
            <Text style={styles.brandName}>HB+ Platform</Text>
          </View>

          {/* Divider with label */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerLabel}>SECURE ACCESS PORTAL</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Sign in with your official{' '}
            <Text style={styles.domainChip}>@{ALLOWED_DOMAIN}</Text>{' '}
            Google account to continue
          </Text>

          {/* Feature pills */}
          <View style={styles.pillsRow}>
            <FeaturePill icon="🔒" label="Domain Verified" delay={600} />
            <FeaturePill icon="⚡" label="Instant Access" delay={750} />
            <FeaturePill icon="🛡️" label="OAuth 2.0" delay={900} />
          </View>

          {/* Error */}
          {error && <ErrorAlert message={error} onDismiss={clearError} />}

          {/* Sign-in button */}
          <GoogleButton
            onPress={signInWithGoogle}
            loading={authLoading}
            disabled={authLoading}
          />

          {/* Restriction notice */}
          <View style={styles.notice}>
            <Text style={styles.noticeIcon}>⚠</Text>
            <Text style={styles.noticeText}>
              Access is exclusively restricted to{' '}
              <Text style={styles.noticeDomain}>@{ALLOWED_DOMAIN}</Text>{' '}
              email addresses. All other domains will be denied.
            </Text>
          </View>

          {/* Card footer */}
          <View style={styles.cardFooter}>
            <View style={styles.footerDot} />
            <Text style={styles.footerText}>Powered by HB+ Authentication</Text>
            <View style={styles.footerDot} />
          </View>
        </Animated.View>

        {/* Tagline */}
        <Animated.Text style={[styles.tagline, { opacity: taglineFade }]}>
          Your fitness. Your data. Your control.
        </Animated.Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.black,
  },

  // Grid
  gridH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.022)',
  },
  gridV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.022)',
  },

  // Glow
  ambientGlow: {
    position: 'absolute',
    top: '15%',
    alignSelf: 'center',
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: COLORS.goldGlowSoft,
    ...(isWeb ? { filter: 'blur(90px)' as any } : {}),
  },

  // Scroll
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxxl,
    paddingHorizontal: SPACING.lg,
  },

  // Card
  card: {
    width: '100%',
    maxWidth: CARD_MAX,
    backgroundColor: COLORS.blackCard,
    borderRadius: RADIUS.xxl,
    borderWidth: 1,
    borderColor: COLORS.blackBorder,
    padding: SPACING.xxl,
    alignItems: 'center',
    gap: SPACING.lg,
    overflow: 'hidden',
    ...(isWeb
      ? {
          boxShadow: '0 0 80px rgba(201,168,76,0.07), 0 40px 80px rgba(0,0,0,0.7)' as any,
        }
      : {
          shadowColor: COLORS.gold,
          shadowOffset: { width: 0, height: 20 },
          shadowOpacity: 0.1,
          shadowRadius: 50,
          elevation: 24,
        }),
  },
  cardTopAccent: {
    position: 'absolute',
    top: 0,
    left: '20%',
    right: '20%',
    height: 2,
    backgroundColor: COLORS.gold,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    opacity: 0.7,
  },

  // Brand
  brandRow: {
    alignItems: 'center',
    marginTop: -SPACING.xs,
  },
  brandName: {
    color: COLORS.white,
    fontSize: 26,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 1,
  },

  // Divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.blackBorder,
  },
  dividerLabel: {
    color: COLORS.gold,
    fontSize: 9,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 2.5,
  },

  // Subtitle
  subtitle: {
    color: COLORS.whiteMuted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: FONT_WEIGHT.light,
  },
  domainChip: {
    color: COLORS.goldLight,
    fontWeight: FONT_WEIGHT.semibold,
    backgroundColor: COLORS.goldGlowSoft,
  },

  // Pills
  pillsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderWidth: 1,
    borderColor: COLORS.blackBorder,
  },
  pillIcon: { fontSize: 12 },
  pillLabel: {
    color: COLORS.whiteMuted,
    fontSize: 11,
    fontWeight: FONT_WEIGHT.medium,
    letterSpacing: 0.3,
  },

  // Notice
  notice: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    backgroundColor: 'rgba(255,255,255,0.025)',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  noticeIcon: { fontSize: 13, color: COLORS.warning, marginTop: 1 },
  noticeText: {
    flex: 1,
    color: COLORS.whiteSubtle,
    fontSize: 12,
    lineHeight: 18,
  },
  noticeDomain: {
    color: COLORS.whiteMuted,
    fontWeight: FONT_WEIGHT.semibold,
  },

  // Footer
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: -SPACING.xs,
  },
  footerDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.blackBorder,
  },
  footerText: {
    color: COLORS.whiteSubtle,
    fontSize: 11,
    letterSpacing: 0.5,
  },

  // Tagline
  tagline: {
    color: COLORS.whiteSubtle,
    fontSize: 12,
    letterSpacing: 2,
    marginTop: SPACING.xl,
    opacity: 0.55,
  },
});
