import React from 'react';
import { AppRoutes } from './routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { initDB } from 'react-indexed-db';
import { DBConfig } from './constants/IndexedDBConfig';

initDB(DBConfig);

function App() {
  return (
    <>
      <AppRoutes />
      <ToastContainer />
    </>
  );
}

export default App;
