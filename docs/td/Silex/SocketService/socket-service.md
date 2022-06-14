---
id: socket-service
title: General presentation
sidebar_position: 10
---


WebSocket server is a bridge between DCCs and frontend. 

DCCs and Silex desktop frontend interface need to communicate in realtime, and we use a socket server to achieve that. You can figure a socket server as a chat room, where each client is connected anc can send requests. Because Silex desktop frontend and DCCs are connected on the same socket service, they can interact.

In order to achieve Separation of Concerns, it is neither the Silex desktop frontend nor the DCCs that accomplish file actions, but the Silexsocket Service itself.

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
  **Dont forget to replace <YOUR_GITHUB_TOKEN> with your github access token**, ref : [here](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)
- `npm install @artfxdev/silex-socket-service`
