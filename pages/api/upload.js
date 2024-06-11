import multer from 'multer';
import nextConnect from 'next-connect';
import parse from 'csv-parse';

const upload = multer({ storage: multer.memoryStorage() });
const handler = nextConnect();

handler.post(upload.single('file'), async (req, res) => {
  try {
    const parser = parse(req.file.buffer, {
      columns: true,
      trim: true,
      skip_empty_lines: true
    });

    const records = [];
    for await (const record of parser) {
      records.push(record);
    }

    res.status(200).json({ data: records });
  } catch (error) {
    res.status(500).json({ error: 'Error processing your request' });
  }
});

export default handler;
export const config = {
  api: {
    bodyParser: false,
  },
};
