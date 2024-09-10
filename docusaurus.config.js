// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'KaibanJS',
  tagline: 'The official documentation for KaibanJS',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://docs.kaibanjs.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Kaiban', // Usually your GitHub org/user name.
  projectName: 'KaibanJS', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          routeBasePath: '/',
          admonitions: {
            keywords: ['simple', 'agents', 'tasks', 'challenges'],
            extendDefaults: true,
          },
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/kaibanjs-social-card.png',
      navbar: {
        title: '',
        logo: {
          alt: 'KaibanJS',
          src: 'img/logo.svg',
        },
        items: [
          // {
          //   type: 'docSidebar',
          //   sidebarId: 'tutorialSidebar',
          //   position: 'left',
          //   label: 'Docs',
          // },
          // {to: '/blog', label: 'Blog', position: 'left'},
          {
            href: 'https://github.com/kaiban-ai/KaibanJS',
            label: 'GitHub',
            position: 'right',
          },
          {
            href: 'https://www.kaibanjs.com/discord',
            label: 'Community',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'light',
        links: [
          {
            label: 'Community',
            href: 'https://www.kaibanjs.com/discord',
          },
          {
            label: 'Home',
            href: 'https://www.kaibanjs.com/',
          },
          {
            label: 'GitHub',
            href: 'https://github.com/kaiban-ai/KaibanJS',
          },
        ],
        copyright: `© ${new Date().getFullYear()} AI Champions, All rights reserved. Made with love from Miami, FL 🏝️`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
      colorMode: {
        defaultMode: 'light',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      }    
    }),
};

export default config;
