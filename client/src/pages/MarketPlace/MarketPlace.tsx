import Header from "components/Header/Header";
import React, { useState } from "react";
import CollectionInfo from "./CollectionInfo";
import { FiList } from "react-icons/fi";
import { RiPulseLine } from "react-icons/ri";
import "./index.css";
import CollectionSidebar from "./CollectionSidebar";

export default function MarketPlace({ id }: any) {
  const [itemsSelected, setItemsSelected] = useState(true);

  return (
    <div className="main page marketplace-page">
      <Header />
      <section className="flex flex-col flex-auto mt-32">
        <div className="flex flex-col">
          <CollectionInfo />
        </div>
        <div className="flex flex-row justify-center border-b border-gray-500 border-solid">
          <div className="btn-group" role="group">
            <button
              type="button"
              className={`tab-btn ${itemsSelected && "selected"}`}
              onClick={() => setItemsSelected(true)}
            >
              <FiList size={24} color="#b450f7" />
              <p className="text-base ml-4">Items</p>
            </button>
            <button
              type="button"
              className={`tab-btn ${!itemsSelected && "selected"}`}
              onClick={() => setItemsSelected(false)}
            >
              <RiPulseLine size={24} color="#b450f7" />
              <p className="text-base ml-4">Activity</p>
            </button>
          </div>
        </div>
        <div className="flex relative">
          <CollectionSidebar />
        </div>
      </section>
    </div>
  );
}
