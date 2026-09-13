import React, { useCallback, useEffect, useMemo, useState } from 'react';
import services, { categories } from './data/services';
import { generateSuggestions } from './utils/suggest';
import { EXPORT_FORMATS, buildExport, downloadExport } from './utils/exportResults';

const API = 'https://usernamesearch-5f00.onrender.com';

function sanitize(raw) {
  return String(raw || '').replace(/[^a-zA-Z0-9-_.]/g, '');
}

function stars(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 2.2 + 0.6,
    opacity: Math.random() * 0.7 + 0.15,
  }));
}

const STAR_MAP = stars(70);

function Hero({ value, onChange, onClear }) {
  return (
    <header className="hero">
      <div className="stars">
        {STAR_MAP.map((s) => (
          <span
            key={s.id}
            className="star"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              opacity: s.opacity,
            }}
          />
        ))}
      </div>
      <div className="brand-row">
        <span className="bolt" />
        <span className="brand">userdorking</span>
      </div>
      <div className="tagline">Instant username search across 100+ platforms</div>
      <div className="search-wrap">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search username"
          autoCapitalize="none"
          autoCorrect="off"
          autoFocus
        />
        {value ? (
          <button className="clear" type="button" onClick={onClear}>
            x
          </button>
        ) : null}
      </div>
      <div className="dev">by swayampandit</div>
    </header>
  );
}

function Landing() {
  return (
    <section className="landing">
      <h2>Get the same username everywhere</h2>
      <p className="lead">
        userdorking checks 100+ social, creator and developer platforms and tells you if your
        username is available. Results appear here as you type.
      </p>
      <div className="why">
        <div className="why-mark">01</div>
        <div>
          <h3>A new idea? We got your back.</h3>
          <p>Type once. Instantly see if your dream handle is free on GitHub, Instagram, TikTok, YouTube and 100+ more.</p>
        </div>
      </div>
      <div className="why">
        <div className="why-mark">02</div>
        <div>
          <h3>One tool to check them all</h3>
          <p>Claim the same username everywhere so people can find you. Results stream in while you type.</p>
        </div>
      </div>
      <div className="why">
        <div className="why-mark">03</div>
        <div>
          <h3>Ready to start?</h3>
          <p>Tap any Available card to open the signup page. Taken names stay crossed out so you skip the dead ends.</p>
        </div>
      </div>
      <div className="stats">
        <div>
          <strong>100+</strong>
          <span>platforms</span>
        </div>
        <div>
          <strong>live</strong>
          <span>as you type</span>
        </div>
        <div>
          <strong>free</strong>
          <span>no signup</span>
        </div>
      </div>
    </section>
  );
}

function ResultCard({ service, username, spin, onResult }) {
  const [state, setState] = useState('loading');
  const [url, setUrl] = useState(service.url.replace('{username}', username));

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const profileUrl = service.url.replace('{username}', username);
    setUrl(profileUrl);
    setState('loading');
    if (spin) {
      return () => {
        cancelled = true;
        controller.abort();
      };
    }
    fetch(`${API}/api/check/${service.id}/${encodeURIComponent(username)}`, {
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        if (json.url) setUrl(json.url);
        let next = 'taken';
        if (json.unknown) next = 'unknown';
        else if (json.available) next = 'available';
        setState(next);
        onResult &&
          onResult({
            serviceId: service.id,
            service: service.name,
            category: service.category,
            available: !!json.available,
            unknown: !!json.unknown,
            url: json.url || profileUrl,
            status: json.status,
          });
      })
      .catch((err) => {
        if (cancelled || err.name === 'AbortError') return;
        setState('unknown');
        onResult &&
          onResult({
            serviceId: service.id,
            service: service.name,
            category: service.category,
            available: false,
            unknown: true,
            url: profileUrl,
            status: 0,
          });
      });
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [service.id, username, spin]);

  const label =
    state === 'loading'
      ? 'Checking...'
      : state === 'available'
        ? 'Available'
        : state === 'unknown'
          ? 'Unknown'
          : 'Taken';

  return (
    <a
      className={`card ${state}`}
      href={state === 'loading' ? undefined : url}
      target="_blank"
      rel="noreferrer"
      onClick={(e) => {
        if (state === 'loading') e.preventDefault();
      }}
    >
      <div className="dot" style={{ background: service.color }} />
      <h4>{service.name}</h4>
      <div className="status">
        {state === 'loading' ? <span className="spin" /> : label}
      </div>
    </a>
  );
}

