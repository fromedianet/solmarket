import React from "react";
import { Card } from "react-bootstrap";
import "./index.css";

export default function CollectionCard({ collection, handleDragStart }: any) {
  return (
    <div className="mx-1 flex justify-center">
      <a
        href={collection.link}
        onDragStart={handleDragStart}
        role="presentation"
      >
        <Card className="collection-card">
          <Card.Img
            variant="top"
            src={collection.image}
            className="aspect-square object-cover card-img"
          />
          <Card.Body>
            <Card.Title className="text-color-primary text-xl text-center line-clamp-2">
              {collection.name}
            </Card.Title>
            <Card.Text className="text-color-secondary text-sm text-center line-clamp-2">
              {collection.description}
            </Card.Text>
          </Card.Body>
        </Card>
      </a>
    </div>
  );
}
