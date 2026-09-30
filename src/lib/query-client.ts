import { QueryClient } from "@tanstack/react-query";

// PokeAPI data is effectively static, so we cache aggressively.
const ONE_HOUR = 1000 * 60 * 60;

export const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: ONE_HOUR,
        gcTime: ONE_HOUR * 24,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: 2,
      },
    },
  });
