import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";

import Home from "./components/Home";
import Console from "./pages/console";
import Withdraw from "./pages/withdraw";
import Deposit from "./pages/deposit";
import IPOApply from "./pages/ipo";
import AdminDashboard from "./components/AdminDashboard";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/console" element={<Console />} />
        <Route path="/withdraw" element={<Withdraw />} />
        <Route path="/deposit" element={<Deposit />} />
        <Route path="/ipo" element={<IPOApply />} />
        <Route path="/*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
