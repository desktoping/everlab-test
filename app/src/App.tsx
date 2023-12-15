import { BrowserRouter } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import Routing from './routes/Routing';
import React from 'react';

const App = () => {
  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        background: 'lightgray',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <BrowserRouter>
        <CssBaseline />
        <Routing />
      </BrowserRouter>
    </div>
  );
};

export default App;
