import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import SearchHeader from './src/components/SearchHeader';
import ResultsGrid from './src/components/ResultsGrid';
import Landing from './src/components/Landing';
import Footer from './src/components/Footer';
import { colors } from './src/theme/colors';

function sanitize(raw) {
  return String(raw || '').replace(/[^a-zA-Z0-9-_.]/g, '');
}

export default function App() {
  const [username, setUsername] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setQuery(username), 500);
    return () => clearTimeout(t);
  }, [username]);

  const onChange = useCallback((text) => {
    setUsername(sanitize(text));
  }, []);

  const onClear = useCallback(() => {
    setUsername('');
    setQuery('');
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.black} />
      <ScrollView
        stickyHeaderIndices={[0]}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <SearchHeader value={username} onChange={onChange} onClear={onClear} />
        <View style={styles.body}>
          {username.length === 0 ? (
            <Landing />
          ) : (
            <ResultsGrid
              username={username}
              pending={query !== username}
              onPickUsername={onChange}
            />
          )}
        </View>
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.ink,
  },
  content: {
    minHeight: '100%',
    backgroundColor: colors.ink,
  },
  body: {
    backgroundColor: colors.ink,
    minHeight: 420,
  },
});
