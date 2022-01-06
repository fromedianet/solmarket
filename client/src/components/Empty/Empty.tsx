import React from "react";
import EmptyImage from "assets/images/empty.svg";

export default function Empty() {
  return (
    <div className="empty-container flex flex-column w-full items-center pb-4">
      <img src={EmptyImage} alt="no data" />
      <p className="text-4xl text-color-primary">Oops!</p>
      <p className="text-base text-color-secondary">
        It seems there’s no item you’re looking for. Give it another shot!
      </p>
    </div>
  );
}
