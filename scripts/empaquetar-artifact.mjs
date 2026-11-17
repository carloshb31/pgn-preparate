// Convierte el HTML de Vite en el fragmento que espera el Artifact tool:
// sin doctype/html/head/body propios; <title> y <style> primero.
import { readFileSync, writeFileSync } from "node:fs";

const html = readFileSync("dist-artifact/index.html", "utf8");
const estilos = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join("\n");
// U+FFFD literal (presente en librerías de decodificación) se escribe como escape de JS.
const scripts = [...html.matchAll(/<script type="module"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1].replace(/\uFFFD/g, "\\uFFFD"));
if (!scripts.length) throw new Error("No se encontró el script del bundle");

const fragmento = `<title>PGN Prepárate</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">
<style>
${estilos}
</style>
<div id="root"><div style="padding:48px 16px;text-align:center;font:14px Inter,system-ui,sans-serif;color:#475569">Cargando PGN Prepárate…</div></div>
<script type="module">
${scripts.join("\n")}
</script>
`;
writeFileSync("dist-artifact/pgn-preparate.html", fragmento);
console.log(`dist-artifact/pgn-preparate.html: ${(Buffer.byteLength(fragmento) / 1024).toFixed(0)} KB`);
