import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { app } from "../types/routes";
import Home from "pages/Home/Home";
import Collections from "pages/Collections/Collections";

export default function Views() {
  return (
    <Routes>
      <Route path={`${app.index}`} element={<Home />} />
      <Route path={`${app.collections}`} element={<Collections />} />
      <Route path={`${app.marketplace}/:id`} element={<MarketPlace />} />
      <Route path={`${app.stats}`} element={<Stats />} />
      <Route path={`${app.launchpad}`} element={<Launchpad />} />
      <Route path={`${app.sell}`} element={<Sell />} />
      <Route path={`${app.settings}`} element={<Settings />} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}

function MarketPlace() {
  return (
    <div className="w-full h-full bg-violet-500	">
      <p>MarketPlace</p>
    </div>
  );
}

function Stats() {
  return (
    <div className="w-full h-full bg-violet-500	">
      <p>Stats</p>
    </div>
  );
}

function Launchpad() {
  return (
    <div className="w-full h-full bg-violet-500	">
      <p>Launchpad</p>
    </div>
  );
}

function Sell() {
  return (
    <div className="w-full h-full bg-violet-500	">
      <p>Sell</p>
    </div>
  );
}

function Settings() {
  return (
    <div className="w-full h-full bg-violet-500	">
      <p>Settings</p>
    </div>
  );
}
