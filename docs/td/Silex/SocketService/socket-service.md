WebSocket server bridge between DCCs and frontend

## Getting start

Socket-io bridge between front app and dccs

## Get Started

On standalone :

- get latest release
- `yarn`
- `yarn start`

In desktop project:

- Create .npmrc next to package.json and put that in:
- ```
  //npm.pkg.github.com/:_authToken=<YOUR_GITHUB_TOKEN>  # only if your repository is private
  @ArtFXDev:registry=https://npm.pkg.github.com/
  ```
  **Dont forget to replace <YOUR_GITHUB_TOKEN> woith your github access token**, ref : [here](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)
- `npm install @artfxdev/silex-socket-service`
