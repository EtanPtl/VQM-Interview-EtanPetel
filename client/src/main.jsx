import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";;
import './index.css'
import App from './App.jsx'
import UserContext from './components/AuthContext.jsx';

// User browser router so that user can go to other pages
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserContext>
        <App />
      </UserContext>
    </BrowserRouter>
  </StrictMode>,
)
