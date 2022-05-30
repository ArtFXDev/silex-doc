// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Silex Doc",
  tagline: "Documentation de Silex et de tout ce qui le concerne",
  url: "http://localhost:3000",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/silex_logo.png",
  organizationName: "TDgang", // Usually your GitHub org/user name.
  projectName: "silex-doc", // Usually your repo name.

  i18n: {
    defaultLocale: "fr",
    locales: ["en", "fr"],
    localeConfigs: {
      en: {
        htmlLang: "en-GB",
      },
      // Vous pouvez omettre une locale (par exemple, fr) si vous n'avez pas besoin de modifier les paramètres par défaut.
      fa: {
        direction: "rtl",
      },
    },
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          editUrl:
            "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig: {
    navbar: {
      title: "Silex Doc",
      logo: {
        alt: "Silex",
        src: "img/silex_logo.png",
      },
      items: [
        {
          type: "doc",
          docId: "user/presentation",
          position: "left",
          label: "Guide Utilisateur",
        },
        {
          type: "doc",
          docId: "td/presentation",
          position: "left",
          label: "TD",
        },
        {
          type: "doc",
          docId: "it/presentation",
          position: "left",
          label: "IT",
        },
        {
          type: "doc",
          docId: "faq",
          position: "left",
          label: "FAQ",
        },
        {
          type: "localeDropdown",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Guide Utilisateur",
          items: [
            {
              label: "Présentation",
              to: "/docs/user/presentation",
            },
            {
              label: "Installation",
              to: "/docs/user/install",
            },
            {
              label: "Shots and assets",
              to: "/docs/user/shots-assets",
            },
            {
              label: "Action",
              to: "/docs/user/action",
            },
            {
              label: "Actions in Maya",
              to: "/docs/user/action-maya",
            },
            {
              label: "Actions in Houdini",
              to: "/docs/user/action-houdini",
            },
            {
              label: "Actions in Nuke",
              to: "/docs/user/action-nuke",
            },
            {
              label: "The render farm and tractor",
              to: "/docs/user/renderfarm-tractor",
            },
          ],
        },
        {
          title: "TD",
          items: [
            {
              label: "Présentation",
              to: "/docs/td/presentation",
            },
            {
              label: "Installation",
              to: "/docs/td/install",
            },
          ],
        },
        {
          title: "IT",
          items: [
            {
              label: "Présentation",
              to: "/docs/it/presentation",
            },
          ],
        },
        {
          title: "FAQ",
          items: [
            {
              label: "faq",
              to: "/docs/faq",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} TD Silex, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  },
};

module.exports = config;
