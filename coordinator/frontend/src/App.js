import React, {useState, useEffect} from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Login from "./Components/authentication/Login";
import Signup from "./Components/authentication/Signup";
import AgentManagementPage from './Components/Agents/AgentManagementPage';


function App() {
  


  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} exact />
        <Route path='/database' element={<AgentManagementPage />} exact />
        <Route path='/signup' element={<Signup />} exact />
      </Routes>
    </Router>
  );
}

export default App;
