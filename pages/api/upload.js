import multer from 'multer';
import { parse } from 'csv-parse';
import { createReadStream } from 'fs';
import { pipeline } from 'stream/promises';
import { IncomingForm } from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const upload = multer({ dest: 'uploads/' });

export default function handler(req, res) {
  const form = new IncomingForm({ multiples: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error processing file' });
      return;
    }

    const file = files.file[0];
    const filePath = file.filepath;

    try {
      const records = [];
      await pipeline(
        createReadStream(filePath),
        parse({ columns: true, trim: true, skip_empty_lines: true }),
        async (source) => {
          for await (const record of source) {
            records.push(record);
          }
        }
      );

      fs.unlinkSync(filePath); // Delete the uploaded file after processing

      res.status(200).json({ data: records });
    } catch (error) {
      console.error('Error processing CSV file:', error);
      res.status(500).json({ error: 'Error processing CSV file' });
    }
  });
}
