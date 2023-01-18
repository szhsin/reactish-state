import { createState, selector } from 'reactish-state';
import { reduxDevtools } from 'reactish-state/middleware';

const state = createState({ middleware: reduxDevtools({ name: 'github' }) });

interface UserState {
  loading?: boolean;
  error?: unknown;
  data?: {
    name: string;
    repos: { id: number; name: string; description: string; stargazers_count: number }[];
  };
}

const user = state(
  {} as UserState,
  (set) => ({
    fetch: async (userName: string) => {
      set({ loading: true }, 'user/fetch/pending');

      try {
        const userRes = await (await fetch(`https://api.github.com/users/${userName}`)).json();
        const repoRes = await (await fetch(userRes.repos_url)).json();
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