function DomainGrid({ username, spin, onResults }) {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (spin) {
      setLoading(true);
      setDomains([]);
      onResults && onResults([]);
      return () => {
        cancelled = true;
      };
    }
    setLoading(true);
    fetch(`${API}/api/domains/${encodeURIComponent(username)}`)
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        const list = json.domains || [];
        setDomains(list);
        setLoading(false);
        onResults && onResults(list);
      })
      .catch(() => {
        if (cancelled) return;
        setDomains([]);
        setLoading(false);
        onResults && onResults([]);
      });
    return () => {
      cancelled = true;
    };
  }, [username, spin]);

  return (
    <section>
      <div className="section-title">Domain names</div>
      <div className="meta-sub">.com .io .dev .net .app .ai .xyz .co</div>
      {loading ? (
        <div className="meta-sub">
          <span className="spin" /> Looking up DNS...
        </div>
      ) : (
        <div className="grid">
          {domains.map((d) => {
            const state = d.unknown ? 'unknown' : d.available ? 'available' : 'taken';
            return (
              <a
                key={d.domain}
                className={`card ${state}`}
                href={`https://${d.domain}`}
                target="_blank"
                rel="noreferrer"
              >
                <h4>{d.domain}</h4>
                <div className="status">
                  {state === 'available' ? 'Available' : state === 'taken' ? 'Taken' : 'Unknown'}
                </div>
              </a>
            );
          })}
        </div>
      )}
    </section>
  );
}

function ExportPanel({ username, results, domains, suggestions }) {
  const [picked, setPicked] = useState('json');
  const [note, setNote] = useState('');
  const fmt = EXPORT_FORMATS.find((f) => f.id === picked) || EXPORT_FORMATS[0];

  const run = () => {
    if (!results.length) {
      setNote('Wait until at least one result finishes.');
      return;
    }
    const content = buildExport(
      {
        username,
        generatedAt: new Date().toISOString(),
        results,
        domains,
        suggestions,
      },
      fmt.id,
    );
    const filename = `userdorking-${username}.${fmt.ext}`;
    downloadExport(filename, content, fmt.mime);
    setNote(`Saved ${filename}`);
  };

  return (
    <section className="export">
      <div className="section-title">Export results</div>
      <p>Choose a file type, then download the scan.</p>
      <div className="chips">
        {EXPORT_FORMATS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`chip-btn ${picked === f.id ? 'active' : ''}`}
            onClick={() => setPicked(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <button className="download" type="button" onClick={run}>
        Download .{fmt.ext}
      </button>
      {note ? <div className="note">{note}</div> : null}
    </section>
  );
}

function Results({ username, pending, onPick }) {
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
  const done = available + taken + unknown;
  const pct = Math.round((done / services.length) * 100);

  return (
    <div>
      <div className="meta-title">
        Checking <em>@{username}</em>
      </div>
      <div className="meta-sub">
        {pending
          ? 'Waiting for you to finish typing...'
          : `${list.length} platforms · results appear as each check finishes`}
      </div>
      <div className="summary">
        <div className="summary-row">
          <div>
            <b className="avail">{available}</b>
            available
          </div>
          <div>
            <b className="taken-c">{taken}</b>
            taken
          </div>
          <div>
            <b className="unk-c">{unknown}</b>
            unknown
          </div>
          <div>
            <b>{pending ? services.length : loading}</b>
            checking
          </div>
        </div>
        <div className="track">
          <div className="fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="hint">
          @{username} · {done}/{services.length} platforms scanned
        </div>
      </div>
      <div className="section-title">Try similar usernames</div>
      <div className="chips suggest">
        {suggestions.map((name) => (
          <button key={name} type="button" className="chip" onClick={() => onPick(name)}>
            @{name}
          </button>
        ))}
      </div>
      <DomainGrid username={username} spin={pending} onResults={setDomains} />
      <ExportPanel
        username={username}
        results={results}
        domains={domains}
        suggestions={suggestions}
      />
      <div className="chips">
        {['All', ...categories].map((cat) => (
          <button
            key={cat}
            type="button"
            className={`chip-btn ${filter === cat ? 'active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="grid">
        {list.map((service) => (
          <ResultCard
            key={`${service.id}-${username}`}
            service={service}
            username={username}
            spin={pending}
            onResult={onResult}
          />
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [username, setUsername] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setQuery(username), 500);
    return () => clearTimeout(t);
  }, [username]);

  const onChange = useCallback((text) => setUsername(sanitize(text)), []);
  const onClear = useCallback(() => {
    setUsername('');
    setQuery('');
  }, []);

  return (
    <div>
      <Hero value={username} onChange={onChange} onClear={onClear} />
      <main className="page">
        {username ? (
          <Results username={username} pending={query !== username} onPick={onChange} />
        ) : (
          <Landing />
        )}
      </main>
      <footer className="footer">
        © {new Date().getFullYear()} userdorking · developed by swayampandit
        <small>Check availability before you brand. Results are best-effort.</small>
      </footer>
    </div>
  );
}
