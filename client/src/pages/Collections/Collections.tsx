import Header from "components/Header/Header";
import SearchBar from "components/SearchBar/SearchBar";
import React, { useState } from "react";
import useInfiniteScroll from "hooks/useInfiniteScroll";
import "./index.css";
import CollectionCard from "components/Cards/CollectionCard";
import { Collection } from "types/itemTypes";
import dummy from "./dummy.json";
import Empty from "components/Empty/Empty";

export default function Collections() {
  const prepareData = () => {
    let newList: Collection[] = [];
    dummy.data.forEach((el) => {
      const item: Collection = {
        name: el.name,
        description: el.description,
        type: el.type,
        image: el.image,
        link: el.link,
      };
      newList.push(item);
    });
    return newList;
  };

  const [searchKey, setSearchKey] = useState("");
  const [list, setList] = useState<Collection[]>(prepareData());
  const [data, setData] = useState<Collection[]>(list);

  const fetchList = () => {
    console.log("fetch");
  };

  const [isFetching] = useInfiniteScroll(fetchList);

  const searchCollections = (event: any) => {
    const searchText = event?.target?.value;
    const filteredList = list.filter(
      (item: Collection) =>
        item.name.toLowerCase().indexOf(searchText.toLowerCase()) >= 0 ||
        item.description.toLowerCase().indexOf(searchText.toLowerCase()) >= 0
    );
    setData(filteredList);
    setSearchKey(searchText);
  };

  return (
    <div className="main page collection-page">
      <Header />
      <section className="mt-20">
        <div className="container">
          <div className="text-center">
            <p className="font-bold text-color-primary text-2xl md:text-5xl md:mt-20">
              Explore all collections
            </p>
          </div>
          <div className="position-relative m-auto mt-5 col-12 max-w-lg">
            <SearchBar
              value={searchKey}
              placeholder="Search"
              iconSize="1.7em"
              iconColor="rgb(89, 82, 128)"
              controlClass="searchbar"
              onChange={searchCollections}
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
            />
          </div>
          <div className="flex flex-column items-center mt-4">
            {data.length > 0 ? (
              <div className="grid grid-col-1 md:grid-cols-4 gap-2">
                {data.map((item) => {
                  return <CollectionCard collection={item} />;
                })}
              </div>
            ) : (
              <Empty />
            )}
            {isFetching && (
              <p className="text-color-primary text-base mt-4 mb-4">
                Fetching more collections...
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
