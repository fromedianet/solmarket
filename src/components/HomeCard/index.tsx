import React from "react";
import { Card } from "antd";
import Link from "next/link";

const HomeCard = ({
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
        <a>
          <div className="image-over image-container">
            <img
              src={item["image"]}
              className="image no-event image-placeholder"
              alt={item["name"]}
              title={item["name"]}
            />
          </div>
          <div className="card-caption">
            <span className="card-name">{item["name"]}</span>
            <div className="note">
              <span className="symbol">{item["name"]}</span>
              <img
                src="/icons/check-circle.svg"
                alt="check-circle"
                width={16}
                height={16}
              />
            </div>
          </div>
        </a>
      </Link>
    </Card>
  );
};

export default React.memo(HomeCard);
