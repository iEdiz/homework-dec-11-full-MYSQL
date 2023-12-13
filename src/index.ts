import express, { Request, Response, NextFunction } from 'express';
const cors = require('cors');
import { connection } from "./db";
import { SongWithId } from './schema'
const app = express();
const port = 3001;

type PostResult = {
  insertId: number;
}

app.use(cors({
  origin: '*'
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the server!');
});

// const validateSong = (req: Request, res: Response, next: NextFunction) => {
//   try {
//     SongWithId.parse(req.body)

//     next()
//   } catch (error) {
//     console.error('Validation error:', error);
//     res.status(400).json({error: 'Invalid data'})
//   }
// }

app.post('/song', async (req, res) => {
  console.log('Request Payload:', req.body);
  const { name, performer, description, releaseYear, image} = req.body;

  // Execute the query to insert a new song
  connection.query(
    'INSERT INTO songs (name, performer, description, releaseYear, image) VALUES (?, ?, ?, ?, ?)',
    [name, performer, description, releaseYear, image],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      const insertedSongId = (results as PostResult).insertId;

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

app.get('/songs/:id', async (req, res) => {
  const songId = req.params.id;

  connection.query('SELECT * FROM songs WHERE id = ?', [songId], (error) => {
    if (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json({ success: true});
  });
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
