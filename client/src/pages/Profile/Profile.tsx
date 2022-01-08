import CopyArea from "components/CopyArea/CopyArea";
import Header from "components/Header/Header";
import React, { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import "./index.css";

export default function Profile() {
  const [key, setKey] = useState("myItems");
  return (
    <div className="main page profile-page">
      <Header />
      <section className="author-area explore-are popular-collections-area main-content">
        <div className="container mt-5">
          <section>
            <div className="collection-info flex flex-col items-center w-full p-2">
              <div className="relative">
                <div className="w-40 h-40 border-white border-solid border-2 object-center object-cover rounded-full overflow-hidden">
                  <img
                    loading="lazy"
                    className="border-white border-solid border-2 object-center object-cover rounded-full w-40 h-40"
                    src="https://avatars.dicebear.com/api/jdenticon/14hChT3R3QjtJY6KzGoWQTz7aborR7ywApRJDh6w7jnF.svg"
                    alt="avatar"
                  />
                  <div className="absolute right-0 bottom-6 h-10">
                    <div
                      className="inline"
                      data-tooltipped=""
                      aria-describedby="tippy-tooltip-2"
                      data-original-title="Verified avatar, owned by this user"
                    ></div>
                  </div>
                </div>
              </div>
              <h1 className="text-3xl mt-4 max-w-2xl text-center"></h1>
              <div className="flex items-center">
                <button
                  type="button"
                  className="inline-flex justify-center items-center rounded-md text-color-primary bg-color-third px-2 py-1 opacity-80 text-sm w-40"
                >
                  <span>14hChT3R3Q...jnF</span>
                </button>
              </div>
              <div className="mt-2">
                <button className="inline-flex justify-center items-center rounded-md text-color-primary edit-btn">
                  Edit Profile
                </button>
              </div>
            </div>
            <div className="pt-2">
              <div>
                <div className="row attributes attributes-row">
                  <div className="col-lg-3 col-6 attributes-column">
                    <div className="p-3 bg-color-third flex flex-col rounded-xl h-full relative attributes-main">
                      <CopyArea value="123" />
                      <span className="text-sm uppercase tracking-wide truncate text-color-secondary">
                        total floor value
                      </span>
                      <span className="text-color-primary text-base truncate attribute-value">
                        -- SOL
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Tabs activeKey={key} className="mb-3 me-tabs">
                  <Tab eventKey="myItems" title="My Items">
                    <div />
                  </Tab>
                  <Tab eventKey="listedItems" title="Listed Items">
                    <div />
                  </Tab>
                  <Tab eventKey="offersMode" title="Offers Mode">
                    <div />
                  </Tab>
                  <Tab eventKey="offersReceived" title="Offers Received">
                    <div />
                  </Tab>
                  <Tab eventKey="activities" title="Activities">
                    <div />
                  </Tab>
                </Tabs>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
