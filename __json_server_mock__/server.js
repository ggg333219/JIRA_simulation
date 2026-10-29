const jsonServer = require('json-server');
const path = require('path');
const { reorderKanbans } = require('./reorder-kanbans');

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

server.post('/kanbans/reorder', (req, res) => {
  try {
    const { updatedColumns, projectColumns } = reorderKanbans(
      router.db.get('kanbans').value(),
      req.body || {},
    );
    router.db.set('kanbans', updatedColumns).write();
    return res.status(200).json(projectColumns);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// router last
server.use(router);

const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`JSON Server is running at http://localhost:${port}`);
});
