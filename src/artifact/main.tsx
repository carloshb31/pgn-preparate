import { StrictMode, type ComponentType } from "react";
import { createRoot } from "react-dom/client";
import "@/app/globals.css";
import { Shell } from "@/components/shell";
import { useRuta } from "./router";
import Inicio from "@/app/page";
import Plan from "@/app/plan/page";
import Biblioteca from "@/app/biblioteca/page";
import Banco from "@/app/banco/page";
import Simulacros from "@/app/simulacros/page";
import Examen from "@/app/simulacros/examen/page";
import Resultado from "@/app/simulacros/resultado/[id]/page";
import Competencias from "@/app/competencias/page";
import Estadisticas from "@/app/estadisticas/page";
import Asistente from "@/app/asistente/page";
import Progreso from "@/app/progreso/page";
import Configuracion from "@/app/configuracion/page";
import Admin from "@/app/admin/page";

const RUTAS: [RegExp, ComponentType][] = [
  [/^\/$/, Inicio],
  [/^\/plan/, Plan],
  [/^\/biblioteca/, Biblioteca],
  [/^\/banco/, Banco],
  [/^\/simulacros\/examen/, Examen],
  [/^\/simulacros\/resultado\//, Resultado],
  [/^\/simulacros/, Simulacros],
  [/^\/competencias/, Competencias],
  [/^\/estadisticas/, Estadisticas],
  [/^\/asistente/, Asistente],
  [/^\/progreso/, Progreso],
  [/^\/configuracion/, Configuracion],
  [/^\/admin/, Admin]
];

function App() {
  const ruta = useRuta().split("?")[0];
  const Pagina = RUTAS.find(([re]) => re.test(ruta))?.[1] ?? Inicio;
  return (
    <Shell>
      <Pagina key={ruta} />
    </Shell>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
