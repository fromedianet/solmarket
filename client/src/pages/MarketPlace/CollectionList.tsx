import SearchBar from "components/SearchBar/SearchBar";
import React, { useState } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { FiRefreshCw } from "react-icons/fi";
import { BsFillGrid3X3GapFill, BsFillGridFill } from "react-icons/bs";
import useInfiniteScroll from "hooks/useInfiniteScroll";
import "./CollectionList.css";
import { Item } from "types/itemTypes";
import dummy from "./dummy.json";
import Empty from "components/Empty/Empty";
import ItemCard from "components/Cards/ItemCard";

export default function CollectionList() {
  const [searchKey, setSearchKey] = useState("");
  const prepareData = () => {
    let newList: Item[] = [];
    dummy.data.forEach((el) => {
      const item: Item = {
        name: el.name,
        id: el.id,
        image: el.image,
        price: el.price,
        address: el.address,
      };
      newList.push(item);
    });
    return newList;
  };

  const [list, setList] = useState<Item[]>(prepareData());
  const [data, setData] = useState<Item[]>(list);
  const fetchList = () => {
    console.log("fetch");
  };

  const [isFetching] = useInfiniteScroll(fetchList);

  const searchCollections = (event: any) => {
    const searchText = event?.target?.value;
    const filteredList = list.filter(
      (item: Item) =>
        item.name.toLowerCase().indexOf(searchText.toLowerCase()) >= 0
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
              title="Recently Listed"
              className="me-dropdown"
            >
              <Dropdown.Item href="#/action-1">Recently Listed</Dropdown.Item>
              <Dropdown.Item href="#/action-2">
                Price: Low to High
              </Dropdown.Item>
              <Dropdown.Item href="#/action-3">
                Price: High to Low
              </Dropdown.Item>
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
                return <ItemCard item={item} />;
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
