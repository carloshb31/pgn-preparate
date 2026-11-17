// Sustituto de next/link para el build del artifact.
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { navegar, nombreDeRuta } from "../router";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string; children?: ReactNode; prefetch?: boolean; replace?: boolean };

export default function Link({ href, onClick, children, prefetch: _p, replace, ...resto }: Props) {
  const nombre = nombreDeRuta(href);
  return (
    <a
      {...resto}
      href={nombre === "inicio" ? "#" : `#${nombre}`}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey) return;
        e.preventDefault();
        navegar(href, { reemplazar: replace });
      }}
    >
      {children}
    </a>
  );
}
