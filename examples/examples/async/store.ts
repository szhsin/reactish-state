import { stateBuilder, selector } from 'reactish-state';
import { reduxDevtools } from 'reactish-state/middleware';

const state = stateBuilder(reduxDevtools({ name: 'github' }));

type GitHubRepoRes = { id: number; name: string; description: string; stargazers_count: number }[];
type GitHubUserRes = { name: string; repos_url: string };

interface UserState {
  loading?: boolean;
  error?: unknown;
  data?: {
    name: string;
    repos: GitHubRepoRes;
  };
}

const fetchHelper = <T>(url: string) => fetch(url).then((res) => res.json()) as Promise<T>;

const user = state(
  {} as UserState,
  (set) => ({
    fetch: async (userName: string) => {
      set({ loading: true }, 'user/fetch/pending');

      try {
        const userRes = await fetchHelper<GitHubUserRes>(
          `https://api.github.com/users/${userName}`
        );
        const repoRes = await fetchHelper<GitHubRepoRes>(userRes.repos_url);
        set(
          {
            data: {
              name: userRes.name,
              repos: repoRes
            }
          },
          'user/fetch/fulfilled'
        );
      } catch (error) {
        set({ error }, 'user/fetch/rejected');
      }
    }
  }),
  { key: 'user' }
);

const topRepositories = selector(user, (user) =>
  user.data?.repos
    .slice()
    .sort((repo1, repo2) => repo2.stargazers_count - repo1.stargazers_count)
    .slice(0, 5)
);

export { user, topRepositories };
