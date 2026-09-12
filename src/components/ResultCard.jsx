import React, { useEffect, useState } from 'react';
import { Pressable, Text, View, StyleSheet, Linking, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';
import { API_BASE } from '../config';

export default function ResultCard({ service, username, spin, onResult }) {
  const [state, setState] = useState('loading');
  const [url, setUrl] = useState(service.url.replace('{username}', username));

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const profileUrl = service.url.replace('{username}', username);
    setUrl(profileUrl);
    setState('loading');

    if (spin) {
      return () => {
        cancelled = true;
        controller.abort();
      };
    }

    async function run() {
      try {
        const res = await fetch(
          `${API_BASE}/api/check/${service.id}/${encodeURIComponent(username)}`,
          { signal: controller.signal },
        );
        const json = await res.json();
        if (cancelled) return;
        if (json.url) setUrl(json.url);
        let next = 'taken';
        if (json.unknown) next = 'unknown';
        else if (json.available) next = 'available';
        setState(next);
        if (onResult) {
          onResult({
            serviceId: service.id,
            service: service.name,
            category: service.category,
            available: !!json.available,
            unknown: !!json.unknown,
            url: json.url || profileUrl,
            status: json.status,
          });
        }
      } catch (err) {
        if (cancelled || err.name === 'AbortError') return;
        setState('unknown');
        if (onResult) {
          onResult({
            serviceId: service.id,
            service: service.name,
            category: service.category,
            available: false,
            unknown: true,
            url: profileUrl,
            status: 0,
          });
        }
      }
    }

    run();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [service.id, username, service.url, spin]);

  const open = () => {
    if (state === 'loading') return;
    Linking.openURL(url);
  };

  const statusLabel =
    state === 'loading'
      ? 'Checking...'
      : state === 'available'
        ? 'Available'
        : state === 'unknown'
          ? 'Unknown'
          : 'Taken';

  return (
    <Pressable
      onPress={open}
      style={({ hovered, pressed }) => [
        styles.card,
        state === 'loading' && styles.loading,
        state === 'available' && styles.available,
        state === 'taken' && styles.taken,
        state === 'unknown' && styles.unknown,
        (hovered || pressed) && state === 'available' && styles.availableHover,
      ]}
    >
      <View style={[styles.dot, { backgroundColor: service.color || colors.yellow }]} />
      <Text
        numberOfLines={1}
        style={[styles.title, state === 'taken' && styles.titleTaken]}
      >
        {service.name}
      </Text>
      <View style={styles.statusRow}>
        {state === 'loading' ? (
          <ActivityIndicator size="small" color={colors.yellow} />
        ) : (
          <Text
            style={[
              styles.status,
              state === 'available' && styles.statusAvailable,
              state === 'taken' && styles.statusTaken,
              state === 'unknown' && styles.statusUnknown,
            ]}
          >
            {statusLabel}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 14,
    minHeight: 88,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
  },
  loading: {
    borderColor: colors.yellow,
    borderStyle: 'dashed',
    borderWidth: 2,
  },
  available: {
    borderColor: colors.yellow,
    borderWidth: 1.5,
    backgroundColor: colors.yellowSoft,
  },
  availableHover: {
    backgroundColor: 'rgba(255,235,59,0.22)',
  },
  taken: {
    borderColor: 'rgba(255,255,255,0.08)',
  },
  unknown: {
    borderColor: 'rgba(138,180,255,0.45)',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  title: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
  },
  titleTaken: {
    color: colors.takenText,
    textDecorationLine: 'line-through',
  },
  statusRow: {
    minHeight: 18,
    justifyContent: 'center',
  },
  status: {
    fontSize: 12,
    color: colors.muted,
  },
  statusAvailable: {
    color: colors.yellow,
    fontWeight: '700',
  },
  statusTaken: {
    color: colors.takenText,
  },
  statusUnknown: {
    color: '#8ab4ff',
    fontWeight: '700',
  },
});
