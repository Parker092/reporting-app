import { useState } from 'react';
import TableComponent from '../components/TableComponent';

export default function Home() {
  const [data, setData] = useState([]);

  const handleUpload = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', event.target.file.files[0]);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    setData(result.data);
  };

  return (
    <div>
      <form onSubmit={handleUpload}>
        <input type="file" name="file" />
        <button type="submit">Upload</button>
      </form>
      <TableComponent data={data} />
    </div>
  );
}
