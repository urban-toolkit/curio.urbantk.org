// Site-wide settings, shared by the config, the Node helpers and the checks.
export const SITE = {
  title: 'Curio',
  description: 'A guide to Curio, a dataflow framework for collaborative urban visual analytics',
  hostname: 'https://curio.urbantk.org',
  // The hosted instances. The guide links to the stable one; /app-dev forwards to the other. They move to
  // https://app.curio.urbantk.org and https://app-dev.curio.urbantk.org before this site takes over
  // curio.urbantk.org; until then these are their current addresses.
  app: 'https://curio.urbantk.org',
  appDev: 'https://curio-dev.urbantk.org',
  repo: 'https://github.com/urban-toolkit/curio',
  // In-depth documentation lives in the curio repo; guide pages link into it from their frontmatter.
  docs: 'https://github.com/urban-toolkit/curio/blob/main/',
  siteRepo: 'https://github.com/urban-toolkit/curio.urbantk.org',
  urbantk: 'https://urbantk.org',
  // Open Graph image for pages that have none of their own.
  image: '/media/brand/curio-social.png',
  // Paths the app answered at curio.urbantk.org before it moved to its own host. The 404 page forwards
  // them there, so no guide page may start with one of them.
  appRoutes: ['/auth', '/projects', '/dataflow', '/dashboard', '/catalog', '/data-hub', '/monitor', '/workflow', '/api'],
  // Sidebar groups, in order.
  groups: [
    { id: 'getting-started', title: 'Getting started' },
    { id: 'using', title: 'Using Curio' },
    { id: 'self-hosting', title: 'Self-hosting' },
    { id: 'extending', title: 'Extending Curio' },
  ],
  funding: {
    lead: 'Curio has been supported by:',
    sponsors: [
      {
        name: 'National Science Foundation (NSF)',
        awards: [
          { id: '2320261', url: 'https://www.nsf.gov/awardsearch/showAward?AWD_ID=2320261' },
          { id: '2330565', url: 'https://www.nsf.gov/awardsearch/showAward?AWD_ID=2330565' },
          { id: '2411223', url: 'https://www.nsf.gov/awardsearch/showAward?AWD_ID=2411223' },
        ],
      },
      { name: 'Discovery Partners Institute (DPI)' },
      { name: 'IDOT' },
    ],
  },
  // Both logos are black, so dark mode shows them inverted.
  institutions: [
    { name: 'Electronic Visualization Laboratory', url: 'https://evl.uic.edu', logo: '/media/institutions/evl.png' },
    { name: 'UIC Computer Science', url: 'https://cs.uic.edu/', logo: '/media/institutions/uic.png' },
  ],
} as const

export type GroupId = (typeof SITE.groups)[number]['id']
