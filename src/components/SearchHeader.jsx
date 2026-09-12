import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import StarField from './StarField';

export default function SearchHeader({ value, onChange, onClear }) {
  return (
    <View style={styles.hero}>
      <StarField />
      <View style={styles.brandRow}>
        <View style={styles.bolt}>
          <View style={styles.boltInner} />
        </View>
        <Text style={styles.brand}>userdorking</Text>
      </View>
      <Text style={styles.tagline}>Instant username search across 100+ platforms</Text>
      <View style={styles.inputWrap}>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder="Search username"
          placeholderTextColor="rgba(0,0,0,0.35)"
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus
          style={styles.input}
        />
        {value.length > 0 ? (
          <Pressable onPress={onClear} style={styles.clearBtn} hitSlop={8}>
            <Text style={styles.clearText}>×</Text>
          </Pressable>
        ) : null}
      </View>
      <Text style={styles.dev}>by swayampandit</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.black,
    paddingTop: 48,
    paddingBottom: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    overflow: 'hidden',
    minHeight: 260,
    justifyContent: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    zIndex: 1,
  },
  bolt: {
    width: 28,
    height: 36,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boltInner: {
    width: 0,
    height: 0,
    borderLeftWidth: 11,
    borderRightWidth: 11,
    borderBottomWidth: 22,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.yellow,
    transform: [{ rotate: '12deg' }],
  },
  brand: {
    color: colors.white,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  tagline: {
    color: colors.muted,
    fontSize: 13,
    marginBottom: 18,
    textAlign: 'center',
    zIndex: 1,
  },
  inputWrap: {
    width: '100%',
    maxWidth: 560,
    position: 'relative',
    zIndex: 1,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 36,
    height: 48,
    paddingHorizontal: 22,
    paddingRight: 44,
    fontSize: 18,
    textAlign: 'center',
    color: colors.black,
    fontWeight: '600',
  },
  clearBtn: {
    position: 'absolute',
    right: 14,
    top: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  clearText: {
    fontSize: 22,
    color: '#333',
    marginTop: -2,
  },
  dev: {
    marginTop: 14,
    color: colors.dim,
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    zIndex: 1,
  },
});
