import React from "react";
import { Card } from "antd";
import { useRouter } from "next/router";
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
  const router = useRouter();
  return (
    <Card className={`home-card`} hoverable={true} bordered={false}>
      <a onClick={() => router.push(link)}>
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
      </a>
    </Card>
  );
};
