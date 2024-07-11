import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from './styles/GlobalStyles.ts';
import { theme } from './styles/theme.ts';
import DragAndDrop from './components/DragAndDrop.tsx';
import Grid from './components/Grid.tsx';
import { FileProvider } from './context/FileContext.tsx';

const App = () => {
  const [data, setData] = useState([]);

  return (
    <FileProvider>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <header>
          <h1>File Drop Example</h1>
          <p>Drag, Drop, and Edit Excel Files and CSV (automatic delimiter detection)</p>
        </header>
        <div className="container">
          <DragAndDrop setData={setData} />
          {data.length > 0 && <Grid data={data} />}
        </div>
      </ThemeProvider>
    </FileProvider>
  );
};

export default App;
