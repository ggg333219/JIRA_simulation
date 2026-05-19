const jsonServer = require('json-server');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));

// defaults without bodyParser so we can insert our middleware before body parsing
const defaults = jsonServer.defaults({ bodyParser: false });
server.use(defaults);

// parse request body first so /register and /login can read req.body
server.use(jsonServer.bodyParser);

// mount dev middleware after body parsing so it can read req.body
const devMiddleware = require('./middleware');
server.use(devMiddleware);

// router last
server.use(router);

const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`JSON Server is running at http://localhost:${port}`);
});
