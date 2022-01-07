import React, { useState } from "react";
import { Accordion } from "react-bootstrap";
import AccordionBody from "react-bootstrap/esm/AccordionBody";
import { RiPriceTag3Line, RiPulseLine } from "react-icons/ri";
import { IoMdDocument } from "react-icons/io";
import { AiFillTwitterCircle } from "react-icons/ai";
import {
  FiCopy,
  FiRefreshCw,
  FiShare2,
  FiShield,
  FiUser,
} from "react-icons/fi";
import { FaFacebook, FaTelegram } from "react-icons/fa";
import CheckIcon from "assets/icons/check.svg";

export default function ItemInfo() {
  const [connected, setConnected] = useState(true);

  return (
    <div className="row justify-center">
      <div className="col-12 col-lg-6">
        <div className="cursor-pointer item-info flex justify-center">
          <div className="item-thumb flex items-center justify-center">
            <img
              loading="lazy"
              className="card-img-top"
              src="https://cdn.magiceden.io/rs:fill:640:640:0:0/plain/https://www.arweave.net/UbXoAlOc0MJ55bjA5HhMtilSiEwrjFBXsrvdYU-PbPs?ext=png"
              alt="avatar"
            />
          </div>
        </div>
        <div className="none lg:block">
          <Accordion defaultActiveKey="0" className="mt-2">
            <Accordion.Item eventKey="0">
              <Accordion.Header className="text-color-third">
                <span className="mr-2 text-color-pink">
                  <RiPulseLine size={24} />
                </span>
                <span className="text-base text-color-primary">
                  Price history
                </span>
              </Accordion.Header>
              <AccordionBody className="tw-accordion-body">
                No data to display
              </AccordionBody>
            </Accordion.Item>
          </Accordion>
        </div>
      </div>
      <div className="col-12 col-lg-6">
        <div className="conent mt-5 lg:mt-0">
          <h3 className="m-0 item-title text-xl text-color-primary">
            SolStein #7449
          </h3>
          <div className="flex align-items-center">
            <a
              className="flex flex-1 items-center me-2 truncated collection-mark"
              href="/marketplace/solstein"
            >
              <img src={CheckIcon} alt="check" width={16} />
              <span className="text-base truncate mx-2">SolStein</span>
            </a>
            <div className="me-dropdown-container social-share mr-2">
              <div
                className="dropdown-toggle"
                id="dropdownMenu"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <div className="flex items-center justify-end dropdown-title">
                  <FiShare2 size={22} className="mr-1" />
                  Share
                </div>
              </div>
              <ul className="dropdown-menu" aria-labelledby="dropdownMenu">
                <li>
                  <a className="dropdown-item" href="#">
                    <FiCopy size={24} className="mr-2" />
                    Copy to Clipboard
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    <FaFacebook size={24} className="mr-2" />
                    Share on Facebook
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    <AiFillTwitterCircle size={24} className="mr-2" />
                    Share on Twitter
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    <FaTelegram size={24} className="mr-2" />
                    Share on Telegram
                  </a>
                </li>
              </ul>
            </div>
            <div className="inline-flex">
              <div
                className="flex hover:opacity-80 me-refresh-btn items-center"
                role="button"
              >
                <FiRefreshCw size={22} color="#b450f7" />
              </div>
            </div>
          </div>
          <div className="p-3 mt-3 mb-3 item-info-list flex flex-col bg-color-secondary rounded-xl">
            <span className="mb-1 text-sm text-color-secondary">
              Current Price
            </span>
            <div className="mb-2 flex flex-col">
              <div className="flex">
                <span className="text-color-pink mr-2">
                  <RiPriceTag3Line size={24} />
                </span>
                <span className="text-color-primary">25 SOL</span>
              </div>
            </div>
            {!connected ? (
              <div className="flex">
                <button className="me-btn inline-flex justify-center items-center flex-1 mr-3 bg-pink-gradient hover:opacity-60">
                  Connect Wallet
                </button>
              </div>
            ) : (
              <div className="flex">
                <button className="me-btn bg-pink-gradient hover:opacity-60 flex-1 mr-3">
                  Buy now
                </button>
                <div className="gradientBorderWrapper flex-1">
                  <button className="me-btn gradientBorder hover:bg-transparent">
                    Make an offer
                  </button>
                </div>
              </div>
            )}
            {connected && (
              <p className="mt-2 text-color-secondary">
                By clicking "Buy now" or "Make an offer", you agree to
                <a
                  target="_blank"
                  className="ml-1 hover:opacity-80 text-color-third"
                  href="https://magiceden.io/terms-of-service.pdf"
                  rel="noreferrer"
                >
                  <span className="text-color-pink-light">
                    Terms of Service
                  </span>
                </a>
              </p>
            )}
          </div>
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header className="text-color-third">
                <span className="mr-2 text-color-pink">
                  <FiUser size={24} />
                </span>
                <span className="text-base text-color-primary">
                  About SolStein
                </span>
              </Accordion.Header>
              <AccordionBody className="tw-accordion-body">
                No data to display
              </AccordionBody>
            </Accordion.Item>
          </Accordion>
          <div className="block lg:none">
            <Accordion defaultActiveKey="0" className="mt-2">
              <Accordion.Item eventKey="0">
                <Accordion.Header className="text-color-third">
                  <span className="mr-2 text-color-pink">
                    <RiPulseLine size={24} />
                  </span>
                  <span className="text-base text-color-primary">
                    Price history
                  </span>
                </Accordion.Header>
                <AccordionBody className="tw-accordion-body">
                  No data to display
                </AccordionBody>
              </Accordion.Item>
            </Accordion>
          </div>
          <Accordion defaultActiveKey="0" className="mt-2">
            <Accordion.Item eventKey="0">
              <Accordion.Header className="text-color-third">
                <span className="mr-2 text-color-pink">
                  <FiShield size={24} />
                </span>
                <span className="text-base text-color-primary">Attributes</span>
              </Accordion.Header>
              <AccordionBody className="attr-accordion-body">
                <div className="pt-2">
                  <div>
                    <div className="row attributes-row flex">
                      <div className="col-lg-4 col-12 attributes-column">
                        <div className="p-3 bg-color-third flex flex-col rounded-xl h-18 relative attributes-main">
                          <span className="text-xs uppercase tracking-wide truncate text-color-secondary">
                            Background
                          </span>
                          <span className="text-color-primary text-base truncate attribute-value">
                            Kinda Pink
                          </span>
                        </div>
                      </div>
                      <div className="col-lg-4 col-12 attributes-column">
                        <div className="p-3 bg-color-third flex flex-col rounded-xl h-18 relative attributes-main">
                          <span className="text-xs uppercase tracking-wide truncate text-color-secondary">
                            Background
                          </span>
                          <span className="text-color-primary text-base truncate attribute-value">
                            Kinda Pink
                          </span>
                        </div>
                      </div>
                      <div className="col-lg-4 col-12 attributes-column">
                        <div className="p-3 bg-color-third flex flex-col rounded-xl h-18 relative attributes-main">
                          <span className="text-xs uppercase tracking-wide truncate text-color-secondary">
                            Background
                          </span>
                          <span className="text-color-primary text-base truncate attribute-value">
                            Kinda Pink
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionBody>
            </Accordion.Item>
          </Accordion>
          <Accordion defaultActiveKey="0" className="mt-2">
            <Accordion.Item eventKey="0">
              <Accordion.Header className="text-color-third">
                <span className="mr-2 text-color-pink">
                  <IoMdDocument size={24} />
                </span>
                <span className="text-base text-color-primary">Details</span>
              </Accordion.Header>
              <AccordionBody className="tw-accordion-body">
                No data to display
              </AccordionBody>
            </Accordion.Item>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
