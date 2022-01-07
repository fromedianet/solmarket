import React from "react";
import { Card } from "react-bootstrap";
import "./index.css";

export default function CollectionCard({ collection, handleDragStart }: any) {
  return (
    <div className="col-12 col-sm-6 col-lg-3 flex justify-center item mb-4">
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
          <Card.Body className="px-4 pt-3 pb-4">
            <Card.Title className="text-color-primary text-base text-bold text-center line-clamp-2">
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
