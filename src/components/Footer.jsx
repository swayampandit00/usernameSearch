import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <View style={styles.wrap}>
      <View style={styles.line} />
      <Text style={styles.copy}>© {year} userdorking · developed by swayampandit</Text>
      <Text style={styles.note}>Check availability before you brand. Results are best-effort.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  line: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    width: '100%',
    maxWidth: 760,
    marginBottom: 18,
  },
  copy: {
    color: colors.muted,
    fontSize: 13,
  },
  note: {
    color: colors.dim,
    fontSize: 11,
    marginTop: 6,
  },
});
