import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Shell } from "@/components/shell";
import { RegistroSW } from "@/components/registro-sw";

export const metadata: Metadata = {
  title: "PGN PREPÁRATE · Convocatoria 51-2026",
  description: "Plataforma de preparación para el concurso de méritos de la Procuraduría General de la Nación, empleo Asesor 1AS-19.",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.svg", apple: "/icon.svg" }
};

export const viewport: Viewport = { themeColor: "#0b1a36", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CO">
      <body>
        <Shell>{children}</Shell>
        <RegistroSW />
      </body>
    </html>
  );
}
