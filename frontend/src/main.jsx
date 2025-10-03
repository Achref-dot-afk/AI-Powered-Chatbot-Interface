import React from 'react'
import { Toaster } from "react-hot-toast"
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import {SnackbarProvider} from 'notistack'

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <SnackbarProvider>
      <App />
      <Toaster position="top-center" reverseOrder={false} />
    </SnackbarProvider>
  </BrowserRouter>
);
