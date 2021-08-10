const express = require('express');
const cors = require('cors');
const db = require('./app/models');
const dotenv = require('dotenv');
const http = require('http');

dotenv.config();

const app = express();

var corsOptions = {
  origin: '*',
};

db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    db.seed();
    console.log('Connected to the database!', db.url);
  })
  .catch((err) => {
    console.log('Cannot connect to the database!', err, db.url);
    process.exit();
  });

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get('/', (req, res) => {
  res.json({ message: 'api loaded succesfully' });
});

require('./app/routes/company.routes')(app);
require('./app/routes/group.routes')(app);
require('./app/routes/post.routes')(app);
require('./app/routes/role.routes')(app);
require('./app/routes/user.routes')(app);

/** Create server */
const httpServer = http.createServer(app);

// websocket for orders
const io = require('socket.io')(httpServer, { cors: corsOptions });
io.on('connection', (socket) => {
  if (socket.id) console.info('socket connected');
});
global.io = io;

// set port, listen for requests
const PORT = process.env.PORT || 8080;

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
