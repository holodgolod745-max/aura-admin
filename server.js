const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(__dirname));

if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({}, null, 2));
}

app.get('/api/data', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    res.json(data);
  } catch (err) {
    res.json({});
  }
});

app.post('/api/data', (req, res) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/sync', (req, res) => {
  try {
    const { key, value } = req.body;
    let data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    
    if (value === null) {
      delete data[key];
    } else {
      data[key] = value;
    }
    
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ Сервер запущен на порту ${PORT}`);
});
