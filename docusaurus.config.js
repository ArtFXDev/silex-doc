// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/nightOwl");

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
          editUrl: "https://github.com/ArtFXDev/silex-doc/edit/main",
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl: "https://github.com/ArtFXDev/silex-doc/edit/main",
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
          title: "User Guide",
          items: [
            {
              label: "Presentation",
              to: "/docs/user/presentation",
            },
          ],
        },
        {
          title: "TD",
          items: [
            {
              label: "Presentation",
              to: "/docs/td/presentation",
            },
            {
              label: "Install Silex",
              to: "/docs/td/install",
            },
            {
              label: "Coding Workflow",
              to: "/docs/td/workflow",
            },
            {
              label: "Backend",
              to: "/docs/td/backend/CGWire/zou",
            },
            {
              label: "Renderfarm",
              to: "/docs/td/renderfarm",
            },
            {
              label: "Silex",
              to: "/docs/td/silex",
            },
            {
              label: "Design Guidelines",
              to: "/docs/td/design",
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
            {
              label: "Resilio",
              to: "/docs/it/resilio",
            },
            {
              label: "Portainer",
              to: "/docs/it/portainer",
            },
            {
              label: "Observium",
              to: "/docs/it/observium",
            },
            {
              label: "Zammad",
              to: "/docs/it/zammad",
            },
            {
              label: "Deployment",
              to: "/docs/it/deployment/pipeline-drive",
            },
            {
              label: "Scripts",
              to: "/docs/it/scripts/presentation",
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
      additionalLanguages: ["powershell", "yaml"],
    },
  },
};

module.exports = config;
