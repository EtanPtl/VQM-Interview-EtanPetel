import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";;
import './index.css'
import App from './App.jsx'

// User browser router so that user can go to other pages
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
