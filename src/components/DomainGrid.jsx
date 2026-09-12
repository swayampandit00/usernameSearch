import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Linking, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';
import { API_BASE } from '../config';

export default function DomainGrid({ username, spin, onResults }) {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (spin) {
      setLoading(true);
      setDomains([]);
      if (onResults) onResults([]);
      return () => {
        cancelled = true;
      };
    }
    setLoading(true);
    fetch(`${API_BASE}/api/domains/${encodeURIComponent(username)}`)
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        const list = json.domains || [];
        setDomains(list);
        setLoading(false);
        if (onResults) onResults(list);
      })
      .catch(() => {
        if (cancelled) return;
        setDomains([]);
        setLoading(false);
        if (onResults) onResults([]);
      });
    return () => {
      cancelled = true;
    };
  }, [username, spin]);

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Domain names</Text>
      <Text style={styles.sub}>.com .io .dev .net .app .ai .xyz .co</Text>
      {loading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator color={colors.yellow} />
          <Text style={styles.loadingText}>Looking up DNS...</Text>
        </View>
      ) : (
        <View style={styles.grid}>
          {domains.map((d) => {
            const state = d.unknown ? 'unknown' : d.available ? 'available' : 'taken';
            return (
              <Pressable
                key={d.domain}
                onPress={() => Linking.openURL(`https://${d.domain}`)}
                style={[
                  styles.card,
                  state === 'available' && styles.available,
                  state === 'taken' && styles.taken,
                  state === 'unknown' && styles.unknown,
                ]}
              >
                <Text style={[styles.name, state === 'taken' && styles.nameTaken]} numberOfLines={1}>
                  {d.domain}
                </Text>
                <Text
                  style={[
                    styles.status,
                    state === 'available' && styles.statusAvail,
                    state === 'taken' && styles.statusTaken,
                  ]}
                >
                  {state === 'available' ? 'Available' : state === 'taken' ? 'Taken' : 'Unknown'}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 8,
    marginBottom: 18,
  },
  title: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  sub: {
    color: colors.dim,
    fontSize: 12,
    marginTop: 2,
    marginBottom: 10,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  loadingText: {
    color: colors.muted,
    marginLeft: 10,
    fontSize: 13,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  card: {
    width: '25%',
    minWidth: 140,
    flexGrow: 1,
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 12,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  available: {
    borderColor: colors.yellow,
    backgroundColor: colors.yellowSoft,
  },
  taken: {},
  unknown: {
    borderColor: 'rgba(138,180,255,0.4)',
  },
  name: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 13,
    marginBottom: 6,
  },
  nameTaken: {
    color: colors.takenText,
    textDecorationLine: 'line-through',
  },
  status: {
    fontSize: 12,
    color: colors.muted,
  },
  statusAvail: {
    color: colors.yellow,
    fontWeight: '700',
  },
  statusTaken: {
    color: colors.takenText,
  },
});
