import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function SummaryBar({ username, available, taken, unknown, loading, total }) {
  const done = available + taken + unknown;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <View style={styles.stat}>
          <Text style={styles.numAvail}>{available}</Text>
          <Text style={styles.label}>available</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.numTaken}>{taken}</Text>
          <Text style={styles.label}>taken</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.numUnk}>{unknown}</Text>
          <Text style={styles.label}>unknown</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.numLoad}>{loading}</Text>
          <Text style={styles.label}>checking</Text>
        </View>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%` }]} />
      </View>
      <Text style={styles.hint}>
        @{username} · {done}/{total} platforms scanned
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 8,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  numAvail: {
    color: colors.yellow,
    fontSize: 22,
    fontWeight: '800',
  },
  numTaken: {
    color: colors.takenText,
    fontSize: 22,
    fontWeight: '800',
  },
  numUnk: {
    color: '#8ab4ff',
    fontSize: 22,
    fontWeight: '800',
  },
  numLoad: {
    color: colors.muted,
    fontSize: 22,
    fontWeight: '800',
  },
  label: {
    color: colors.dim,
    fontSize: 11,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  track: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 2,
    marginTop: 14,
    overflow: 'hidden',
  },
  fill: {
    height: 4,
    backgroundColor: colors.yellow,
    borderRadius: 2,
  },
  hint: {
    color: colors.dim,
    fontSize: 12,
    marginTop: 8,
  },
});
