// server.js
const express = require('express');
const next = require('next');
const multer = require('multer');
const { parse } = require('csv-parse');
const stream = require('stream');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 } // Limitar a 50 MB
  });

  server.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No se ha cargado ningún archivo" });
    }

    try {
      const records = [];
      const parser = parse({
        columns: true,
        trim: true,
        skip_empty_lines: true
      });

      const bufferStream = new stream.PassThrough();
      bufferStream.end(req.file.buffer);
      bufferStream.pipe(parser);

      parser.on('readable', () => {
        let record;
        while ((record = parser.read()) !== null) {
          records.push(record);
        }
      });

      parser.on('end', () => {
        res.status(200).json({ data: records });
      });

      parser.on('error', (error) => {
        console.error("Error al procesar el archivo CSV:", error);
        res.status(500).json({ error: "Error al procesar el archivo CSV", message: error.message });
      });

    } catch (error) {
      console.error("Error general:", error);
      res.status(500).json({ error: "Error al procesar el archivo CSV", message: error.message });
    }
  });

  // Manejar todas las demás rutas con Next.js
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});