import multer from 'multer';
//import nextConnect from 'next-connect';
import { parse } from 'csv-parse/sync';

// Configuración de multer para almacenamiento en memoria
const upload = multer({ storage: multer.memoryStorage() });


const nextConnect = require('next-connect');

const handler = nextConnect({
    onError(error, req, res, next) {
        console.error(error); // Log del error en la consola del servidor
        res.status(500).json({ error: "Ha ocurrido un error al procesar la solicitud", message: error.message });
    },
    onNoMatch(req, res) {
        res.status(404).json({ error: "Endpoint no encontrado" });
    }
});

// Endpoint POST para cargar archivos
handler.post(upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No se ha cargado ningún archivo" });
    }

    try {
        // Parsea el CSV de manera sincrónica
        const records = parse(req.file.buffer, {
            columns: true,
            trim: true,
            skip_empty_lines: true
        });

        res.status(200).json({ data: records });
    } catch (error) {
        console.error("Error al procesar el archivo CSV:", error);
        res.status(500).json({ error: "Error al procesar el archivo CSV", message: error.message });
    }
});

export default handler;
export const config = {
    api: {
        bodyParser: false,
    },
};
