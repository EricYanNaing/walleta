import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import 'animate.css';
import WOW from 'wow.js';
new WOW({
  boxClass: 'wow', // default
  animateClass: 'animate__animated', // default
  offset: 0, // distance to start animation (px)
  mobile: true, // trigger animations on mobile devices
  live: true, // act on asynchronously loaded content
}).init();
createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
)
