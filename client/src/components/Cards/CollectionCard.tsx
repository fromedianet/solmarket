import React from "react";
import { Card } from "react-bootstrap";
import "./index.css";

export default function CollectionCard({ collection, handleDragStart }: any) {
  return (
    <div className="mx-1">
      <a
        href={collection.link}
        onDragStart={handleDragStart}
        role="presentation"
      >
        <Card className="bg-gray-900 hover:bg-purple-700 collection-card">
          <Card.Img
            variant="top"
            src={collection.image}
            className="aspect-square object-cover card-img"
          />
          <Card.Body>
            <Card.Title className="text-gray-100 text-xl text-center text">
              {collection.name}
            </Card.Title>
            <Card.Text className="text-gray-400 text-sm text-center text">
              {collection.description}
            </Card.Text>
          </Card.Body>
        </Card>
      </a>
    </div>
  );
}
