const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.static('.')); // Serve index.html, style.css

// SQLite Setup
const db = new sqlite3.Database('keys.db');
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS keys (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE,
        userId INTEGER,
        discordTag TEXT,
        used BOOLEAN DEFAULT 0,
        expires DATETIME DEFAULT (datetime('now', '+7 days'))
    )`);
});

// API: Generate Key (public for simplicity; add token check if needed)
app.post('/api/generate-key', (req, res) => {
    const { userId, discordTag, expiresDays = 7 } = req.body;
    if (!userId || !discordTag) return res.status(400).json({ error: 'Missing fields' });
    
    const key = Math.random().toString(36).substring(2, 15).toUpperCase();
    const expires = new Date(Date.now() + expiresDays * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');
    db.run(`INSERT INTO keys (key, userId, discordTag, expires) VALUES (?, ?, ?, ?)`, 
           [key, userId, discordTag, expires], (err) => {
        if (err) return res.status(500).json({ error: 'DB Error' });
        res.json({ key, expires, message: 'Key generated!' });
    });
});

// API: Get All Keys
app.get('/api/keys', (req, res) => {
    db.all(`SELECT * FROM keys ORDER BY id DESC`, (err, rows) => {
        if (err) return res.status(500).json({ error: 'DB Error' });
        res.json(rows);
    });
});

// API: Revoke Key
app.delete('/api/revoke-key/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM keys WHERE id = ?`, [id], (err) => {
        if (err) return res.status(500).json({ error: 'DB Error' });
        res.json({ message: 'Key revoked!' });
    });
});

// API: Stats
app.get('/api/stats', (req, res) => {
    db.get(`SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN used = 1 THEN 1 ELSE 0 END) as used,
        SUM(CASE WHEN used = 0 AND expires > datetime('now') THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN expires <= datetime('now') THEN 1 ELSE 0 END) as expired
        FROM keys`, (err, row) => {
        if (err) return res.status(500).json({ error: 'DB Error' });
        res.json(row || { total: 0, used: 0, active: 0, expired: 0 });
    });
});

// Public API: Validate Key (for Roblox)
app.get('/validate', (req, res) => {
    const { key, userId } = req.query;
    if (!key || !userId) return res.status(400).json({ error: 'Missing key or userId' });
    
    db.get(`SELECT * FROM keys WHERE key = ? AND userId = ? AND used = 0 AND expires > datetime('now')`, [key, parseInt(userId)], (err, row) => {
        if (err || !row) return res.json({ valid: false });
        
        db.run(`UPDATE keys SET used = 1 WHERE key = ?`, [key]);
        res.json({ valid: true, discordTag: row.discordTag });
    });
});

app.listen(port, () => {
    console.log(`Enhanced Server running at http://localhost:${port}`);
});
