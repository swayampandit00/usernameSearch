import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';

function makeStars(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 2.2 + 0.6,
    opacity: Math.random() * 0.7 + 0.15,
  }));
}

export default function StarField() {
  const stars = useMemo(() => makeStars(70), []);
  return (
    <View style={styles.wrap}>
      {stars.map((s) => (
        <View
          key={s.id}
          style={[
            styles.star,
            {
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              opacity: s.opacity,
              borderRadius: s.size,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  star: {
    position: 'absolute',
    backgroundColor: '#ffffff',
  },
});
