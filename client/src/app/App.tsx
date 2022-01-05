import React from "react";
import Router from "./Router";
import Header from "components/Header/Header";

export default function App() {
  return (
    <div className="main home-page">
      <Header />
      <Router />
    </div>
  );
}
