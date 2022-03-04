import React from 'react';
import { Routes } from './routes';
// import { Routes } from './views/preLaunch/routes'
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';

TimeAgo.addDefaultLocale(en);

function App() {
  return <Routes />;
}

export default App;
