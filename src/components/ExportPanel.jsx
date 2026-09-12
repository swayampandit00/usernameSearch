import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { EXPORT_FORMATS, buildExport, downloadExport } from '../utils/exportResults';

export default function ExportPanel({ username, results, domains, suggestions }) {
  const [picked, setPicked] = useState('json');
  const [note, setNote] = useState('');

  const ready = (results || []).length > 0;

  const runExport = () => {
    if (!ready) {
      setNote('Wait until at least one result finishes.');
      return;
    }
    const format = EXPORT_FORMATS.find((f) => f.id === picked) || EXPORT_FORMATS[0];
    const payload = {
      username,
      generatedAt: new Date().toISOString(),
      results,
      domains,
      suggestions,
    };
    const content = buildExport(payload, format.id);
    const filename = `userdorking-${username}.${format.ext}`;
    const ok = downloadExport(filename, content, format.mime);
    setNote(ok ? `Saved ${filename}` : 'Download is available in the web preview.');
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Export results</Text>
      <Text style={styles.sub}>Choose a file type, then download the scan.</Text>
      <View style={styles.row}>
        {EXPORT_FORMATS.map((fmt) => {
          const active = picked === fmt.id;
          return (
            <Pressable
              key={fmt.id}
              onPress={() => setPicked(fmt.id)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{fmt.label}</Text>
            </Pressable>
          );
        })}
      </View>
      <Pressable onPress={runExport} style={styles.btn}>
        <Text style={styles.btnText}>Download .{EXPORT_FORMATS.find((f) => f.id === picked).ext}</Text>
      </Pressable>
      {note ? <Text style={styles.note}>{note}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 8,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  title: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  sub: {
    color: colors.dim,
    fontSize: 12,
    marginTop: 4,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  chip: {
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 6,
    marginBottom: 6,
    backgroundColor: colors.cardAlt,
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
    fontWeight: '700',
  },
  chipTextActive: {
    color: colors.black,
  },
  btn: {
    alignSelf: 'flex-start',
    backgroundColor: colors.yellow,
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  btnText: {
    color: colors.black,
    fontWeight: '800',
    fontSize: 14,
  },
  note: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 10,
  },
});
