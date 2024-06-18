import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import ReactModal from 'react-modal';

const app = document.querySelector('#app');
const root = app && ReactDOM.createRoot(app);

ReactModal.setAppElement('#app');

root?.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
