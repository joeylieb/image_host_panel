import React from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom"
import './css/App.css';
import AuthProvider from "./components/AuthProvider";
import {Home} from "./pages/Home";
import {Login} from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import {Account} from "./pages/Account";
import {Admin} from "./pages/Admin";
import {Images} from "./pages/Images";
import {Image} from "./pages/Image";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/image/:imageID" element={<Image/>}/>
            <Route element={<PrivateRoute/>}>
                <Route path="/account" element={<Account/>}/>
            </Route>
            <Route element={<PrivateRoute/>}>
                <Route path="/admin" element={<Admin/>}/>
            </Route>
            <Route element={<PrivateRoute/>}>
                <Route path="/account/images" element={<Images/>}/>
            </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
