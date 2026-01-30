import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

/**
 * Query Client configuration
 *
 * Provides centralized caching and state management for all backend queries
 * - 5 minutes stale time by default
 * - No automatic refetch on window focus
 * - Single retry on failure
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data stays fresh for 5 minutes
      staleTime: 1000 * 60 * 5,
      // Don't refetch when window regains focus
      refetchOnWindowFocus: false,
      // Retry failed requests once
      retry: 1,
      // Garbage collection time
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
})

/**
 * Query Provider Component
 *
 * Wraps the application with TanStack Query client
 * Place this at the root of your app to enable useQuery/useMutation hooks
 *
 * @example
 * ```tsx
 * <QueryProvider>
 *   <App />
 * </QueryProvider>
 * ```
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
