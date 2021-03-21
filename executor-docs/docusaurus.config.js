module.exports = {
  title: 'Executor',
  tagline: 'An easy way to produce dynamic functions to extract pieces of data',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'nytramr', // Usually your GitHub org/user name.
  projectName: 'executor', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Executor',
      logo: {
        alt: 'Executor Logo',
        src: 'img/executor-logo.svg',
      },
      items: [
        {
          to: 'docs/docs/install',
          activeBasePath: 'docs/docs',
          label: 'Docs',
          position: 'left',
        },
        {
          to: 'docs/recipes/recipe-conditional',
          activeBasePath: 'docs/recipes',
          label: 'Recipes',
          position: 'left',
        },
        {
          to: 'playground',
          label: 'Playground',
          position: 'left',
        },
        {
          href: 'https://github.com/Nytramr/executor.git',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: 'docs/docs/install',
            },
            {
              label: 'Language',
              to: 'docs/docs/property-function',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/Nytramr/executor.git',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Martin Rubinsztein, Inc. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        docs2: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        blog: {
          showReadingTime: true,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  clientModules: [require.resolve('./node_modules/@nytramr/railroad-custom-element/build/bundle.js')],
};
