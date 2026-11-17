"use client";

import { useState } from "react";
import { getSupabase } from "@/lib/data/supabase";
import { Aviso, Boton, Campo, inputCls } from "./ui";
import { CONVOCATORIA } from "@/lib/config/convocatoria";

export function Login() {
  const [modo, setModo] = useState<"entrar" | "registro">("entrar");
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [nombre, setNombre] = useState("");
  const [msg, setMsg] = useState<{ tono: "bad" | "ok"; texto: string } | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setMsg(null);
    const sb = getSupabase();
    const r =
      modo === "entrar"
        ? await sb.auth.signInWithPassword({ email, password: clave })
        : await sb.auth.signUp({ email, password: clave, options: { data: { nombre } } });
    setEnviando(false);
    if (r.error) setMsg({ tono: "bad", texto: r.error.message });
    else if (modo === "registro" && !r.data.session) setMsg({ tono: "ok", texto: "Revise su correo para confirmar la cuenta." });
  }

  return (
    <div className="grid min-h-screen place-items-center bg-navy-900 p-4">
      <form onSubmit={enviar} className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-6 shadow-xl">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-azul-600">PGN PREPÁRATE</p>
          <h1 className="mt-1 text-xl font-semibold text-navy-900">{modo === "entrar" ? "Iniciar sesión" : "Crear cuenta"}</h1>
          <p className="mt-1 text-sm text-slate-600">Preparación para la Convocatoria {CONVOCATORIA.codigo}, {CONVOCATORIA.denominacion} {CONVOCATORIA.codigoGrado}.</p>
        </div>
        {modo === "registro" && (
          <Campo etiqueta="Nombre">
            <input className={inputCls} value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" />
          </Campo>
        )}
        <Campo etiqueta="Correo electrónico">
          <input className={inputCls} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </Campo>
        <Campo etiqueta="Contraseña" ayuda={modo === "registro" ? "Mínimo 8 caracteres." : undefined}>
          <input className={inputCls} type="password" required minLength={8} value={clave} onChange={(e) => setClave(e.target.value)} autoComplete={modo === "entrar" ? "current-password" : "new-password"} />
        </Campo>
        {msg && <Aviso tono={msg.tono}>{msg.texto}</Aviso>}
        <Boton type="submit" className="w-full" disabled={enviando}>
          {enviando ? "Procesando…" : modo === "entrar" ? "Entrar" : "Crear cuenta"}
        </Boton>
        <button type="button" className="w-full text-center text-sm text-azul-600 hover:underline" onClick={() => setModo(modo === "entrar" ? "registro" : "entrar")}>
          {modo === "entrar" ? "¿No tiene cuenta? Regístrese" : "¿Ya tiene cuenta? Inicie sesión"}
        </button>
      </form>
    </div>
  );
}
