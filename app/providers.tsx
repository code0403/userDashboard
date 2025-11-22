// React Query + Zustand providers
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode, useEffect, useState } from "react";
import { useStore } from "./lib/store";

// const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  const setLoggedInUser = useStore((state) => state.setLoggedInUser);

  useEffect(() => {
    // Hardcode first user as logged in
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) setLoggedInUser(data[0]);
      });
  }, [setLoggedInUser]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
