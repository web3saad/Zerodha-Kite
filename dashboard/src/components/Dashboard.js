import React from "react";
import { Route, Routes } from "react-router-dom";

import Apps from "./Apps";
import Funds from "./Funds";
import Holdings from "./Holdings";
import IpoList from "./IpoList";

import Orders from "./Orders";
import Positions from "./Positions";
import Summary from "./Summary";
import WatchList from "./WatchList";
import TopBar from "./TopBar";
import Menu from "./Menu";
import StockChart from "./StockChart";
import OptionChain from "./optionchain";
import { GeneralContextProvider } from "./GeneralContext";

const Dashboard = () => {
  return (
    <>
      <Menu />
      <div className="dashboard-container">
        <div className="watchlist-section">
          <TopBar />
          <GeneralContextProvider>
            <WatchList />
          </GeneralContextProvider>
        </div>
        <div className="content">
          <Routes>
            <Route exact path="/" element={<Summary />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/holdings" element={<Holdings />} />
            <Route path="/positions" element={<Positions />} />
            <Route path="/bids" element={<IpoList />} />
            <Route path="/funds" element={<Funds />} />
            <Route path="/apps" element={<Apps />} />
            <Route path="/chart/:symbol" element={<StockChart />} />
            <Route path="/optionchain" element={<OptionChain />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
