import React from 'react';
import styled from 'styled-components';

const EditableCell = styled.div`
  min-width: 100px;
  min-height: 20px;
  cursor: pointer;
`;

const GridCell: React.FC<{ data: any }> = ({ data }) => {
  return (
    <EditableCell contentEditable suppressContentEditableWarning>
      {data}
    </EditableCell>
  );
};

export default GridCell;
