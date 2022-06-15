import React from "react";
import { Card } from "antd";
import { useRouter } from "next/router";

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
            <img
              src={item['image']}
              className="image no-event"
              alt={item['name']}
              title={item['name']}
              loading="lazy"
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
