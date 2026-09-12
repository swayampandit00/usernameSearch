function csvEscape(value) {
  const text = String(value ?? '');
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function xmlEscape(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function yamlEscape(value) {
  const text = String(value ?? '');
  if (/[:#\n"-]/.test(text) || text === '') return JSON.stringify(text);
  return text;
}

function statusOf(row) {
  if (row.unknown) return 'unknown';
  if (row.available) return 'available';
  return 'taken';
}

function rowsFrom(payload) {
  const platforms = (payload.results || []).map((r) => ({
    type: 'platform',
    name: r.service || r.name,
    status: statusOf(r),
    url: r.url || '',
    category: r.category || '',
  }));
  const domains = (payload.domains || []).map((d) => ({
    type: 'domain',
    name: d.domain,
    status: d.unknown ? 'unknown' : d.available ? 'available' : 'taken',
    url: `https://${d.domain}`,
    category: 'Domain',
  }));
  return [...platforms, ...domains];
}

export const EXPORT_FORMATS = [
  { id: 'json', label: 'JSON', ext: 'json', mime: 'application/json' },
  { id: 'csv', label: 'CSV', ext: 'csv', mime: 'text/csv' },
  { id: 'txt', label: 'TXT', ext: 'txt', mime: 'text/plain' },
  { id: 'md', label: 'Markdown', ext: 'md', mime: 'text/markdown' },
  { id: 'html', label: 'HTML', ext: 'html', mime: 'text/html' },
  { id: 'xml', label: 'XML', ext: 'xml', mime: 'application/xml' },
  { id: 'yaml', label: 'YAML', ext: 'yaml', mime: 'text/yaml' },
];

export function buildExport(payload, formatId) {
  const username = payload.username || 'user';
  const generatedAt = payload.generatedAt || new Date().toISOString();
  const rows = rowsFrom(payload);
  const available = rows.filter((r) => r.status === 'available');
  const taken = rows.filter((r) => r.status === 'taken');
  const unknown = rows.filter((r) => r.status === 'unknown');

  if (formatId === 'json') {
    return JSON.stringify(
      {
        app: 'userdorking',
        developer: 'swayampandit',
        username,
        generatedAt,
        summary: {
          available: available.length,
          taken: taken.length,
          unknown: unknown.length,
          total: rows.length,
        },
        results: payload.results || [],
        domains: payload.domains || [],
        suggestions: payload.suggestions || [],
      },
      null,
      2,
    );
  }

  if (formatId === 'csv') {
    const header = ['type', 'name', 'status', 'category', 'url'];
    const body = rows.map((r) =>
      [r.type, r.name, r.status, r.category, r.url].map(csvEscape).join(','),
    );
    return [header.join(','), ...body].join('\n');
  }

  if (formatId === 'txt') {
    const lines = [
      `userdorking report for @${username}`,
      `generated ${generatedAt}`,
      `available ${available.length} | taken ${taken.length} | unknown ${unknown.length}`,
      '',
      ...rows.map((r) => `[${r.status.toUpperCase()}] ${r.name}  ${r.url}`),
    ];
    return lines.join('\n');
  }

  if (formatId === 'md') {
    const table = [
      '| Type | Name | Status | URL |',
      '| --- | --- | --- | --- |',
      ...rows.map((r) => `| ${r.type} | ${r.name} | ${r.status} | ${r.url} |`),
    ];
    return [
      `# userdorking — @${username}`,
      '',
      `Generated ${generatedAt} by swayampandit`,
      '',
      `- Available: ${available.length}`,
      `- Taken: ${taken.length}`,
      `- Unknown: ${unknown.length}`,
      '',
      ...table,
    ].join('\n');
  }

  if (formatId === 'html') {
    const tr = rows
      .map(
        (r) =>
          `<tr><td>${xmlEscape(r.type)}</td><td>${xmlEscape(r.name)}</td><td>${xmlEscape(
            r.status,
          )}</td><td><a href="${xmlEscape(r.url)}">${xmlEscape(r.url)}</a></td></tr>`,
      )
      .join('');
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>userdorking @${xmlEscape(
      username,
    )}</title><style>body{font-family:sans-serif;background:#111;color:#eee;padding:24px}h1{color:#ffeb3b}table{border-collapse:collapse;width:100%}td,th{border:1px solid #333;padding:8px;text-align:left}a{color:#ffeb3b}</style></head><body><h1>userdorking @${xmlEscape(
      username,
    )}</h1><p>Available ${available.length} · Taken ${taken.length} · Unknown ${unknown.length}</p><p>Generated ${xmlEscape(
      generatedAt,
    )} by swayampandit</p><table><thead><tr><th>Type</th><th>Name</th><th>Status</th><th>URL</th></tr></thead><tbody>${tr}</tbody></table></body></html>`;
  }

  if (formatId === 'xml') {
    const items = rows
      .map(
        (r) =>
          `  <item type="${xmlEscape(r.type)}" status="${xmlEscape(r.status)}"><name>${xmlEscape(
            r.name,
          )}</name><category>${xmlEscape(r.category)}</category><url>${xmlEscape(
            r.url,
          )}</url></item>`,
      )
      .join('\n');
    return `<?xml version="1.0" encoding="UTF-8"?>\n<userdorking username="${xmlEscape(
      username,
    )}" generatedAt="${xmlEscape(generatedAt)}" developer="swayampandit">\n${items}\n</userdorking>\n`;
  }

  if (formatId === 'yaml') {
    const itemLines = rows
      .map(
        (r) =>
          `  - type: ${yamlEscape(r.type)}\n    name: ${yamlEscape(r.name)}\n    status: ${yamlEscape(
            r.status,
          )}\n    category: ${yamlEscape(r.category)}\n    url: ${yamlEscape(r.url)}`,
      )
      .join('\n');
    return [
      `app: userdorking`,
      `developer: swayampandit`,
      `username: ${yamlEscape(username)}`,
      `generatedAt: ${yamlEscape(generatedAt)}`,
      `summary:`,
      `  available: ${available.length}`,
      `  taken: ${taken.length}`,
      `  unknown: ${unknown.length}`,
      `results:`,
      itemLines || '  []',
      '',
    ].join('\n');
  }

  return buildExport(payload, 'json');
}

export function downloadExport(filename, content, mime) {
  if (typeof document === 'undefined') return false;
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const href = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(href);
  return true;
}
