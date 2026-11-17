// Sustituto de next/navigation para el build del artifact.
import { useMemo } from "react";
import { navegar, useRuta } from "../router";

export function useRouter() {
  return useMemo(
    () => ({
      push: (href: string) => navegar(href),
      replace: (href: string) => navegar(href, { reemplazar: true }),
      back: () => history.back(),
      refresh: () => undefined,
      prefetch: () => undefined
    }),
    []
  );
}

export function usePathname() {
  return useRuta().split("?")[0];
}

export function useSearchParams() {
  const r = useRuta();
  return useMemo(() => new URLSearchParams(r.split("?")[1] ?? ""), [r]);
}

export function useParams<T extends Record<string, string>>(): T {
  const r = useRuta().split("?")[0];
  const m = r.match(/^\/simulacros\/resultado\/([^/]+)/);
  return (m ? { id: decodeURIComponent(m[1]) } : {}) as T;
}
