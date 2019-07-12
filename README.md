# XIV Bars

This is the source code for XIV Bars, a simple webapp for previewing the Final Fantasy XIV Crossbar. Simulate what your crossbar actions could look like for playing Final Fantasy XIV with a gamepad or controller.

This app is deployed to [https://xivbars.josebenedicto.com](https://xivbars.josebenedicto.com).

## Requirements

You'll need to install [Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com/)

## Running the app

Install dependencies
```
yarn install
```

Run the app
```
yarn start
```

Once the app is running in development mode, open [http://localhost:3000](http://localhost:5000) to view it in the browser.

The page will reload if you make edits. You will also see any lint errors in the console.

## Troubleshooting

### Incompatible "node" engine
```
The engine "node" is incompatible with this module.
```

#### Solution
```
yarn --ignore-engines
```

## Contributing

Create a pull request and maybe I'll review and accept when I get the chance. I'm not really sure how much time I'll be able to commit to maintaining this.
