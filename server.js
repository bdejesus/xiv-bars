const express = require('express');
const next = require('next');
const secure = require('ssl-express-www');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(secure);

  server.get('/', (req, res) => {
    app.render(req, res, '/index', req.query);
  });

  server.get('/job/:job', (req, res) => {
    const job = req.params.job.toUpperCase();
    app.render(req, res, '/index', { ...req.query, job });
  });

  server.get('*', (req, res) => handle(req, res));

  server.listen(port, (err) => {
    if (err) throw err;
    // eslint-disable-next-line no-console
    console.log(`> Ready on http://localhost:${port}`);
  });
});
