import React, { createContext, useState, ReactNode } from 'react';

interface FileContextProps {
  isLoading: boolean;
  fileType: string | null;
  startTime: Date | null;
  endTime: Date | null;
  setIsLoading: (isLoading: boolean) => void;
  setFileType: (fileType: string) => void;
  setStartTime: (startTime: Date) => void;
  setEndTime: (endTime: Date) => void;
}

const FileContext = createContext<FileContextProps>({
  isLoading: false,
  fileType: null,
  startTime: null,
  endTime: null,
  setIsLoading: () => {},
  setFileType: () => {},
  setStartTime: () => {},
  setEndTime: () => {},
});

export const FileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fileType, setFileType] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  return (
    <FileContext.Provider
      value={{ isLoading, fileType, startTime, endTime, setIsLoading, setFileType, setStartTime, setEndTime }}
    >
      {children}
    </FileContext.Provider>
  );
};

export default FileContext;
