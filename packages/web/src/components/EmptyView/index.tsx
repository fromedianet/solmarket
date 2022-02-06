import React from "react";

export const EmptyView = () => {
  return (
    <div className="empty-container">
      <div className="empty-content">
        <img src='/icons/empty.svg' alt="no data" />
        <p className="empty-title">Oops!</p>
        <p className="empty-content">
          It seems there’s no item you’re looking for. Give it another shot!
        </p>
      </div>
    </div>
  );
}
