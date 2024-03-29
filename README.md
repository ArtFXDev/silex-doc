# Silex documentation

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

### Installation

```
$ yarn
```

### Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

To open the French version locally just add this :

```
$ yarn start --locale fr
```

If docusaurus is not recognised as an internal or external command:

```
$ yarn add docusaurus
```

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

To run the documentation in the english version, from root:
`npm run start -- --locale en`
</br> For the french version just replace the 'en' with 'fr'
