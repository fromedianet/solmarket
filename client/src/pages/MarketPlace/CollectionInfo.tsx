import React from "react";
import { FiCopy } from "react-icons/fi";
import globeImage from "assets/images/globe2.svg";
import twitterImage from "assets/images/twitter2.svg";
import discordImage from "assets/images/discord2.svg";
import flagImage from "assets/images/flag2.svg";
import ReadMore from "components/ReadMore/ReadMore";
import CopyArea from "components/CopyArea/CopyArea";

export default function CollectionInfo({ info }: any) {
  return (
    <div className="collection-info flex flex-col items-center w-full p-2 relative">
      <div className="w-40 h-40">
        <img
          loading="lazy"
          className="border-solid border-4 object-center object-cover rounded-full w-40 h-40 border-white"
          src="https://i.imgur.com/nMBgkj6.jpg"
          alt="avatar"
        />
      </div>
      <h1 className="text-4xl mt-4 max-w-2xl text-center text-color-primary mb-4">
        Space Runners
      </h1>
      <div
        role="group"
        className="flex relative lg:absolute lg:top-20 lg:right-6 mb-2"
      >
        <div className="inline mr-1">
          <a
            target="_blank"
            className="mr-1 hover:opacity-80"
            href="https://spacerunners.com/"
            rel="noreferrer"
          >
            <img src={globeImage} className="w-8 lg:w-10" alt="website" />
          </a>
        </div>
        <div className="inline mr-1">
          <a
            target="_blank"
            className="mr-1 hover:opacity-80"
            href="https://twitter.com/spacerunnersnft"
            rel="noreferrer"
          >
            <img src={twitterImage} className="w-8 lg:w-10" alt="twitter" />
          </a>
        </div>
        <div className="inline mr-1">
          <a
            target="_blank"
            className="mr-1 hover:opacity-80"
            href="https://discord.gg/spacerunners"
            rel="noreferrer"
          >
            <img src={discordImage} className="w-8 lg:w-10" alt="discord" />
          </a>
        </div>
        <div className="inline">
          <button className="hover:opacity-80 w-8 lg:w-10 h-10 flex justify-center items-center">
            <img src={flagImage} className="w-8 lg:w-10" alt="report" />
          </button>
        </div>
        <div
          className="modal fade"
          role="dialog"
          aria-labelledby="modal"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content position-relative bg-gray-100 rounded-20px p-2 border-gray-500">
              <div className="modal-header">
                <div>
                  <h2 className="text-xl font-bold">Report this collection</h2>
                </div>
                <span aria-hidden="true" className="modal-close-btn"></span>
              </div>
              <div className="modal-body">
                <div className="d-flex flex-column">
                  <div className="text-color-primary font-bold">
                    I think this collection is
                  </div>
                  <div className="me-dropdown-container mt-2 theme-me-dark-1">
                    <div className="cursor-pointer position-relative">
                      <input
                        className="no-border"
                        placeholder="Select a reason"
                        value=""
                      />
                      <div className="d-flex align-items-center h-100 chevron-down">
                        <img
                          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAClSURBVHgB7ZKxEcIwDAClsABLpOOosgSZALIAUMEGmA0omYARqKGjcEdSeZbEkZMUKWSf0uvvfOez5f/GAIqisFTl8VKVp9uS+cPufOXuMu6wxQw9gJFE9jTjAR+Ifs3dr7jDxtnfJi+QtmabF/B39huT05ChdX+9n0YcCNTOflIRiTwZSEWk8gCCABIG2SDtxkciuTgwj0yPRPLFhEjsOyqKEqcHTRZEVAqKpxgAAAAASUVORK5CYII="
                          className=""
                          alt="chevron-down"
                        />
                      </div>
                    </div>
                    <div
                      aria-label="dropdown-list"
                      className="dropdown text-secondary"
                      data-popper-reference-hidden="true"
                      data-popper-escaped="true"
                      data-popper-placement="bottom-start"
                    >
                      <div className="me-select dark-scroll-bar">
                        <div className="me-select-item flex">
                          Fake or possible scam
                        </div>
                        <div className="me-select-item flex">
                          Explicit and sensitive content
                        </div>
                        <div className="me-select-item flex">
                          IP infringement
                        </div>
                        <div className="me-select-item flex">Other</div>
                      </div>
                    </div>
                  </div>
                  <textarea
                    className="input-dark-1 mt-2"
                    placeholder="More details"
                  ></textarea>
                  <button
                    type="button"
                    className="inline-flex justify-center items-center rounded-md text-color-primary PlainButton_btn__24zB_ mt-8 PlainButton_disabled__YnGJP PlainButton_primary__34OCV"
                  >
                    Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-2">
        <div>
          <div className="row attributes attributes-row">
            <div className="col-lg-3 col-6 attributes-column">
              <div className="p-3 bg-color-third flex flex-column rounded-xl h-100 relative attributes-main">
                <CopyArea value="7.10" />
                <span className="text-xs uppercase tracking-wide truncate p-color-secondary">
                  Floor Price
                </span>
                <span className="text-color-primary text-base truncate attribute-value">
                  7.10 SOL
                </span>
              </div>
            </div>
            <div className="col-lg-3 col-6 attributes-column">
              <div className="p-3 bg-color-third flex flex-column rounded-xl h-100 relative attributes-main">
                <CopyArea value="25884.16" />
                <span className="text-xs uppercase tracking-wide truncate p-color-secondary">
                  Total Volume (ALL Time, ALL Marketplaces)
                </span>
                <span className="text-color-primary text-base truncate attribute-value">
                  25884.16 SOL
                </span>
              </div>
            </div>
            <div className="col-lg-3 col-6 attributes-column">
              <div className="p-3 bg-color-third flex flex-column rounded-xl h-100 relative attributes-main">
                <CopyArea value="18.52" />
                <span className="text-xs uppercase tracking-wide truncate p-color-secondary">
                  Avg Sale Price (Last 24HR)
                </span>
                <span className="text-color-primary text-base truncate attribute-value">
                  18.52 SOL
                </span>
              </div>
            </div>
            <div className="col-lg-3 col-6 attributes-column">
              <div className="p-3 bg-color-third flex flex-column rounded-xl h-100 relative attributes-main">
                <CopyArea value="680" />
                <span className="text-xs uppercase tracking-wide truncate p-color-secondary">
                  Total Listed Count
                </span>
                <span className="text-color-primary text-base truncate attribute-value">
                  680
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative overflow-hidden break-words read-more mt-3 max-w-2xl">
        <div className="read-more__description hasMore">
          <p className="p-color-primary">
            <ReadMore
              children="Space Runners is the first NFT Metaverse Fashion brand in
              collaboration with artists and brands, designing digitally through
              through Augmented Reality (AR) and plug-in's into the Metaverse as
              as items. As the genesis batch, Space Runners teamed up with NBA
              Champions Kyle Kuzma and Nick Young to launch a 10K Sneaker NFT
              Collection. Owners of the NFTs become members of an exclusive
              RUNNERS club, where they can reap members-only benefits such as
              tickets to NBA basketball games, signed Kyle Kuzma &amp; Nick Young
              merchandise, exclusive invites to NBA parties &amp; pick up games,
              auto-whitelist for Space Runners’ next drop, and more. Visit
              www.spacerunners.com for more information."
              maxLength={300}
            />
          </p>
        </div>
      </div>
    </div>
  );
}
