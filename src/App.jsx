import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import './App.css';
import './index.css';
import { Toaster} from 'react-hot-toast';
import Homepage from "./Components/homePage/homepage.jsx";
import Developer from "./Components/homePage/develober.jsx";
import AboutUs from "./Components/homePage/about.jsx";
import OurServices from "./Components/homePage/ourServices.jsx";
import AxiosInterceptorComponent from './utils/AxiosInterceptorComponent.jsx'; 

function App() {
  return (
    <>
      <Router>
        {/* Axios Interceptor Wrapper inside Router */}
        <AxiosInterceptorComponent>
          <Routes>
            {/* Everyone can access these routes */}
            <Route path="/" element={<Homepage />} />
            <Route path="/developer" element={<Developer />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/service" element={<OurServices />} />

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AxiosInterceptorComponent>
      </Router>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 5000,
          style: {
            borderRadius: '0.2rem',
            padding: '1rem',
            background: 'green',
            color: '#fff',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            marginTop: '1rem',
          },
        }}
      />
    </>
  );
}

export default App;
