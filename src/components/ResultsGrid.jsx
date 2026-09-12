import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import ResultCard from './ResultCard';
import SummaryBar from './SummaryBar';
import Suggestions from './Suggestions';
import DomainGrid from './DomainGrid';
import ExportPanel from './ExportPanel';
import { colors } from '../theme/colors';
import services, { categories } from '../data/services';
import { generateSuggestions } from '../utils/suggest';

export default function ResultsGrid({ username, pending, onPickUsername }) {
  const { width } = useWindowDimensions();
  const [filter, setFilter] = useState('All');
  const [resultsMap, setResultsMap] = useState({});
  const [domains, setDomains] = useState([]);

  useEffect(() => {
    setResultsMap({});
    setDomains([]);
  }, [username]);

  const onResult = useCallback((row) => {
    setResultsMap((prev) => ({ ...prev, [row.serviceId]: row }));
  }, []);

  const onDomains = useCallback((list) => {
    setDomains(list || []);
  }, []);

  const cols = width >= 1100 ? 5 : width >= 860 ? 4 : width >= 640 ? 3 : 2;
  const cardWidth = `${100 / cols}%`;

  const list = useMemo(() => {
    if (filter === 'All') return services;
    return services.filter((s) => s.category === filter);
  }, [filter]);

  const results = useMemo(() => Object.values(resultsMap), [resultsMap]);
  const available = results.filter((r) => r.available && !r.unknown).length;
  const unknown = results.filter((r) => r.unknown).length;
  const taken = results.filter((r) => !r.available && !r.unknown).length;
  const loading = Math.max(0, services.length - results.length);
  const suggestions = useMemo(() => generateSuggestions(username, 8), [username]);

  return (
    <View style={styles.wrap}>
      <View style={styles.meta}>
        <Text style={styles.metaTitle}>
          Checking <Text style={styles.user}>@{username}</Text>
        </Text>
        <Text style={styles.metaSub}>
          {pending
            ? 'Waiting for you to finish typing...'
            : `${list.length} platforms · results appear as each check finishes`}
        </Text>
      </View>
      <SummaryBar
        username={username}
        available={available}
        taken={taken}
        unknown={unknown}
        loading={pending ? services.length : loading}
        total={services.length}
      />
      <Suggestions items={suggestions} onPick={onPickUsername} />
      <DomainGrid username={username} spin={pending} onResults={onDomains} />
      <ExportPanel
        username={username}
        results={results}
        domains={domains}
        suggestions={suggestions}
      />
      <View style={styles.filters}>
        {['All', ...categories].map((cat) => {
          const active = filter === cat;
          return (
            <Pressable
              key={cat}
              onPress={() => setFilter(cat)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{cat}</Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.grid}>
        {list.map((service) => (
          <View key={`${service.id}-${username}`} style={[styles.cell, { width: cardWidth }]}>
            <ResultCard
              service={service}
              username={username}
              spin={pending}
              onResult={onResult}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 12,
    paddingTop: 18,
    paddingBottom: 40,
    maxWidth: 1180,
    width: '100%',
    alignSelf: 'center',
  },
  meta: {
    paddingHorizontal: 8,
    marginBottom: 14,
  },
  metaTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '700',
  },
  user: {
    color: colors.yellow,
  },
  metaSub: {
    color: colors.muted,
    marginTop: 4,
    fontSize: 13,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  chip: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  chipActive: {
    backgroundColor: colors.yellow,
    borderColor: colors.yellow,
  },
  chipText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  chipTextActive: {
    color: colors.black,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    padding: 6,
  },
});
