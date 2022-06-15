import React from "react";
import { Card, Row, Col } from "antd";
import { formatAmount } from "../../../utils/utils";

export const ProfileCard = ({
  item,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  itemId,
  onSelect,
}: {
  item: {};
  itemId: string;
  onSelect: (a: string) => void;
}) => {
  return (
    <Card
      className="profile-card"
      hoverable={true}
      bordered={false}
      onClick={() => onSelect(item["symbol"])}
    >
      <div className="image-over image-container">
        <img
          className="image no-event image-placeholder"
          src={item["image"] || ""}
          alt={item["name"]}
          title={item["name"]}
          loading="lazy"
          width={248}
          height={248}
        />
      </div>
      <div className="card-caption">
        <span className="card-name">{item["name"]}</span>
        <Row style={{ width: "100%", marginTop: 8 }} gutter={8}>
          {item["volume"] > 0 && (
            <Col span={12}>
              <span className="mint-item">
                <span style={{ fontWeight: 500 }}>{`${formatAmount(
                  item["volume"],
                  2,
                  true
                )} SOL`}</span>
              </span>
            </Col>
          )}
          <Col span={item["volume"] > 0 ? 12 : 24}>
            <span className="mint-item">
              Items:{" "}
              <span style={{ fontWeight: 500, marginLeft: 4 }}>
                {formatAmount(item["items"], 0, true)}
              </span>
            </span>
          </Col>
        </Row>
      </div>
    </Card>
  );
};
