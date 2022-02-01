import React from "react";
import { useParams } from "react-router-dom";

export const CollectionsView = () => {
  const { type } = useParams<{ type: string }>();
  return (
    <div className="main-area">
      <div className="main-page">
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column'}}>
            <span>{`Collection ${type} page`}</span>
            <span>Comming soon</span>
          </div>
        </div>
      </div>
    </div>
  )
}