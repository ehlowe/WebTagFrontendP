import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// import App from './App.jsx'
import App from './App_Working_Periodic.jsx'
import RedirectApp from './redirect.jsx'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* create router */}
    {/* <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>
    </BrowserRouter>     */}
    <App />
  </StrictMode>,
)
