const express = require('express');
const cors = require('cors');
const { PORT, CORS_ALLOWED_ORIGINS, inTestEnv } = require('./env');
const connection = require('./db');

const app = express();
app.use(express.json());

connection.connect((err) => {
  if (err) {
    console.error('error connecting to db');
  } else {
    console.log('connected to db');
  }
});

// app settings
app.set('x-powered-by', false); // for security

const allowedOrigins = CORS_ALLOWED_ORIGINS.split(',');
const corsOptions = {
  origin: (origin, callback) => {
    if (origin === undefined || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

const students = [
  { lastName: 'BERDALA', firstName: 'Doriane' },
  { lastName: 'BOUTRIG', firstName: 'Youcef' },
  { lastName: 'DUBOIS', firstName: 'Cécile' },
  { lastName: 'GATTO', firstName: 'Ornella' },
  { lastName: 'GERARD', firstName: 'Solène' },
  { lastName: 'JAIMOND', firstName: 'Florian' },
  { lastName: 'JESUS', firstName: 'Nelson' },
  { lastName: 'KAMALO', firstName: 'Herança' },
  { lastName: 'MISSET', firstName: 'Edouard' },
  { lastName: 'MONGE', firstName: 'Brandon' },
  { lastName: 'REDONDO', firstName: 'Benoit' },
  { lastName: 'SCHNUR', firstName: 'Priscilia' },
  { lastName: 'GABORIT', firstName: 'Jonathan' },
  { lastName: 'MAUPIED', firstName: 'Joris' },
];

app.get('/students', (req, res) => {
  res.json(students);
});

const notesRouter = express.Router();
app.use('/notes', notesRouter);

notesRouter.get('/', (req, res) => {
  connection
    .promise()
    .query('SELECT * FROM notes')
    .then(([results]) => {
      res.json(results);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

notesRouter.post('/', (req, res) => {
  const { title, content } = req.body;
  connection
    .promise()
    .query('INSERT INTO notes (title, content) VALUES (?, ?)', [title, content])
    .then(([result]) => {
      res.json({ id: result.insertId, title, content });
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

// server setup
app.listen(PORT, () => {
  if (!inTestEnv) {
    console.log(`Server running on port ${PORT}`);
  }
});

// process setup : improves error reporting
process.on('unhandledRejection', (error) => {
  console.error('unhandledRejection', JSON.stringify(error), error.stack);
  process.exit(1);
});
process.on('uncaughtException', (error) => {
  console.error('uncaughtException', JSON.stringify(error), error.stack);
  process.exit(1);
});
process.on('beforeExit', () => {
  app.close((error) => {
    if (error) console.error(JSON.stringify(error), error.stack);
  });
});
