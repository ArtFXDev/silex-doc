// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Silex Docs",
  tagline: "User guide for TD and artists",
  url: "http://localhost:3000",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/silex_logo.png",
  organizationName: "TDgang", // Usually your GitHub org/user name.
  projectName: "silex-doc", // Usually your repo name.

  i18n: {
    defaultLocale: "en",
    locales: ["en", "fr"],
    localeConfigs: {
      en: {
        htmlLang: "en-GB",
      },
      fr: {
        htmlLang: "fr-FR",
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
      title: "Silex Docs",
      logo: {
        alt: "Silex",
        src: "img/silex_logo.png",
      },
      items: [
        {
          label: "User Guide",
          type: "doc",
          docId: "user/presentation",
        },
        {
          label: "TD",
          type: "doc",
          docId: "td/presentation",
        },
        {
          label: "IT",
          type: "doc",
          docId: "it/presentation",
        },
        {
          label: "FAQ",
          type: "doc",
          docId: "faq",
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
      copyright: `Copyright © ${new Date().getFullYear()} ArtFX TDs`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  },
};

module.exports = config;
