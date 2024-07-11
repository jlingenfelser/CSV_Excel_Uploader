import React, { useContext } from 'react';
import styled from 'styled-components';
import GridCell from './GridCell.tsx';
import { GridProps } from '../utils/types.ts';
import FileContext from '../context/FileContext.tsx';

const GridContainer = styled.div`
  overflow-x: auto;
  margin-top: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 8px;
`;

const Td = styled.td`
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 8px;
`;

const Grid: React.FC<GridProps> = ({ data }) => {
  const { fileType } = useContext(FileContext);

  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  let headers: string[];
  let rows: any[][];

  if (fileType === 'csv') {
    headers = Object.keys(data[0]);
    rows = data.map((row) => Object.values(row));
  } else if (fileType === 'excel' && data[0] && data[0].formatted) {
    headers = data[0].formatted.arr;
    rows = data.map((row) => row.formatted.arr);
  } else {
    return <div>Unsupported file type or invalid data format</div>;
  }

  return (
    <GridContainer>
      <Table>
        <thead>
          <tr>
            {headers.map((cell, index) => (
              <Th key={index}>{cell}</Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(1).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <Td key={cellIndex}>
                  <GridCell data={cell} />
                </Td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </GridContainer>
  );
};

export default Grid;