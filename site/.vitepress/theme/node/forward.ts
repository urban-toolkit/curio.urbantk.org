import fs from 'node:fs'
import path from 'node:path'

// The app used to live at curio.urbantk.org itself. GitHub Pages has no server-side redirects, so old app
// links are forwarded from the browser: /app/ and /app-dev/ get small pages of their own, and every other old
// path (/dashboard/<id>, /dataflow/<id>, ...) lands on the 404 page, whose inline script sends it on.

interface ForwardSite {
  hostname: string
  app: string
  appDev: string
  appRoutes: readonly string[]
}

// Attribute of the forwarder's <script> tag, which the dist check looks for in 404.html. (VitePress minifies
// inline head scripts, so a comment inside the script would not survive.)
export const FORWARD_ATTR = 'data-curio-forward'

// `base` is the site's path prefix, so the script also works on a review copy under /curio.urbantk.org/.
export function forwarderScript(site: ForwardSite, base = '/'): string {
  return `(function () {
  var routes = ${JSON.stringify(site.appRoutes)}, base = ${JSON.stringify(base)};
  var p = location.pathname, target = null;
  if (p.indexOf(base) === 0) p = '/' + p.slice(base.length);
  function under(r) { return p === r || p.indexOf(r + '/') === 0; }
  if (under('/app-dev')) target = ${JSON.stringify(site.appDev)} + (p.slice(8) || '/');
  else if (under('/app')) target = ${JSON.stringify(site.app)} + (p.slice(4) || '/');
  else if (routes.some(under)) target = ${JSON.stringify(site.app)} + p;
  if (target) location.replace(target + location.search + location.hash);
})();`
}

function escapeAttr(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
}

function stub(to: string): string {
  const target = escapeAttr(to)
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Opening Curio</title>
<meta name="robots" content="noindex">
<link rel="canonical" href="${target}">
<meta http-equiv="refresh" content="0; url=${target}">
<script>location.replace(${JSON.stringify(to)} + location.search + location.hash)</script>
</head>
<body><p>Curio is at <a href="${target}">${target}</a>.</p></body>
</html>
`
}

export function writeAppStubs(outDir: string, site: ForwardSite): void {
  for (const [from, to] of [
    ['app', `${site.app}/`],
    ['app-dev', `${site.appDev}/`],
  ]) {
    const file = path.join(outDir, from, 'index.html')
    if (fs.existsSync(file)) throw new Error(`/${from}/ is a page; it must stay free for the app forward`)
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, stub(to))
  }
}
