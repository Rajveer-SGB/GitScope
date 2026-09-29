import { useEffect, useMemo, useRef, useState } from 'react';
import { getProfile, getRepositories, languageBreakdown, validateUsername } from './github.js';

const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });
const dateFormat = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' });

function initialTheme() {
  try { return localStorage.getItem('gitscope-theme') === 'dark' ? 'dark' : 'light'; }
  catch { return 'light'; }
}

function Icon({ name, size = 18 }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    arrow: <><path d="M7 17 17 7M8 7h9v9" /></>,
    star: <path d="m12 2 3.1 6.3 7 1-5 4.9 1.2 7-6.3-3.3-6.3 3.3 1.2-7-5-4.9 7-1z" />,
    fork: <><circle cx="6" cy="4" r="2" /><circle cx="18" cy="4" r="2" /><circle cx="12" cy="20" r="2" /><path d="M6 6v5a6 6 0 0 0 6 6m6-11v5a6 6 0 0 1-6 6" /></>,
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    building: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M9 21v-4h6v4M8 8h1m6 0h1M8 12h1m6 0h1" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4m10-4v4M3 10h18" /></>,
    github: <path d="M9 19c-4 1-4-2-6-2m12 4v-2.5a2.2 2.2 0 0 0-.6-1.7c3.4-.4 7-1.7 7-7.5A5.9 5.9 0 0 0 19.8 5 5.5 5.5 0 0 0 19.7 1S18.4.6 16 2.8a13.2 13.2 0 0 0-8 0C5.6.6 4.3 1 4.3 1A5.5 5.5 0 0 0 4.2 5a5.9 5.9 0 0 0-1.6 4.3c0 5.8 3.6 7.1 7 7.5A2.2 2.2 0 0 0 9 18.5V21" />,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></>,
    moon: <path d="M20.5 14.3A8.5 8.5 0 0 1 9.7 3.5 8.5 8.5 0 1 0 20.5 14.3Z" />,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function Stat({ label, value }) {
  return <div className="stat"><span className="stat-value">{compact.format(value ?? 0)}</span><span className="stat-label">{label}</span></div>;
}

function Profile({ user }) {
  return (
    <section className="card profile-card" aria-label="Profile details">
      <div className="profile-top"><img className="avatar" src={user.avatar_url} alt={`${user.login}'s avatar`} /><span className="profile-badge"><span className="status-dot" /> PUBLIC PROFILE</span></div>
      <h2>{user.name || user.login}</h2>
      <a className="handle" href={user.html_url} target="_blank" rel="noopener noreferrer">@{user.login} <Icon name="arrow" size={15} /></a>
      <p className="bio">{user.bio || 'This developer has not added a bio yet.'}</p>
      <div className="stats"><Stat label="Repositories" value={user.public_repos} /><Stat label="Followers" value={user.followers} /><Stat label="Following" value={user.following} /></div>
      <div className="profile-meta">
        {user.location && <span><Icon name="pin" />{user.location}</span>}
        {user.company && <span><Icon name="building" />{user.company}</span>}
        <span><Icon name="calendar" />Joined {dateFormat.format(new Date(user.created_at))}</span>
      </div>
      <a className="profile-link" href={user.html_url} target="_blank" rel="noopener noreferrer">View GitHub profile <Icon name="arrow" size={17} /></a>
    </section>
  );
}

function Languages({ repos, total }) {
  const languages = useMemo(() => languageBreakdown(repos), [repos]);
  const counted = languages.reduce((sum, [, count]) => sum + count, 0);
  return (
    <section className="card language-card" aria-label="Programming languages">
      <div className="section-heading"><div><span className="eyebrow">THE TOOLKIT</span><h2>Languages</h2></div><span className="subtle">{counted} repos</span></div>
      <p className="hint">Primary language of loaded, non-fork repositories.</p>
      {languages.length ? <div className="language-list">{languages.slice(0, 7).map(([name, count], index) => (
        <div className="language-row" key={name}>
          <div className="language-name"><span className={`language-dot color-${index % 7}`} />{name}<span>{count}</span></div>
          <div className="bar-track"><div className={`bar-fill color-${index % 7}`} style={{ width: `${(count / counted) * 100}%` }} /></div>
        </div>
      ))}</div> : <p className="empty-small">No languages listed for these repositories.</p>}
      {repos.length < total && <p className="hint more-hint">Load more repositories to expand this breakdown.</p>}
    </section>
  );
}

function Repository({ repo }) {
  return (
    <article className="repo-card">
      <div className="repo-top"><span className="repo-icon">⌘</span><span className="visibility">PUBLIC</span></div>
      <h3><a href={repo.html_url} target="_blank" rel="noopener noreferrer">{repo.name} <Icon name="arrow" size={16} /></a></h3>
      <p className="repo-description">{repo.description || 'No description provided.'}</p>
      <div className="repo-footer"><span className="repo-language"><span className="language-dot color-0" />{repo.language || 'Unspecified'}</span><span><Icon name="star" size={16} />{compact.format(repo.stargazers_count)}</span><span><Icon name="fork" size={16} />{compact.format(repo.forks_count)}</span></div>
    </article>
  );
}

export default function App() {
  const [theme, setTheme] = useState(initialTheme);
  const [input, setInput] = useState('');
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('all');
  const [sort, setSort] = useState('updated');
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [repoError, setRepoError] = useState('');
  const [page, setPage] = useState(1);
  const controller = useRef(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#17191e' : '#f3f3ef');
    try { localStorage.setItem('gitscope-theme', theme); } catch { /* Storage may be disabled. */ }
  }, [theme]);

  async function search(value = input) {
    controller.current?.abort();
    let username;
    try { username = validateUsername(value); }
    catch (err) { setError(err.message); setUser(null); setRepos([]); setLoading(false); setLoadingMore(false); return; }
    const current = new AbortController();
    controller.current = current;
    setInput(username);
    setError(''); setRepoError(''); setUser(null); setRepos([]); setQuery(''); setLanguage('all'); setPage(1); setLoadingMore(false); setLoading(true);
    try {
      const profile = await getProfile(username, current.signal);
      const repositoryList = await getRepositories(username, 1, current.signal);
      if (controller.current !== current) return;
      setUser(profile);
      setRepos(repositoryList);
    } catch (err) {
      if (err.name !== 'AbortError' && controller.current === current) setError(err.message);
    } finally {
      if (controller.current === current) setLoading(false);
    }
  }

  async function loadMore() {
    if (!user || loadingMore) return;
    const current = controller.current;
    setLoadingMore(true); setRepoError('');
    try {
      const next = await getRepositories(user.login, page + 1, current.signal);
      if (controller.current !== current) return;
      setRepos(previous => [...previous, ...next]);
      setPage(previous => previous + 1);
    } catch (err) {
      if (err.name !== 'AbortError' && controller.current === current) setRepoError(err.message);
    } finally {
      if (controller.current === current) setLoadingMore(false);
    }
  }

  const languages = useMemo(() => [...new Set(repos.map(repo => repo.language).filter(Boolean))].sort(), [repos]);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return repos.filter(repo => (repo.name.toLowerCase().includes(needle) || (repo.description || '').toLowerCase().includes(needle)) && (language === 'all' || repo.language === language)).sort((a, b) => {
      if (sort === 'stars') return b.stargazers_count - a.stargazers_count || a.name.localeCompare(b.name);
      if (sort === 'name') return a.name.localeCompare(b.name);
      return new Date(b.updated_at) - new Date(a.updated_at);
    });
  }, [repos, query, language, sort]);
  const hasMore = !!user && repos.length < user.public_repos && repos.length > 0 && repos.length % 100 === 0;

  return (
    <div className="app-shell">
      <div className="announcement"><span className="announcement-spark">✳</span> EXPLORE OPEN SOURCE, ONE PROFILE AT A TIME <span className="announcement-spark">✳</span></div>
      <header className="site-header"><div className="brand"><span className="brand-mark"><Icon name="github" size={21} /></span><span>git<span className="brand-accent">scope</span><small>PROFILE ANALYZER</small></span></div><div className="header-actions"><span className="header-note"><span className="status-dot" /> LIVE GITHUB DATA</span><button className="theme-toggle" type="button" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} aria-pressed={theme === 'dark'} onClick={() => setTheme(value => value === 'light' ? 'dark' : 'light')}><Icon name={theme === 'light' ? 'moon' : 'sun'} size={17} /><span>{theme === 'light' ? 'DARK MODE' : 'LIGHT MODE'}</span></button></div></header>
      <main>
        <section className="hero"><div className="hero-copy"><span className="eyebrow">[ THE DEVELOPER INDEX ]</span><h1>Code has<br /><em>a story.</em></h1><p>Look beyond the username. Explore the people, projects, and programming languages shaping GitHub.</p><div className="hero-annotation"><span className="annotation-line" /> PUBLIC DATA. NEW PERSPECTIVE.</div></div><div className="hero-art" aria-hidden="true"><div className="art-orbit art-orbit-one" /><div className="art-orbit art-orbit-two" /><div className="art-core"><span>&lt;/&gt;</span></div><span className="art-index">01 / DISCOVER</span><span className="art-cross art-cross-one">+</span><span className="art-cross art-cross-two">+</span></div></section>
        <form className="search-panel" onSubmit={event => { event.preventDefault(); search(); }}><label htmlFor="username">FIND A DEVELOPER</label><div className="search-controls"><div className="input-wrap"><Icon name="search" size={21} /><input id="username" autoComplete="off" spellCheck="false" placeholder="Enter a GitHub username, e.g. octocat" value={input} onChange={event => setInput(event.target.value)} /></div><button className="primary-button" type="submit" disabled={loading}>{loading ? 'Searching…' : 'Analyze profile'} <Icon name="arrow" size={18} /></button></div></form>
        {error && <div className="alert" role="alert">{error}</div>}
        {loading && <div className="loading-state" role="status"><span className="spinner" />Fetching profile and repositories…</div>}
        {!user && !loading && !error && <div className="welcome"><span className="welcome-icon"><Icon name="search" size={26} /></span><h2>Ready when you are</h2><p>Enter a username above to uncover a developer’s public GitHub activity.</p><div className="suggestions">Try <button onClick={() => search('octocat')}>octocat</button> or <button onClick={() => search('torvalds')}>torvalds</button></div></div>}
        {user && <div className="dashboard"><div className="dashboard-top"><div><span className="eyebrow">ANALYSIS COMPLETE</span><h2>Inside @{user.login}<span className="heading-period">.</span></h2></div><span className="result-count">Showing {repos.length} of {user.public_repos} public repositories</span></div><div className="overview-grid"><Profile user={user} /><Languages repos={repos} total={user.public_repos} /></div>
          <section className="repo-section" aria-labelledby="repos-title"><div className="repo-heading"><div><span className="eyebrow">THE WORK</span><h2 id="repos-title">Public repositories <span className="heading-period">/</span> <span className="repo-number">{user.public_repos}</span></h2></div></div><div className="filters"><div className="filter-search"><Icon name="search" size={19} /><input aria-label="Search loaded repositories" placeholder="Search loaded repositories..." value={query} onChange={event => setQuery(event.target.value)} /></div><select aria-label="Filter by language" value={language} onChange={event => setLanguage(event.target.value)}><option value="all">All languages</option>{languages.map(item => <option key={item} value={item}>{item}</option>)}</select><select aria-label="Sort repositories" value={sort} onChange={event => setSort(event.target.value)}><option value="updated">Recently updated</option><option value="stars">Most stars</option><option value="name">Name A–Z</option></select></div>
          {filtered.length ? <div className="repo-grid">{filtered.map(repo => <Repository key={repo.id} repo={repo} />)}</div> : <div className="no-results">{repos.length ? 'No repositories match these filters.' : 'This developer has no public repositories.'}</div>}
          {repoError && <div className="alert" role="alert">{repoError}</div>}
          {hasMore && <div className="more-wrap"><button className="more-button" onClick={loadMore} disabled={loadingMore}>{loadingMore ? 'Loading…' : 'Load more repositories'} <Icon name="arrow" size={17} /></button></div>}
          {hasMore && <p className="pagination-note">Search and language statistics cover repositories loaded so far.</p>}</section></div>}
      </main><footer>Built with React and the GitHub public API <span>·</span> GitScope</footer>
    </div>
  );
}
