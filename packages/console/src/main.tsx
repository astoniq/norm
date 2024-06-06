import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

const app = document.querySelector('#app');
const root = app && ReactDOM.createRoot(app);

root?.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
