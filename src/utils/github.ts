export interface FetchedGithubRepo {
  repoName: string;
  repoOwner: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  url: string;
  bannerImage: string;
  topics: string[];
}

export async function fetchGithubRepoData(inputUrlOrSlug: string): Promise<FetchedGithubRepo | null> {
  try {
    let clean = inputUrlOrSlug.trim();
    clean = clean.replace(/^https?:\/\/github\.com\//, '');
    clean = clean.replace(/\/$/, '');
    
    const parts = clean.split('/');
    if (parts.length < 2) return null;

    const owner = parts[0];
    const repo = parts[1];

    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status}`);
    }

    const data = await res.json();

    return {
      repoName: data.name || repo,
      repoOwner: data.owner?.login || owner,
      description: data.description || 'Repositório no GitHub',
      language: data.language || 'TypeScript',
      stars: data.stargazers_count ?? 0,
      forks: data.forks_count ?? 0,
      url: data.html_url || `https://github.com/${owner}/${repo}`,
      bannerImage: `https://opengraph.githubassets.com/1/${owner}/${repo}`,
      topics: Array.isArray(data.topics) ? data.topics.slice(0, 4) : []
    };
  } catch (error) {
    console.error('Failed to fetch github data:', error);
    return null;
  }
}
