// The badges under the home page's hero. They are drawn by shields.io in the style of the curio README's, but
// are about using Curio rather than building it.

const SHIELDS = 'https://img.shields.io'
const STYLE = 'style=for-the-badge'

interface BadgeSite {
  app: string
  repo: string
  paper: string
  discord: string
}

export interface Badge {
  alt: string
  // A path on this site, or an absolute URL.
  href: string
  src: string
}

// shields.io's static badge path: a dash or underscore inside the text is written twice.
function part(text: string): string {
  return encodeURIComponent(text.replace(/-/g, '--').replace(/_/g, '__'))
}

function query(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&')
}

function fixed(label: string, message: string, color: string, logo?: string): string {
  return `${SHIELDS}/badge/${part(label)}-${part(message)}-${color}?${STYLE}${logo ? `&${query({ logo, logoColor: 'white' })}` : ''}`
}

export function homeBadges(site: BadgeSite): Badge[] {
  // The hosted app's own version, read from its API, as in the README.
  const live = query({ url: `${site.app}/api/version`, query: '$.version', label: 'Try it online', color: '2ea44f', prefix: 'v', cacheSeconds: '300' })
  return [
    { alt: 'Try it online', href: site.app, src: `${SHIELDS}/badge/dynamic/json?${STYLE}&${live}` },
    { alt: 'Install with pip or Docker', href: '/install/', src: fixed('Install', 'pip or Docker', '0073b7', 'python') },
    { alt: 'Paper: IEEE VIS 2024', href: site.paper, src: fixed('Paper', 'IEEE VIS 2024', '8957e5') },
    { alt: 'Join us on Discord', href: site.discord, src: fixed('Discord', 'Join us', '5865f2', 'discord') },
    { alt: 'Open source, MIT license', href: site.repo, src: fixed('Open source', 'MIT', '24292e', 'github') },
  ]
}
