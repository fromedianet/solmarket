import React, { useEffect, useState } from "react";
import { Row, Col, Input, Select } from "antd";
import CollectionCard from "../../components/CollectionCard";
import { useCollectionsAPI } from "../../hooks/useCollectionsAPI";
import CardLoader from "../../components/CardLoader";
import InfiniteScroll from "react-infinite-scroll-component";
import { EmptyView } from "../../components/EmptyView";
import { ExCollection } from "../../models/exCollection";
import { useMEApis } from "../../hooks/useMEApis";
import { MarketType } from "../../constants";

const { Search } = Input;

export default function CollectionsView({ type }: { type: string }) {
  const { getAllCollections, getNewCollections } = useCollectionsAPI();
  const meApis = useMEApis();
  const [selectedMarket, setSelectedMarket] = useState<MarketType>(
    MarketType.All
  );
  const [collections, setCollections] = useState<ExCollection[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [title, setTitle] = useState("");
  const [filters, setFilters] = useState<ExCollection[]>([]);
  const [items, setItems] = useState<ExCollection[]>([]);
  const PER_PAGE = 20;

  useEffect(() => {
    window.addEventListener("scroll", () => {}, { passive: true });
  }, []);

  useEffect(() => {
    setLoading(true);
    loadCollections(type)
      .then((res) => {
        setCollections(res);
        setFilters(res);
      })
      .finally(() => {
        setLoading(false);
      });

    if (type === "new") {
      setTitle("New Collections");
    } else if (type === "popular") {
      setTitle("Popular Collections");
    } else {
      setTitle("All Collections");
    }
  }, [type]);

  useEffect(() => {
    setHasMore(true);
    setItems(filters.slice(0, PER_PAGE));
  }, [filters]);

  async function loadCollections(type: string) {
    let data: ExCollection[] = [];
    if (type === "new") {
      data = await getNewCollections(true);
    } else if (type === "popular") {
      data = await meApis.getPopularCollections(true);
    } else {
      data = await getAllCollections();
    }
    return data;
  }

  const fetchMoreData = () => {
    if (items.length === filters.length) {
      setHasMore(false);
      return;
    }

    setTimeout(() => {
      setItems((prev) =>
        prev.concat(filters.slice(prev.length, prev.length + PER_PAGE))
      );
    }, 500);
  };

  const onSearchKey = (event) => {
    const key = event.target.value;
    setFilters(
      collections.filter((item) =>
        item.name.toLocaleLowerCase().includes(key.toLocaleLowerCase())
      )
    );
  };

  const onChangeMarket = (val) => {
    setSelectedMarket(val);
    if (val === MarketType.All) {
      setFilters(collections);
    } else {
      setFilters(collections.filter((item) => item.market === val));
    }
  };

  return (
    <div className="main-area">
      <div className="collections-page">
        <div className="title-container">
          <h1>{title}</h1>
        </div>
        <Row className="search-container">
          <Col span={24} md={24} lg={14}>
            <Search
              placeholder="Search collections by name"
              className="search-content"
              onChange={onSearchKey}
              allowClear
            />
          </Col>
          {(type === "all" || type === "new") && (
            <Col span={24} md={24} lg={10} className="radio-content">
              <Select
                className="select-container"
                value={selectedMarket}
                onSelect={(val) => onChangeMarket(val)}
                aria-controls="rc_select_1_list"
                aria-label="select market"
                aria-labelledby="select market"
                aria-expanded="false"
                aria-autocomplete="none"
                aria-readonly="true"
              >
                <Select.Option
                  value={MarketType.All}
                  role="option"
                  id="rc_select_1_list_0"
                >
                  All
                </Select.Option>
                <Select.Option value={MarketType.MagicEden} role="option">
                  MagicEden
                </Select.Option>
                <Select.Option value={MarketType.Solanart} role="option">
                  Solanart
                </Select.Option>
                <Select.Option value={MarketType.DigitalEyes} role="option">
                  DigitalEyes
                </Select.Option>
                <Select.Option value={MarketType.AlphaArt} role="option">
                  AlphaArt
                </Select.Option>
              </Select>
            </Col>
          )}
        </Row>

        {loading ? (
          [...Array(2)].map((_, idx) => <CardLoader key={idx} />)
        ) : items.length > 0 ? (
          // @ts-ignore
          <InfiniteScroll
            dataLength={items.length}
            next={fetchMoreData}
            hasMore={hasMore}
            className="ant-row"
            style={{ justifyContent: "center" }}
          >
            {items.map((item) => (
              <CollectionCard
                key={item.symbol}
                item={item}
                link={`/marketplace/${
                  item.market ? item.market : "papercity"
                }/${item.symbol}`}
              />
            ))}
          </InfiniteScroll>
        ) : (
          <EmptyView />
        )}
      </div>
    </div>
  );
}
