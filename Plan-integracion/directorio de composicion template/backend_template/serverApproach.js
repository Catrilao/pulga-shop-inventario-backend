const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
  const header = req.header('x-frontend');
  if (!header || header !== 'A') {
    return res.status(403).json({ error: 'Forbidden - Backend_A only accepts Frontend_A' });
  }
  next();
});

const sandwiches = JSON.parse(fs.readFileSync(__dirname + '/data/sandwiches.json', 'utf8'));

app.get('/api/sandwiches', (req, res) => res.json(sandwiches));

app.get('/api/sandwiches/:name', (req, res) => {
  const s = sandwiches.find(x => x.name.toLowerCase() === req.params.name.toLowerCase());
  if (!s) return res.status(404).json({ error: 'Not found' });
  res.json(s);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend_A listening on ${PORT}`));
