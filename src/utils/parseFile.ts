import { getXlsxStream } from 'xlstream';

export const parseFile = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const data = new Uint8Array(arrayBuffer);
        const blob = new Blob([data]);
        const fileURL = URL.createObjectURL(blob);

        const stream = await getXlsxStream({
          filePath: fileURL,
          sheet: 0,
        });

        const rows: any[] = [];
        stream.on('data', (row) => {
          console.log('Row Data:', row);
          rows.push(row.formatted.arr); // Make sure to push the formatted array
        });
        stream.on('end', () => {
          console.log('Stream Ended');
          resolve(rows);
        });
        stream.on('error', (err) => {
          console.error('Stream Error:', err);
          reject(new Error('Failed to parse the file. Please ensure it is a valid CSV or Excel file.'));
        });
      } catch (error) {
        reject(new Error('Failed to read the file. Please try again.'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read the file. Please try again.'));
    reader.readAsArrayBuffer(file);
  });
};
