import React from "react";
import { Card } from "react-bootstrap";
import "./index.css";

export default function UpcomingCard({ collection }: any) {
  return (
    <a href={collection.link}>
      <Card className="upcoming-card">
        <Card.Img
          variant="top"
          src={collection.image}
          className="aspect-video object-cover card-img"
        />
        <Card.Body>
          <Card.Title className="text-color-primary text-xl text-center text">
            {collection.name}
          </Card.Title>
          <Card.Text className="text-color-secondary text-sm text-center text">
            {collection.description}
          </Card.Text>
          {collection.date && (
            <Card.Text className="text-color-third text-center">
              {collection.date}
            </Card.Text>
          )}
        </Card.Body>
      </Card>
    </a>
  );
}
