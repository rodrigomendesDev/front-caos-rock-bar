import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import MainRoutes from './routes';
import { BrowserRouter } from 'react-router-dom';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <MainRoutes />
    </BrowserRouter>
  </React.StrictMode>
);
