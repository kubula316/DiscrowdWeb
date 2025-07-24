import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {BrowserRouter} from "react-router";
import Routes from "./config/Routes.jsx";
import AppRoutes from "./config/Routes.jsx";
import App from "./App.jsx";
import {Toaster} from "react-hot-toast";


createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
          <Toaster/>
          <AppRoutes/>
      </BrowserRouter>
  </StrictMode>
)
