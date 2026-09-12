const SUFFIXES = ['hq', 'app', 'dev', 'io', 'hq', 'lab', 'co', 'now', 'ly'];
const PREFIXES = ['the', 'get', 'hey', 'its', 'real'];

function uniq(list) {
  const seen = new Set();
  const out = [];
  list.forEach((item) => {
    const key = item.toLowerCase();
    if (!key || seen.has(key)) return;
    seen.add(key);
    out.push(item);
  });
  return out;
}

export function generateSuggestions(username, limit = 10) {
  const base = String(username || '').replace(/[^a-zA-Z0-9-_.]/g, '');
  if (!base) return [];
  const year = new Date().getFullYear().toString().slice(-2);
  const extra = [];
  extra.push(`${base}_`);
  extra.push(`${base}1`);
  extra.push(`${base}2`);
  extra.push(`${base}${year}`);
  extra.push(`${base}hq`);
  extra.push(`${base}app`);
  extra.push(`${base}dev`);
  extra.push(`${base}io`);
  extra.push(`the${base}`);
  extra.push(`real${base}`);
  extra.push(`its${base}`);
  extra.push(`get${base}`);
  extra.push(`${base}official`);
  extra.push(`${base}x`);
  PREFIXES.forEach((p) => extra.push(`${p}${base}`));
  SUFFIXES.forEach((s) => extra.push(`${base}${s}`));
  return uniq(extra)
    .filter((s) => s.toLowerCase() !== base.toLowerCase())
    .filter((s) => s.length >= 2 && s.length <= 30)
    .slice(0, limit);
}
