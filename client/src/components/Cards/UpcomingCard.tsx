import React from "react";
import { Card } from "react-bootstrap";
import "./index.css";

export default function UpcomingCard({ collection, index }: any) {
  return (
    <div key={index}>
      <a href={collection.link}>
        <Card className="round-3xl bg-gray-900 hover:bg-purple-700 upcoming-card">
          <Card.Img
            variant="top"
            src={collection.image}
            className="aspect-video object-cover card-img"
          />
          <Card.Body>
            <Card.Title className="text-gray-100 text-xl text-center text">
              {collection.name}
            </Card.Title>
            <Card.Text className="text-gray-400 text-sm text-center text">
              {collection.description}
            </Card.Text>
            {collection.date && (
              <Card.Text className="text-gray-300 text-center">
                {collection.date}
              </Card.Text>
            )}
          </Card.Body>
        </Card>
      </a>
    </div>
  );
}
