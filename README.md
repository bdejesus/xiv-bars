# XIV Bars – A Final Fantasy XIV Cross Hotbar Layout Planner

[https://xivbars.bejezus.com](https://xivbars.bejezus.com)

Welcome to XIV Bars! This is the source code for the Final Fantasy XIV (FFXIV) Cross Hotbar (XHB) planning tool. This is a passion project created for the purpose of serving the FFXIV community who may have use for a way to port hotbar layouts from the web into the game. It is built in NextJS and is continually being updated.

---

## Table of Contents

- [Contrubuting](#contributing)
  - [Report Bugs](#report-bugs)
  - [Request Features](#request-features)
  - [Contribute Code](#contribute-code)
  - [Donate](#donate)
- [Dev Environment](#dev-environment)
  - [Setting up](#setting-up)
  - [Running the app](#running-the-app)

## How to Contribute

This project is updated frequently with fixes and new features. I kind of use this project as a space to try new things with javascript and web design, so there may be some lack of structure when updates are deployed live.

### Reporting Issues

1. You can submit bug reports from the [Issues page](https://github.com/bdejesus/xiv-bars/issues).
2. Make sure that the issue you're submitting doesn't already exist.
3. Include step-by-step instructions on how to reproduce, as well as the operating system (OSX, Windows, etc.) and browser (Chrome, Firefox, etc.) you're using when encountering the issue.

### Requesting Features

Submit and discuss feature requests from the [Feature Requests page](https://github.com/bdejesus/xiv-bars/discussions/204).

### Contributing Code

#### Find an Issue to Work On

If you're interested in contributing code, take a look at [open issues](https://github.com/bdejesus/xiv-bars/issues) and create a pull request that addresses it. I'll review when I get the chance, but please be patient.

- [View Open Issues](https://github.com/bdejesus/xiv-bars/issues)
- [View the Web Project](https://github.com/users/bdejesus/projects/2/views/2)
- [Setting up a Dev Environment](#setting-up-a-dev-environment)

### Donate

If you find this tool helpful, [please donate](https://www.buymeacoffee.com/bejezus). Donations go towards keeping the app servers and other resources up so that this tool is available to everyone for free.

- [Donate](https://www.buymeacoffee.com/bejezus)

---

## Setting up a Dev Environment

### Requirements

* Node – You'll need to install [Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com/) (or [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm))
* [PostgreSQL](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)

### Configuration

The `.env.example` file contains all the environment variables used by the app. Copy it into the `.env` file.

```
> cp ./.env.example ./.env
```

#### Authentication

To be able to authenticate with the local app, you'll need to set it up with Discord ([OAuth2 Documentation](https://discord.com/developers/docs/topics/oauth2)).

```
DISCORD_ID=
DISCORD_SECRET=
JWT_SECRET=
```

#### Database URL

The postgresql database url.
```
DB_URL=
```

### Running the app (using Yarn)

Install dependencies

```bash
> yarn install
```

Fetch and compile static data from XIVAPI

```bash
> yarn build:data
```

Running the app locally

```bash
> yarn dev
```

Once the app is running in development mode, open [http://localhost:3000](http://localhost:5000) to view it in the browser.

### Running Tests

```bash
> yarn test
```
