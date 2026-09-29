const API = 'https://api.github.com';
const USERNAME_PATTERN = /^(?!-)[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i;

export function validateUsername(input) {
  const username = input.trim().replace(/^@/, '');
  if (!username || !USERNAME_PATTERN.test(username) || username.includes('--')) {
    throw new Error('Enter a valid GitHub username (letters, numbers, and single hyphens).');
  }
  return username;
}

async function request(path, signal) {
  let response;
  try {
    response = await fetch(`${API}${path}`, {
      signal,
      headers: { Accept: 'application/vnd.github+json' },
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error('Could not connect to GitHub. Check your connection and try again.');
  }

  if (response.status === 404) throw new Error('No GitHub profile found with that username.');
  if (response.status === 403 || response.status === 429) {
    throw new Error('GitHub’s API limit has been reached. Please try again later.');
  }
  if (!response.ok) throw new Error(`GitHub returned an error (${response.status}). Please try again.`);
  return response.json();
}

export function getProfile(username, signal) {
  return request(`/users/${encodeURIComponent(username)}`, signal);
}

export function getRepositories(username, page, signal) {
  return request(`/users/${encodeURIComponent(username)}/repos?per_page=100&page=${page}&sort=updated`, signal);
}

export function languageBreakdown(repos) {
  const counts = new Map();
  for (const repo of repos) {
    if (repo.language && !repo.fork) counts.set(repo.language, (counts.get(repo.language) || 0) + 1);
  }
  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}
