# XIV Bars
## FFXIV XHB Cross Hotbar Planner/Simulator

[https://xivbars.bejezus.com](https://xivbars.bejezus.com)

The source code for the Final Fantasy XIV Cross Hotbar (XHB) Planning and Simulation Tool built in NextJS.

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

### Report Bugs

Submit bug reports in the [Issues section](https://github.com/bdejesus/xiv-bars/issues). Please make sure that the issue you're submitting doesn't already exist. Include step-by-step instructions on how to reproduce, as well as the operating system (OSX, Windows, etc.) and browser (Chrome, Firefox, etc.) you're using when encountering the issue.

* [View Open Bug Reports](https://github.com/bdejesus/xiv-bars/issues?q=is%3Aopen+is%3Aissue+label%3Abug)

### Request Features

Submit feature requests from the [Issues section](https://github.com/bdejesus/xiv-bars/issues). Please make sure that the issue you're submitting doesn't already exist. Include a detailed description of the feature being requested and how it should work.

* [View Open Feature Requests](https://github.com/bdejesus/xiv-bars/issues?q=is%3Aopen+is%3Aissue+label%3A%22feature+request%22)

### Contribute Code

If you're interested in contributing some code, take a look at [open issues](https://github.com/bdejesus/xiv-bars/issues) and create a pull request that addresses it. I'll review when I get the chance, but please be patient.

* [View Open Issues](https://github.com/bdejesus/xiv-bars/issues)
* [Set up the dev environment](#dev-environment)

### Donate

If you find this tool helpful, [please consider donating](https://www.buymeacoffee.com/bejezus). Donations go towards paying for app servers and other resources to make this tool available to everyone for free.

* [Donate](https://www.buymeacoffee.com/bejezus)

## Dev Environment

### Setting up

You'll need to install [Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com/) (or [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm))

### Running the app (using Yarn)

Install dependencies

```bash
yarn install
```

Fetch and compile data from XIVAPI
```bash
yarn build:data
```

Run the app

```bash
yarn dev
```

Once the app is running in development mode, open [http://localhost:3000](http://localhost:5000) to view it in the browser.
