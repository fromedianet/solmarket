import React from "react";
import { Accordion } from "react-bootstrap";
import AccordionBody from "react-bootstrap/esm/AccordionBody";
import { BsLightningCharge } from "react-icons/bs";
import { RiPulseLine } from "react-icons/ri";

export default function ItemActivities() {
  return (
    <div className="row">
      <div className="col-12">
        <Accordion defaultActiveKey="0" className="mt-2">
          <Accordion.Item eventKey="0">
            <Accordion.Header className="text-color-third">
              <span className="mr-2 text-color-pink">
                <BsLightningCharge size={24} />
              </span>
              <span className="text-base text-color-primary">
                No offers yet
              </span>
            </Accordion.Header>
            <AccordionBody className="tw-accordion-body">
              No data to display
            </AccordionBody>
          </Accordion.Item>
        </Accordion>
        <Accordion defaultActiveKey="0" className="mt-2">
          <Accordion.Item eventKey="0">
            <Accordion.Header className="text-color-third">
              <span className="mr-2 text-color-pink">
                <RiPulseLine size={24} />
              </span>
              <span className="text-base text-color-primary">Activities</span>
            </Accordion.Header>
            <AccordionBody className="tw-accordion-body">
              No data to display
            </AccordionBody>
          </Accordion.Item>
        </Accordion>
      </div>
    </div>
  );
}
