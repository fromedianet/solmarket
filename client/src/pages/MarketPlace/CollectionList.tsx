import SearchBar from "components/SearchBar/SearchBar";
import React, { useState } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { FiRefreshCw } from "react-icons/fi";
import { BsFillGrid3X3GapFill, BsFillGridFill } from "react-icons/bs";
import useInfiniteScroll from "hooks/useInfiniteScroll";
import "./CollectionList.css";
import { Collection } from "types/itemTypes";
import dummy from "./dummy.json";
import CollectionCard from "components/Cards/CollectionCard";
import Empty from "components/Empty/Empty";

export default function CollectionList() {
  const [searchKey, setSearchKey] = useState("");
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
    <div>
      <div className="flex flex-col px-3">
        <div className="flex flex-col md:flex-row w-full">
          <div className="flex flex-1 items-center md:mr-3">
            <div className="mr-4 inline-flex">
              <FiRefreshCw size={24} color="#b450f7" />
            </div>
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
          <div className="flex-1 mt-3 md:mr-3 md-mt-0">
            <DropdownButton
              id="dropdown-basic-button"
              title="Dropdown button"
              className="me-dropdown"
            >
              <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
            </DropdownButton>
          </div>
          <div className="flex mt-3 md-mt-0">
            <div className="me-btn-group hidden lg:block" role="group">
              <button className="me-btn">
                <BsFillGridFill size={24} />
              </button>
              <button className="me-btn">
                <BsFillGrid3X3GapFill size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-2 collection-filter-tags">
        <div className="flex"></div>
      </div>
      <div className="mt-4 flex flex-col">
        <div className="flex flex-column items-center mt-4">
          {data.length > 0 ? (
            <div className="grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
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
    </div>
  );
}
