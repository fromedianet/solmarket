import Link from "next/link";
import React from "react";
import { Card } from "antd";
import { ArtContent } from "../ArtContent";

export const HomeCard = ({
  item,
  link,
  itemId,
}: {
  item: {};
  link: string;
  itemId: string;
}) => {
  return (
    <Card className={`home-card`} hoverable={true} bordered={false}>
      <Link href={link}>
        <>
          <div className="image-over image-container">
            <ArtContent
              className="image no-event"
              uri={item["image"] || ""}
              preview={false}
              artview={true}
              allowMeshRender={false}
            />
          </div>
          <div className="card-caption">
            <span className="card-name">{item["name"]}</span>
            <div className="note">
              <span className="symbol">{item["name"]}</span>
              <img src="/icons/check-circle.svg" alt="check-circle" />
            </div>
          </div>
        </>
      </Link>
    </Card>
  );
};
