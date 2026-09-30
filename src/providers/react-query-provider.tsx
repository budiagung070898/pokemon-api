"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

// PokeAPI data is effectively static, so we cache aggressively.
const ONE_HOUR = 1000 * 60 * 60;

export default function ReactQueryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [queryClient] = useState(
    () =>
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
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
