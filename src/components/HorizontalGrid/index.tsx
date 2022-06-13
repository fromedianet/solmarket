import React from "react";
import { ScrollMenu } from "react-horizontal-scrolling-menu";
import { LeftArrow, RightArrow } from "./arrows";

export const HorizontalGrid = (props: { childrens: any }) => {
  return (
    <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow}>
      {props.childrens}
    </ScrollMenu>
  );
};
