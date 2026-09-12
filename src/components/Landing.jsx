import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

const rows = [
  {
    id: 'idea',
    mark: '01',
    title: 'A new idea? We got your back.',
    body: 'Type once. Instantly see if your dream handle is free on GitHub, Instagram, TikTok, YouTube and 100+ more.',
  },
  {
    id: 'one',
    mark: '02',
    title: 'One tool to check them all',
    body: 'Claim the same username everywhere so people can find you. Results stream in while you type.',
  },
  {
    id: 'go',
    mark: '03',
    title: 'Ready to start?',
    body: 'Tap any Available card to open the signup page. Taken names stay crossed out so you skip the dead ends.',
  },
];

export default function Landing() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.h2}>Get the same username everywhere</Text>
      <Text style={styles.lead}>
        userdorking checks 100+ social, creator and developer platforms and tells you if your
        username is available. Results appear here as you type.
      </Text>
      {rows.map((row) => (
        <View key={row.id} style={styles.row}>
          <Text style={styles.mark}>{row.mark}</Text>
          <View style={styles.col}>
            <Text style={styles.h3}>{row.title}</Text>
            <Text style={styles.p}>{row.body}</Text>
          </View>
        </View>
      ))}
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statN}>100+</Text>
          <Text style={styles.statL}>platforms</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statN}>live</Text>
          <Text style={styles.statL}>as you type</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statN}>free</Text>
          <Text style={styles.statL}>no signup</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 24,
    paddingVertical: 36,
    maxWidth: 760,
    width: '100%',
    alignSelf: 'center',
  },
  h2: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginBottom: 10,
    textAlign: 'center',
  },
  lead: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 32,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 22,
    alignItems: 'flex-start',
  },
  mark: {
    color: colors.yellow,
    fontSize: 18,
    fontWeight: '800',
    width: 44,
    paddingTop: 2,
  },
  col: {
    flex: 1,
  },
  h3: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  p: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  stats: {
    flexDirection: 'row',
    marginTop: 18,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    paddingTop: 22,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statN: {
    color: colors.yellow,
    fontSize: 22,
    fontWeight: '800',
  },
  statL: {
    color: colors.dim,
    fontSize: 12,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
