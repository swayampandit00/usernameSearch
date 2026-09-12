import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function Suggestions({ items, onPick }) {
  if (!items || items.length === 0) return null;
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Try similar usernames</Text>
      <View style={styles.row}>
        {items.map((name) => (
          <Pressable key={name} onPress={() => onPick(name)} style={styles.chip}>
            <Text style={styles.chipText}>@{name}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  title: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    backgroundColor: colors.card,
    borderColor: colors.yellowBorder,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    color: colors.yellow,
    fontSize: 13,
    fontWeight: '600',
  },
});
