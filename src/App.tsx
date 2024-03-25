import React from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom"
import './css/App.css';
import AuthProvider from "./components/AuthProvider";
import {Home} from "./pages/Home";
import {Login} from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import {Account} from "./pages/Account";
import {Admin} from "./pages/Admin";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route element={<PrivateRoute/>}>
                <Route path="/account" element={<Account/>}/>
            </Route>
            <Route element={<PrivateRoute/>}>
                <Route path="/admin" element={<Admin/>}/>
            </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
