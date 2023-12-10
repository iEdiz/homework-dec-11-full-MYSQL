import express from 'express';
const cors = require('cors');
import { connection } from "./db";
const app = express();
const port = 3001;

app.use(cors({
  origin: '*'
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the server!');
});

app.post('/song', async (req, res) => {
  const { name, performer, description, releaseYear, image} = req.body;

  if (!name || !performer || !description || !releaseYear || !image) {
    res.status(400).send('Invalid Data');
    return;
  }

  // Execute the query to insert a new song
  connection.query(
    'INSERT INTO songs (name, performer, description, releaseYear, image) VALUES (?, ?, ?, ?, ?)',
    [name, performer, description, releaseYear, image],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      const insertedSongId = (results as any).insertId;

      res.json({ id: insertedSongId });
    }
  );
});

app.delete('/songs/:id', async (req, res) => {
  const songId = req.params.id;
  console.log('Deleting song with ID:', songId);

  connection.query(
    'DELETE FROM songs WHERE id = ?',
    [songId],
    (error) => {
      if (error) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      res.json({ success: true });
    }
  );
});

app.put('/songs/:id', async (req, res) => {
  const songId = req.params.id;
  const { name, performer, description, releaseYear, image } = req.body;

  console.log('Editing song with ID:', songId);
  
  connection.query(
    'UPDATE songs SET name = ?, performer = ?, description = ?, releaseYear = ?, image = ? WHERE id = ?',
    [name, performer, description, releaseYear, image, songId],
    (error) => {
      if (error) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      res.json({ success: true });
    }
  );
});

app.get('/songs', async (req, res) => {
  // Execute the query to get all songs
  connection.query('SELECT * FROM songs', (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Send the users as a JSON response
    res.json({ songs: results });
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
