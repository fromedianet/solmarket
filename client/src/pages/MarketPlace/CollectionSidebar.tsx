import React, { useState } from "react";
import { Accordion } from "react-bootstrap";
import AccordionBody from "react-bootstrap/esm/AccordionBody";
import {
  FiArrowLeft,
  FiArrowRight,
  FiChevronDown,
  FiList,
  FiMinus,
  FiPlus,
} from "react-icons/fi";
import dummy from "./dummy.json";
import "./CollectionSidebar.css";

type Details = {
  value: string;
  floor: string;
};

type Attribute = {
  trait_type: string;
  data: Details[];
};

export default function CollectionSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const prepareAttributes = () => {
    let data: Attribute[] = [];
    let traitType = "";
    let attrs: Attribute = {
      trait_type: "",
      data: [],
    };
    dummy.availableAttributes.forEach((item) => {
      if (traitType === "") {
        attrs["trait_type"] = item.attribute.trait_type;
      } else if (item.attribute.trait_type !== traitType) {
        data.push(attrs);
        attrs = {
          trait_type: item.attribute.trait_type,
          data: [],
        };
      }
      attrs["data"].push({
        value: `${item.attribute.value} (${item.count})`,
        floor: `floor: ${item.floor / Math.pow(10, 9)}`,
      });
      traitType = item.attribute.trait_type;
    });
    data.push(attrs);

    console.log(data);
    return data;
  };

  const [attributes, setAttributes] = useState<Attribute[]>(prepareAttributes);

  return (
    <div
      className={`collectionSidebar bg-card-dark self-start sticky hidden md:flex ${
        collapsed && "collapsed"
      }`}
    >
      <div className="overflow-y-auto flex-1">
        <div>
          {collapsed ? (
            <div
              className="collectionSidebar__expand flex justify-center items-center hover:opacity-80 cursor-pointer"
              onClick={() => setCollapsed(false)}
            >
              <FiArrowRight size={24} />
            </div>
          ) : (
            <div className="flex flex-col">
              <header
                className="flex tw-p-4 text-lg bg-card-dark border-gray-500 border-solid border-b sticky top-0 cursor-pointer"
                onClick={() => setCollapsed(true)}
              >
                <div className="flex-1 self-start collectionSidebar__title">
                  Filters
                </div>
                <div className="cursor-pointer ml-auto collectionSidebar__collapse hover:opacity-80">
                  <FiArrowLeft size={24} />
                </div>
              </header>
              <div className="flex flex-col">
                <div className="me-collapsable">
                  <button
                    className="flex flex-row items-center w-full cursor-pointer tw-p-4 text-lg me-border-y border-gray-500"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapsePrice"
                    aria-expanded="false"
                    aria-controls="collapsePrice"
                  >
                    <FiList />
                    <div className="me-collapsable__title ml-2">
                      Price filter
                    </div>
                    <div className="ml-auto">
                      <FiPlus />
                    </div>
                  </button>
                  <div id="collapsePrice" className="tw-px-4 tw-pb-4">
                    <div className="me-price-filter flex flex-column p-12px">
                      <div className="me-dropdown-container mb-12px">
                        <div className="cursor-pointer relative">
                          <input
                            className="no-border"
                            value="SOL"
                            disabled={true}
                          />
                          <div className="h-100 chevron-down">
                            <FiChevronDown size={24} />
                          </div>
                        </div>
                      </div>
                      {/* <div className="flex items-center mb-12px">
                        <input
                          type="number"
                          placeholder="Min"
                          className="cursor-initial me-input-box no-border border-radius-8px focus-highlight"
                          value=""
                        />
                        <span className="mx-1">to</span>
                        <input
                          type="number"
                          placeholder="Max"
                          className="cursor-initial me-input-box no-border border-radius-8px focus-highlight"
                          value=""
                        />
                      </div> */}
                      <div className="gradientBorderWrapper">
                        <button className="me-btn inline justify-center items-center gradientBorder">
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="me-collapsable">
                  <button
                    className="flex flex-row items-center w-full cursor-pointer tw-p-4 text-lg me-border-y border-gray-500"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseAttributes"
                    aria-expanded="false"
                    aria-controls="collapseAttributes"
                  >
                    <FiList />
                    <div className="me-collapsable__title ml-2">
                      Attributes filter
                    </div>
                    <div className="ml-auto">
                      <FiPlus />
                    </div>
                  </button>
                  <div id="collapseAttributes" className="tw-px-4 tw-pb-4">
                    <Accordion defaultActiveKey="0">
                      {attributes.map((item, index) => {
                        return (
                          <Accordion.Item eventKey={index.toString()}>
                            <Accordion.Header>
                              {item.trait_type}
                            </Accordion.Header>
                            <AccordionBody className="tw-accordion-body">
                              {item.data.map((subItem) => {
                                return (
                                  <div className="flex flex-row justify-between subitem p-2">
                                    <p>{subItem.value}</p>
                                    <p>{subItem.floor}</p>
                                  </div>
                                );
                              })}
                            </AccordionBody>
                          </Accordion.Item>
                        );
                      })}
                    </Accordion>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {!collapsed && <div className="sidebar-resizer"></div>}
    </div>
  );
}
