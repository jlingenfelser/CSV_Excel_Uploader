const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const { getXlsxStream } = require('xlstream');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

const detectDelimiter = (line) => {
    const delimiters = [',', ';', '\t', '|'];
    let maxCount = 0;
    let detectedDelimiter = ',';

    delimiters.forEach((delimiter) => {
        const count = line.split(delimiter).length;
        if (count > maxCount) {
            maxCount = count;
            detectedDelimiter = delimiter;
        }
    });

    return detectedDelimiter;
};

const parseCSV = (filePath, res) => {
    const fileStream = fs.createReadStream(filePath);
    let delimiter;

    fileStream.once('data', (chunk) => {
        const firstLine = chunk.toString().split('\n')[0];
        delimiter = detectDelimiter(firstLine);
        console.log(`Detected delimiter: ${delimiter}`);

        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv({ separator: delimiter }))
            .on('data', (data) => results.push(data))
            .on('end', () => {
                res.json(results);
                fs.unlinkSync(filePath); // Delete the file after processing
            })
            .on('error', (err) => {
                console.error('CSV Stream Error:', err);
                res.status(500).json({ error: 'Failed to parse the CSV file.' });
                fs.unlinkSync(filePath); // Delete the file after processing
            });
    });
};

const parseExcel = async (filePath, res) => {
    try {
        const stream = await getXlsxStream({ filePath, sheet: 0 });
        const rows = [];
        stream.on('data', (row) => {
            console.log('Row Data:', row);
            rows.push(row); // Alternatively only push this row.formatted.arr
        });
        stream.on('end', () => {
            console.log('Stream Ended');
            res.json(rows);
            fs.unlinkSync(filePath); // Delete the file after processing
        });
        stream.on('error', (err) => {
            console.error('Excel Stream Error:', err);
            res.status(500).json({ error: 'Failed to parse the Excel file.' });
            fs.unlinkSync(filePath); // Delete the file after processing
        });
    } catch (error) {
        console.error('File Processing Error:', error);
        res.status(500).json({ error: 'Failed to process the Excel file.' });
        fs.unlinkSync(filePath); // Delete the file after processing
    }
};

app.post('/upload', upload.single('file'), (req, res) => {
    const filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();

    if (fileExtension === '.csv') {
        parseCSV(filePath, res);
    } else if (fileExtension === '.xlsx' || fileExtension === '.xls') {
        parseExcel(filePath, res);
    } else {
        res.status(400).json({ error: 'Unsupported file type.' });
        fs.unlinkSync(filePath); // Delete the file if it's unsupported
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
