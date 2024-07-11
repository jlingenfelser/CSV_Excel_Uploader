import React, { useState, useRef, useContext } from 'react';
import styled from 'styled-components';
import FileContext from '../context/FileContext.tsx';
import { DragAndDropProps } from '../utils/types.ts';

const DropArea = styled.div<{ isDragging: boolean }>`
  border: 3px dashed ${({ theme }) => theme.colors.primary};
  border-radius: 10px;
  padding: 50px;
  text-align: center;
  background-color: ${({ isDragging }) => (isDragging ? '#e8f5e9' : '#ffffff')};
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-bottom: 20px;
`;

const LoadingMessage = styled.div`
  text-align: center;
  margin-top: 20px;
`;

const ErrorMessage = styled.div`
  text-align: center;
  margin-top: 20px;
  color: red;
`;

const DragAndDrop: React.FC<DragAndDropProps> = ({ setData }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isLoading, setIsLoading, setFileType, setStartTime, setEndTime } = useContext(FileContext);

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    setIsLoading(true);
    setError(null);
    setStartTime(new Date());
    const files = event.dataTransfer.files;
    if (files.length) {
      try {
        setData([]); // Clear the data before uploading a new file
        await uploadFile(files[0]);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setEndTime(new Date());
        setIsLoading(false);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length) {
      setIsLoading(true);
      setError(null);
      setStartTime(new Date());
      try {
        setData([]); // Clear the data before uploading a new file
        await uploadFile(files[0]);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setEndTime(new Date());
        setIsLoading(false);
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (fileExtension === 'csv') {
      setFileType('csv');
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      setFileType('excel');
    } else {
      setError('Unsupported file type');
      return;
    }

    const response = await fetch('/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    const result = await response.json();
    console.log('Uploaded Data:', result); // Log the data for debugging
    setData(result);
  };

  return (
    <>
      <DropArea
        isDragging={isDragging}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        {isLoading ? 'Loading...' : 'Drop your CSV or Excel file here, or click to select a file'}
      </DropArea>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".xlsx, .xls, .csv"
        onChange={handleFileInputChange}
      />
      {isLoading && (
        <LoadingMessage>
          <div className="spinner"></div>
          <p>Processing your spreadsheet...</p>
        </LoadingMessage>
      )}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </>
  );
};

export default DragAndDrop;
