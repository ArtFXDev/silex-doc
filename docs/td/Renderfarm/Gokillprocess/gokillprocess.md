---
id: td-gokillprocess
title: Gokillprocess
---

## Presentation

Gokillprocess is used to get lists of process running, services, kill a running process with PID and restart a services with his name, throught HTTP request.

## Project Structure

```
📦go_killprocessbywebserver
 ┣ 📂middlewares
 ┃ ┗ 📜middlewares.go
 ┣ 📂responses
 ┃ ┗ 📜responses.go
 ┣ 📂server
 ┃ ┣ 📜controllers.go
 ┃ ┣ 📜routes.go
 ┃ ┗ 📜server.go
 ┣ 📜.gitattributes
 ┣ 📜go.mod
 ┣ 📜go.sum
 ┗ 📜main.go
```

## Package Middlewares

- To easily set headers of request in routes

## Package Responses

- Methods to return formatted message

## Package Server

- Controllers.go: Receive http request and process them.
- Routes.go: Http Routes of app.
- Server.go: Define the Server object and contains the mains function execution of server

## main.go

- Main of the app
